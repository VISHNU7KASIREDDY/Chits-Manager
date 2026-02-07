import jwt from 'jsonwebtoken'
import User from '../models/User'
import { Request,Response,NextFunction } from 'express'

import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  user: {
    id: string;
  };
}


class AuthMiddleware{
  public protect =async (req:Request,res:Response,next:NextFunction)=>{
    let token
    let authHeader=req.headers.authorization
    if (authHeader&& authHeader.startsWith('Bearer')){
      try {
        token=authHeader.split(" ")[1]
        const decoded =jwt.verify(token,process.env.JWT_SECRET!) as CustomJwtPayload

        ;(req as any).user=await User.findById(decoded.user.id).select('-password') 
        next()
      } catch (error) {
        console.error("Token verification failed",error)
        return res.status(401).json({message:"Not authorized , token Failed"})
      }
    }else{
      return res.status(401).json({message:"Not Authorized , no token provided"})
    }
  }

  public admin=async (req:Request,res:Response,next:NextFunction)=>{
    if ((req as any).user && (req as any).user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({message:'Not authorized as an admin'});
    }
  }
}

export default AuthMiddleware;