import { Document, Types } from "mongoose"

export type UserRole = "admin" | "member" | "viewer"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}
