import { Document, Types } from "mongoose"

export interface INotification extends Document {
  type: "auction_participation" | "auction_reminder"
  chitId: Types.ObjectId
  chitName: string
  monthNumber: number
  fromUser?: Types.ObjectId
  toUser?: Types.ObjectId
  message: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}
