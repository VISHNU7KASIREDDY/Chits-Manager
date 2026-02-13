import { Request,Response } from "express";
import User from '../models/User'
class AdminUserController{
  public getAllUsers=async (req:Request,res:Response)=>{
    try {
      const users=await User.find()
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public createUser=async (req:Request,res:Response)=>{
    try {
      const {name,phone,password,role}=req.body
      let user=await User.findOne({phone})
      if(user){
        return res.status(400).json({message:"User already exists"})
      }
      user=new User({
        name,
        phone,
        password,
        role:role||'member'
      })
      await user.save()
      res.status(201).json({message:"User created successfully",user})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public editUser=async (req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const {name,phone,password,role}=req.body
      let user=await User.findById(id)
      if(!user){
        return res.status(404).json({message:"User not found"})
      }else{
        user.name=name||user.name
        user.phone=phone||user.phone
        user.password=password||user.password
        user.role=role||user.role
      }
      const updatedUser=await user.save()
      res.status(201).json({message:"User updated user",user:updatedUser})
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public deleteUser=async (req:Request,res:Response)=>{
    try {
      const {id}=req.params
      const user=await User.findById(id)
      if(!user){
        return res.status(404).json({message:"User not found"})
      }else{
        await user.deleteOne()
        res.status(201).json({message:"User deleted Successfully"})
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
}

export default AdminUserController;