import { Request,Response } from "express";
import User from '../models/User'
import jwt from "jsonwebtoken"

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
            phone:user.name,
            role:user.role
          },
          token
        })
      })

    } catch (error) {
      console.log(error)
      return res.status(500).json({message:"Server Error"})
    }
  }
  public login=async (req:Request,res:Response)=>{

  try{
    const {email,password}=req.body
    let user=await User.findOne({email})

    if (!user){
      return res.status(400).json({message:"Invalid Credentials"})
    }
    const isMatch=await user.matchPassword(password)

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
      res.status(500).send('Server error')
  }
  }
  public profile=async (req:Request,res:Response)=>{
    res.json(req.user)
  }
}

export default UserController;