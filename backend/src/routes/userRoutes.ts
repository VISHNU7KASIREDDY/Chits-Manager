import {Router} from 'express'
import Routes from '../utils/interfaces/routes.interface'
import UserController from '../controllers/userController' 
import AuthMiddleware from '../middlewares/authMiddleware'
class UserRoutes implements Routes{
  path:string='/'
  router:Router=Router()
  public userController=new UserController()
  public authMiddleware=new AuthMiddleware()
  constructor(){
    this.initializeRoutes()
  }

  initializeRoutes(){
    this.router.post(`${this.path}register`,this.userController.register)
    this.router.post(`${this.path}login`,this.userController.login)
    this.router.get(`${this.path}profile`,this.authMiddleware.protect,this.userController.profile)
    this.router.get(`${this.path}admin`,this.authMiddleware.protect,this.authMiddleware.admin,this.userController.profile)
  }
}

export default UserRoutes;