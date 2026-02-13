import { Request,Response } from "express-serve-static-core";
import Chit from '../models/Chit'
class ChitController{
  public getMyChits=async (req:Request,res:Response)=>{
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const {id}=req.user._id
      const chits=await Chit.find({members:id})
      res.status(200).json(chits)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public getChitById=async(req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const chit=await Chit.findById(id).populate("members", "name phone role")
      if (!chit){
        return res.status(404).json({message:"Chit not Found"})
      }
      res.status(200).json(chit)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
}

export default ChitController;