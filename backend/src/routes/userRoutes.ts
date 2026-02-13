import {Router} from 'express'
import UserController from '../controllers/userController' 

class UserRoutes {
  path:string='/'
  router:Router=Router()
  public userController=new UserController()
  constructor(){
    this.initializeRoutes()
  }

  initializeRoutes(){
    this.router.post(`${this.path}register`,this.userController.register)
    this.router.post(`${this.path}login`,this.userController.login)
  }
}

export default UserRoutes;