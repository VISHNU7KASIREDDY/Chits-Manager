import { Document, Types } from "mongoose"

export type UserRole = "admin" | "member" | "viewer"

export interface IUser extends Document {
  name: string
  phone: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  matchPassword(enteredPassword: string): Promise<boolean>;
}
