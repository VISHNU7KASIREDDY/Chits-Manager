import { Request,Response } from "express";
import { Types } from "mongoose";
import Chit from '../models/Chit'
import { IMonthlyPayment ,IMonth} from "../utils/interfaces/chit.interface";

class AdminChitController{
  public getAllChits=async (req:Request,res:Response)=>{
    try {
      const chits=await Chit.find()
      res.status(200).json(chits)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public createChit=async (req:Request,res:Response)=>{
    try {
      const {name,chitValue,monthlyAmount,totalMembers,duration,startDate,endDate,months,members}=req.body
      const chit=new Chit({name,chitValue,monthlyAmount,totalMembers,duration,startDate,endDate,months:[] as IMonth[],members:[] as Types.ObjectId[]})
      const newChit=await chit.save()
      res.status(201).json(newChit)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public editChit=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
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
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteChit=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
      const chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }else{
        await chit.deleteOne()
        res.status(200).json({message:"Chit deleted Successfully"})
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public addMonthData=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
      const {monthNumber,auctionAmount,winner}=req.body
      let chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      let bonusPerMember=Math.round(auctionAmount/chit.totalMembers)
      let finalChitAmount=chit.monthlyAmount-bonusPerMember

      chit.months.push({monthNumber,auctionAmount,winner,bonusPerMember,finalChitAmount,payments: [] as IMonthlyPayment[]})
      await chit.save()
      res.status(200).json(chit)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public editMonthData=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
      const {monthNumber,auctionAmount,winner}=req.body
      let chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({ message: "monthNumber is required" });
      }
      const month = chit.months.find(
        (m) => m.monthNumber === monthNumber
      )
      if (!month) {
        return res.status(404).json({ message: "Month not found" });
      }
      if (auctionAmount !== undefined) {
        month.auctionAmount = auctionAmount;
        const bonusPerMember = Math.round(auctionAmount / chit.totalMembers);
        month.bonusPerMember = bonusPerMember;
        month.finalChitAmount = chit.monthlyAmount - bonusPerMember;
      }
  
      if (winner !== undefined) {
        month.winner = winner;
      }
  
      await chit.save()
      res.status(200).json(chit)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteMonthData=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
      const {monthNumber}=req.body

      if (!monthNumber || typeof monthNumber !== "number") {
        return res.status(400).json({ message: "monthNumber is required" });
      }
      const chit=await Chit.findByIdAndUpdate(
        chitId,
        { $pull: {months:{monthNumber}} },
        { new: true }
      );
      if (!chit) {
        return res.status(404).json({ message: "Chit not found" });
      }

      res.status(200).json({message:"MonthData removed successfully"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public addMembers=async (req:Request,res:Response)=>{
    try {
      const {chitId}=req.params
      const {members}=req.body
      let chit=await Chit.findById(chitId)
      if (!chit){
        return res.status(404).json({message:"Chit not found"})
      }
      members.forEach((member : Types.ObjectId)=> {
        chit.members.push(member)
      });
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteMember=async (req:Request,res:Response)=>{
    try {
      const {chitId,memberId}=req.params
      if (!memberId || typeof memberId !== "string") {
        return res.status(400).json({ message: "memberId must be a string" });
      }
      if (!Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ message: "Invalid memberId" });
      }
      const chit=await Chit.findByIdAndUpdate(
        chitId,
        { $pull: { members: new Types.ObjectId(memberId) } },
        { new: true }
      );
      if (!chit) {
        return res.status(404).json({ message: "Chit not found" });
      }
      res.status(200).json({message:"Member removed successfully"})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  
}

export default AdminChitController;