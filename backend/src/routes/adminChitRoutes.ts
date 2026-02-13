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
    this.router.post(this.path,this.authMiddleware.protect,this.authMiddleware.admin,this.adminChitController.createChit)
    this.router.put(`${this.path}:id`,this.authMiddleware.protect,this.authMiddleware.admin,this.adminChitController.editChit)
    this.router.post(`${this.path}:id`,this.authMiddleware.protect,this.authMiddleware.admin,this.adminChitController.addMonthData)
    this.router.delete(`${this.path}:id`,this.authMiddleware.protect,this.authMiddleware.admin,this.adminChitController.deleteChit)
  }
}