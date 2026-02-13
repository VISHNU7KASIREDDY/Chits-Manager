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

        req.user=await User.findById(decoded.user.id).select('-password') 
        next()
      } catch (error) {
        console.error("Token verification failed",error)
        res.status(401).json({message:"Not authorized , token Failed"})
      }
    }else{
      res.status(401).json({message:"Not Authorized , no token provided"})
    }
  }

  public admin=async (req:Request,res:Response,next:NextFunction)=>{
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as an admin' });
    }
  }
}

export default AuthMiddleware;