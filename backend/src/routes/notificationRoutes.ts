import { Router } from "express"
import NotificationController from "../controllers/notificationController"
import AuthMiddleware from "../middlewares/authMiddleware"
import Routes from "../utils/interfaces/routes.interface"

class NotificationRoutes implements Routes {
  path = "/notifications"
  router = Router()
  public notificationController = new NotificationController()
  public authMiddleware = new AuthMiddleware()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(this.path, this.authMiddleware.protect, this.notificationController.getMyNotifications)
    this.router.put(`${this.path}/:id/read`, this.authMiddleware.protect, this.notificationController.markAsRead)
    this.router.get(`${this.path}/unread-count`, this.authMiddleware.protect, this.notificationController.getUnreadCount)
  }
}

export default NotificationRoutes
