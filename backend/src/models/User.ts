import mongoose, { Schema } from "mongoose"
import { IUser } from "../utils/interfaces/user.interface"

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true ,length:10},
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "viewer",
    },
  },
  { timestamps: true }
)

export const User = mongoose.model<IUser>("User", userSchema)
