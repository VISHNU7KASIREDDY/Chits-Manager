import {Router} from 'express'
import Routes from '../utils/interfaces/routes.interface'
import ChitController from '../controllers/chitController' 
import AuthMiddleware from '../middlewares/authMiddleware'

class ChitRoutes implements Routes{
  path:string='/my-chits'
  router:Router=Router()
  public chitController=new ChitController()
  public authMiddleware=new AuthMiddleware()
  constructor(){
    this.initializeRoutes()
  }
  
  private initializeRoutes(){
    this.router.get(this.path,this.authMiddleware.protect,this.chitController.getMyChits)
    this.router.get(`${this.path}:id`,this.authMiddleware.protect,this.chitController.getChitById)
  }
  
}

export default ChitRoutes;