import { Request } from "express"

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: any
        name: string
        phone: string
        role: string
      }
    }
  }
}

export type AuthRequest = Request
