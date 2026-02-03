import mongoose, { Schema } from "mongoose"
import { INotification } from "../utils/interfaces/notification.interface"

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ["auction_participation", "auction_reminder"],
      required: true,
    },
    chitId: {
      type: Schema.Types.ObjectId,
      ref: "Chit",
      required: true,
    },
    chitName: { type: String, required: true },
    monthNumber: { type: Number, required: true },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

notificationSchema.index({ toUser: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

const Notification = mongoose.model<INotification>("Notification", notificationSchema)

export default Notification
