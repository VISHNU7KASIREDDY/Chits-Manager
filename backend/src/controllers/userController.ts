import { Request,Response } from "express";
import User from '../models/User'
import Chit from '../models/Chit'
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

  private seedDemoMemberData=async (userId:any)=>{
    const existingChits=await Chit.find({members:userId})
    if (existingChits.length>0) return

    const now=new Date()

    // Helper to generate month data with payments
    const generateMonths=(count:number,memberId:any,monthlyAmount:number,chitValue:number)=>{
      const months=[]
      for (let i=1;i<=count;i++){
        const auctionAmount=Math.round(chitValue-(chitValue*((Math.random()*0.08)+0.02)))
        const bonusPerMember=Math.round((chitValue-auctionAmount)/20)
        months.push({
          monthNumber:i,
          auctionAmount,
          winner:memberId,
          bonusPerMember,
          finalChitAmount:auctionAmount,
          auctionParticipants:[memberId],
          payments:[{
            member:memberId,
            isPaid:i<=count-1,
            paidDate:i<=count-1?new Date(now.getFullYear(),now.getMonth()-(count-i),15):undefined
          }]
        })
      }
      return months
    }

    const startDate1=new Date(now.getFullYear(),now.getMonth()-5,1)
    const endDate1=new Date(startDate1)
    endDate1.setMonth(endDate1.getMonth()+20)

    await Chit.create({
      name:"Gold Savings Group",
      chitValue:500000,
      monthlyAmount:25000,
      totalMembers:20,
      duration:20,
      startDate:startDate1,
      endDate:endDate1,
      members:[userId],
      months:generateMonths(5,userId,25000,500000),
      liftedMembers:[],
      status:"active"
    })

    const startDate2=new Date(now.getFullYear(),now.getMonth()-3,1)
    const endDate2=new Date(startDate2)
    endDate2.setMonth(endDate2.getMonth()+10)

    await Chit.create({
      name:"Silver Monthly Circle",
      chitValue:200000,
      monthlyAmount:20000,
      totalMembers:10,
      duration:10,
      startDate:startDate2,
      endDate:endDate2,
      members:[userId],
      months:generateMonths(3,userId,20000,200000),
      liftedMembers:[],
      status:"active"
    })
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

      // Seed demo chit data for member role
      if (role==='member'){
        await this.seedDemoMemberData(user._id)
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