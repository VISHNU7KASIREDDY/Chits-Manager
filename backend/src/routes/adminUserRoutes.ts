import {Router} from 'express'
import Routes from '../utils/interfaces/routes.interface'
import AdminUserController from '../controllers/adminUserController'
import AuthMiddleware from '../middlewares/authMiddleware'
class AdminUserRoutes implements Routes{
  path:string='/users'
  router:Router=Router()
  public adminUserController=new AdminUserController()
  public authMiddleware=new AuthMiddleware()

  contructor(){
    this.initializeRoutes()
  }

  initializeRoutes(){
    this.router.get(this.path,this.authMiddleware.protect,this.authMiddleware.admin,this.adminUserController.getAllUsers)
    this.router.post(this.path,this.authMiddleware.protect,this.authMiddleware.admin,this.adminUserController.createUser)
    this.router.put(`${this.path}:id`,this.authMiddleware.protect,this.authMiddleware.admin,this.adminUserController.editUser)
    this.router.delete(`${this.path}:id`,this.authMiddleware.protect,this.authMiddleware.admin,this.adminUserController.deleteUser)
  }
}

export default AdminUserRoutes;