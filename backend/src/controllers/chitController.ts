import { Request, Response } from "express";
import Chit from '../models/Chit'
import Notification from "../models/Notification";
import { AuthRequest } from "../utils/interfaces/authRequest.interface";

class ChitController{
  public getMyChits=async (req:AuthRequest,res:Response)=>{
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const id=req.user._id
      const chits=await Chit.find({members:id}).populate('months.winner', 'name phone')
      res.status(200).json(chits)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public getChitById=async(req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const chit=await Chit.findById(id)
        .populate("members", "name phone role")
        .populate("months.winner", "name phone")
      if (!chit){
        return res.status(404).json({message:"Chit not Found"})
      }
      res.status(200).json(chit)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public participateInAuction = async (req: AuthRequest, res: Response) => {
    try {
      const { id: chitId } = req.params
      const { monthNumber } = req.body
      const userId = req.user._id
      const userName = req.user.name

      const chit = await Chit.findById(chitId)
      if (!chit) return res.status(404).json({ message: "Chit not found" })

      const month = chit.months.find(m => m.monthNumber === Number(monthNumber))
      if (!month) return res.status(404).json({ message: "Month not found" })

      if (month.auctionParticipants.some(p => p.toString() === userId.toString())) {
        return res.status(400).json({ message: "Already participating" })
      }

      month.auctionParticipants.push(userId)
      await chit.save()

      await Notification.create({
        type: "auction_participation",
        chitId: chit._id,
        chitName: chit.name,
        monthNumber: Number(monthNumber),
        fromUser: userId,
        toUser: undefined, 
        message: `${userName} wants to participate in auction for ${chit.name} (Month ${monthNumber})`,
        isRead: false
      })

      res.status(200).json({ message: "Participation registered", chit })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default ChitController;