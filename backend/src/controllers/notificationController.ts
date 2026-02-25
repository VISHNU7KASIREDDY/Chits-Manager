import { Response } from "express"
import Notification from "../models/Notification"
import { AuthRequest } from "../utils/interfaces/authRequest.interface"

class NotificationController {
  public getMyNotifications = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user._id
      const role = req.user.role

      let query: any = {}
      if (role === 'member') {
        query = { type: 'auction_reminder', toUser: userId }
      } else {
        query = { type: 'auction_participation' }
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(50)

      res.status(200).json(notifications)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }

  public markAsRead = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params
      const userId = req.user._id
      const role = req.user.role

      let filter: any = { _id: id }
      if (role === 'member') {
        filter.toUser = userId
        filter.type = 'auction_reminder'
      } else {
        filter.type = 'auction_participation'
      }

      const updated = await Notification.findOneAndUpdate(filter, { isRead: true })
      if (!updated) return res.status(404).json({ message: "Notification not found" })
      res.status(200).json({ message: "Marked as read" })
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }

  public getUnreadCount = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user._id
      const role = req.user.role

      let query: any = { isRead: false }
      if (role === 'member') {
        query.type = 'auction_reminder'
        query.toUser = userId
      } else {
        query.type = 'auction_participation'
      }

      const count = await Notification.countDocuments(query)
      res.status(200).json({ count })
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default NotificationController
