import { Request,Response } from "express";
import { Types } from "mongoose";
import Chit from '../models/Chit'
import { IMonthlyPayment ,IMonth} from "../utils/interfaces/chit.interface";
import User from "../models/User";
import Notification from "../models/Notification";

class AdminChitController{
  public getAllChits=async (req:Request,res:Response)=>{
    try {
      const chits=await Chit.find()
      res.status(200).json(chits)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public getChitById=async (req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const chit=await Chit.findById(id)
        .populate("members", "name phone role")
        .populate("months.winner", "name phone")
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      res.status(200).json(chit)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public createChit=async (req:Request,res:Response)=>{
    try {
      const {name,chitValue,monthlyAmount,totalMembers,duration,startDate,endDate}=req.body
      const chit=new Chit({name,chitValue,monthlyAmount,totalMembers,duration,startDate,endDate,months:[] as IMonth[],members:[] as Types.ObjectId[]})
      const newChit=await chit.save()
      res.status(201).json(newChit)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public editChit=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {name,chitValue,monthlyAmount,totalMembers,duration,startDate,endDate}=req.body
      let chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      chit.name=name||chit.name
      chit.chitValue=chitValue||chit.chitValue
      chit.monthlyAmount=monthlyAmount||chit.monthlyAmount
      chit.totalMembers=totalMembers||chit.totalMembers
      chit.duration=duration||chit.duration
      chit.startDate=startDate||chit.startDate
      chit.endDate=endDate||chit.endDate

      const editedChit=await chit.save()
      res.status(200).json(editedChit)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteChit=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }else{
        await chit.deleteOne()
        res.status(200).json({message:"Chit deleted Successfully"})
      }
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public addMonthData=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {monthNumber,auctionAmount,winner}=req.body

      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({message:"monthNumber is required"})
      }

      const chit=await Chit.findById(chitId)

      if (!chit) {
        return res.status(404).json({message:"Chit not found"})
      }

      const monthExists=chit.months.some(
        (m)=>m.monthNumber === monthNumber
      )

      if (monthExists) {
        return res.status(400).json({message:"Month already exists"})
      }

      const bonusPerMember=Math.round(
        (chit.chitValue - auctionAmount) / chit.totalMembers
      )

      const finalChitAmount=chit.monthlyAmount - bonusPerMember

      const payments:IMonthlyPayment[]=chit.members.map((member)=>({
        member,
        isPaid:false
      }))

      chit.months.push({
        monthNumber,
        auctionAmount,
        winner,
        bonusPerMember,
        finalChitAmount,
        payments,
        auctionParticipants: []
      })

      await chit.save()

      return res.status(201).json({
        message:"Month added successfully",
        chit
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public editMonthData=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {monthNumber,auctionAmount,winner}=req.body
      let chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({message:"monthNumber is required"})
      }
      const month=chit.months.find(
        (m)=>m.monthNumber === monthNumber
      )
      if (!month) {
        return res.status(404).json({message:"Month not found"})
      }
      if (auctionAmount !== undefined) {
        month.auctionAmount=auctionAmount
        const bonusPerMember=Math.round((chit.chitValue - auctionAmount) / chit.totalMembers)
        month.bonusPerMember=bonusPerMember
        month.finalChitAmount=chit.monthlyAmount - bonusPerMember
      }

      if (winner !== undefined) {
        month.winner=winner
      }

      await chit.save()
      res.status(200).json(chit)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteMonthData=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {monthNumber}=req.body

      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({message:"monthNumber is required"})
      }
      const chit=await Chit.findByIdAndUpdate(
        chitId,
        { $pull: {months:{monthNumber}} },
        { new: true }
      )
      if (!chit) {
        return res.status(404).json({message:"Chit not found"})
      }

      res.status(200).json({message:"MonthData removed successfully"})
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public addMembers=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {members,slots=1}=req.body
      if (!Array.isArray(members) || members.length === 0) {
        return res.status(400).json({message:"Members array is required"})
      }
      const validMembers=members
      .filter((id:string)=>Types.ObjectId.isValid(id))
      .map((id:string)=>new Types.ObjectId(id))

      if (validMembers.length === 0) {
        return res.status(400).json({message:"No valid memberIds provided"})
      }

      const slotsCount = Math.max(1, Math.min(Number(slots) || 1, 10))
      const membersToAdd: Types.ObjectId[] = []
      for (const m of validMembers) {
        for (let i = 0; i < slotsCount; i++) {
          membersToAdd.push(m)
        }
      }

      const updatedChit=await Chit.findByIdAndUpdate(
        chitId,
        { $push: { members: { $each: membersToAdd } } },
        { new: true }
      )

      if (!updatedChit) {
        return res.status(404).json({message:"Chit not found"})
      }
        res.status(200).json(updatedChit)

    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteMember=async (req:Request,res:Response)=>{
    try {
      const {id:chitId,memberId}=req.params
      if (!memberId || typeof memberId !== "string") {
        return res.status(400).json({message:"memberId must be a string"})
      }
      if (!Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({message:"Invalid memberId"})
      }

      const chit=await Chit.findById(chitId)
      if (!chit) {
        return res.status(404).json({message:"Chit not found"})
      }

      const idx = chit.members.findIndex(m => m.toString() === memberId)
      if (idx === -1) {
        return res.status(404).json({message:"Member not found in this chit"})
      }

      chit.members.splice(idx, 1)
      await chit.save()

      res.status(200).json({message:"Member slot removed successfully"})
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public editPaymentStatusOfMember=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {monthNumber,memberId,isPaid,paymentIndex}=req.body

      if (!Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({message:"Invalid memberId"})
      }

      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({message:"monthNumber is required"})
      }

      const chit=await Chit.findById(chitId)

      if (!chit) {
        return res.status(404).json({message:"Chit not found"})
      }

      const month=chit.months.find(
        (m)=>m.monthNumber === monthNumber
      )

      if (!month) {
        return res.status(404).json({message:"Month not found"})
      }

      let payment;
      if (typeof paymentIndex === 'number' && paymentIndex >= 0 && paymentIndex < month.payments.length) {
        payment = month.payments[paymentIndex]
      } else {
        payment=month.payments.find(
          (p)=>p.member.toString() === memberId
        )
      }

      if (!payment) {
        return res.status(404).json({message:"Payment record not found"})
      }

      payment.isPaid=isPaid
      payment.paidDate=isPaid ? new Date() : undefined

      await chit.save()

      return res.status(200).json({
        message:"Payment updated successfully",
        chit
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public markAllPaid=async (req:Request,res:Response)=>{
    try {
      const {id:chitId}=req.params
      const {monthNumber}=req.body

      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({message:"monthNumber is required"})
      }

      const chit=await Chit.findById(chitId)

      if (!chit) {
        return res.status(404).json({message:"Chit not found"})
      }

      const month=chit.months.find((m)=>m.monthNumber === monthNumber)

      if (!month) {
        return res.status(404).json({message:"Month not found"})
      }

      month.payments.forEach(p=>{
        p.isPaid=true
        p.paidDate=new Date()
      })

      await chit.save()

      return res.status(200).json({message:"All payments marked as paid",chit})
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public sendAuctionReminders = async (req: Request, res: Response) => {
    try {
      const { id: chitId } = req.params
      const { monthNumber } = req.body

      const chit = await Chit.findById(chitId)
      if (!chit) return res.status(404).json({ message: "Chit not found" })

      const uniqueMembers = new Set(chit.members.map(m => m.toString()))

      const notifications = Array.from(uniqueMembers).map(memberId => ({
        type: "auction_reminder",
        chitId: chit._id,
        chitName: chit.name,
        monthNumber: Number(monthNumber),
        toUser: memberId,
        message: `Auction reminder for ${chit.name} - Month ${monthNumber}`,
        isRead: false
      }))

      await Notification.insertMany(notifications)

      return res.status(200).json({ message: "Reminders sent successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }

  public toggleLiftedMember = async (req: Request, res: Response) => {
    try {
      const { id: chitId, memberId } = req.params
      const chit = await Chit.findById(chitId)
      if (!chit) return res.status(404).json({ message: "Chit not found" })

      if (!chit.liftedMembers) chit.liftedMembers = []

      const idx = chit.liftedMembers.findIndex(m => m.toString() === memberId)
      if (idx > -1) {
        chit.liftedMembers.splice(idx, 1)
      } else {
        chit.liftedMembers.push(memberId as any)
      }

      await chit.save()
      res.status(200).json({ message: "Lifted status updated", liftedMembers: chit.liftedMembers })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default AdminChitController;