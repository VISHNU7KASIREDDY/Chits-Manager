import { Request,Response } from "express";
import User from '../models/User'
import jwt from "jsonwebtoken"
import { AuthRequest } from "../utils/interfaces/authRequest.interface";

class UserController{
  public register=async(req:Request,res:Response)=>{
    try {
      const {name,phone,password}=req.body
      let user=await User.findOne({phone})
      if (user){
        return res.status(400).json({message:"User already exists"})
      }
      user =new User({name,phone,password})
      await user.save()
      const payload={user:{id:user._id,role:user.role}};

      jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:"48h"},(error,token)=>{
        if(error) throw error
        res.status(201).json({
          user:{
            _id:user._id,
            name:user.name,
            phone:user.phone,
            role:user.role
          },
          token
        })
      })

    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }

  public login=async (req:Request,res:Response)=>{
  try{
    const {phone,password}=req.body
    console.log('Login attempt:', { phone, passwordProvided: !!password }); // DEBUG

    let user=await User.findOne({phone})
    console.log('User found:', user ? { id: user._id, role: user.role, phone: user.phone } : 'No user found'); // DEBUG

    if (!user){
      return res.status(400).json({message:"Invalid Credentials"})
    }
    const isMatch=await user.matchPassword(password)
    console.log('Password match:', isMatch); // DEBUG

    if (!isMatch){
      return res.status(400).json({message:"Invalid Credentials"})
    }

    const payload={user:{id:user._id,role:user.role}};

    jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:"48h"},(error,token)=>{
      if (error) throw error

      res.json({
        user:{
          _id:user._id,
          name:user.name,
          phone:user.phone,
          role:user.role
        },
        token,
      })
    })
  }catch(error){
      console.error(error)
      return res.status(500).json({message:"Server Error"})
  }
  }
  public profile=async (req:AuthRequest,res:Response)=>{
    res.json(req.user)
  }
  public admin=async (req:AuthRequest,res:Response)=>{
    res.json(req.user)
  }
  public getAllUsers=async (req:Request,res:Response)=>{
    try {
      const users=await User.find().select("-password")
      res.status(200).json(users)
    } catch (error) {
       console.error(error)
       return res.status(500).json({message:"Server Error"})
    }
  }

  public demoLogin=async (req:Request,res:Response)=>{
    try {
      const {role}=req.body
      if (!role || !['member','admin'].includes(role)){
        return res.status(400).json({message:"Invalid role. Must be 'member' or 'admin'"})
      }

      const demoAccounts:{[key:string]:{name:string,phone:string,password:string,role:string}}={
        member:{name:"Demo Member",phone:"0000000001",password:"demo@member123",role:"member"},
        admin:{name:"Demo Admin",phone:"0000000002",password:"demo@admin123",role:"admin"}
      }

      const account=demoAccounts[role]
      let user=await User.findOne({phone:account.phone})

      if (!user){
        user=new User({
          name:account.name,
          phone:account.phone,
          password:account.password,
          role:account.role
        })
        await user.save()
      }

      const payload={user:{id:user._id,role:user.role}}

      jwt.sign(payload,process.env.JWT_SECRET!,{expiresIn:"48h"},(error,token)=>{
        if (error) throw error
        res.json({
          user:{
            _id:user!._id,
            name:user!.name,
            phone:user!.phone,
            role:user!.role
          },
          token
        })
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
}

export default UserController;