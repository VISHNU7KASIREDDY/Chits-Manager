import { Request, Response } from "express"
import Notification from "../models/Notification"

class NotificationController {
  public getMyNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user._id
      const notifications = await Notification.find({
        $or: [{ toUser: userId }, { toUser: null }], 
      }).sort({ createdAt: -1 }).limit(50)

      const role = (req as any).user.role
      let filtered = notifications
      if (role === 'member') {
        filtered = notifications.filter(n => n.toUser?.toString() === userId.toString())
      } else if (role === 'admin') {
         filtered = notifications.filter(n => n.toUser?.toString() === userId.toString() || n.type === 'auction_participation')
      }

      res.status(200).json(filtered)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }

  public markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      await Notification.findByIdAndUpdate(id, { isRead: true })
      res.status(200).json({ message: "Marked as read" })
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }

  public getUnreadCount = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user._id
      const role = (req as any).user.role
      
      let query: any = { isRead: false }
      if (role === 'member') {
        query.toUser = userId
      } else {
        query.$or = [{ toUser: userId }, { type: 'auction_participation' }]
      }

      const count = await Notification.countDocuments(query)
      res.status(200).json({ count })
    } catch (error) {
      res.status(500).json({ message: "Server Error" })
    }
  }
}

export default NotificationController
