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
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public editChit=async (req:Request,res:Response)=>{
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public addMonthData=async (req:Request,res:Response)=>{
    try {
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public deleteChit=async (req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const chit=await Chit.findById(id)
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
}

export default AdminChitController;