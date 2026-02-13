import {Router} from 'express'
import Routes from '../utils/interfaces/routes.interface'
import AdminChitController from '../controllers/adminChitController'
import AuthMiddleware from '../middlewares/authMiddleware'

class AdminChitRoutes implements Routes{
  path:string='/chits'
  router:Router=Router()
  public authMiddleware=new AuthMiddleware()
  public adminChitController=new AdminChitController()

  constructor(){
    this.initializeRoutes()
  }

  initializeRoutes(){
    this.router.get(this.path,this.authMiddleware.protect,this.authMiddleware.admin,this.adminChitController.getAllChits)
  }
}