import { Request } from "express"

export type AuthRequest = Request & {
  user: {
    _id: string
    name: string
    phone: string
    role: string
  }
}
