import jwt from 'jsonwebtoken'
import User from '../models/User'
import { Response,NextFunction } from 'express'
import { AuthRequest } from "../utils/interfaces/authRequest.interface"

import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string;
  };
}


class AuthMiddleware{
  public protect =async (req:AuthRequest,res:Response,next:NextFunction)=>{
    let token
    let authHeader=req.headers.authorization
    if (authHeader&& authHeader.startsWith('Bearer')){
      try {
        token=authHeader.split(" ")[1]
        const decoded =jwt.verify(token,process.env.JWT_SECRET!) as CustomJwtPayload

        req.user=await User.findById(decoded.user.id).select('-password') as any
        next()
      } catch (error) {
        console.error("Token verification failed",error)
        return res.status(401).json({message:"Not authorized , token Failed"})
      }
    }else{
      return res.status(401).json({message:"Not Authorized , no token provided"})
    }
  }

  public admin=async (req:AuthRequest,res:Response,next:NextFunction)=>{
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({message:'Not authorized as an admin'});
    }
  }

  private static DEMO_PHONES=['0000000001','0000000002']

  public demoGuard=async (req:AuthRequest,res:Response,next:NextFunction)=>{
    if (req.user && AuthMiddleware.DEMO_PHONES.includes(req.user.phone)){
      return res.status(403).json({message:'Demo accounts cannot modify data'})
    }
    next()
  }
}

export default AuthMiddleware;