import { Request,Response } from "express";
import Chit from '../models/Chit'

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
      
    } catch (error) {
      return res.status(500).json({message:"Server Error"})
    }
  }
}

export default AdminChitController;