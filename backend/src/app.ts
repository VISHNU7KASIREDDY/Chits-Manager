import express from "express"
import cors from "cors"
import Routes from './utils/interfaces/routes.interface'
import {connect} from "mongoose"
import NotificationRoutes from './routes/notificationRoutes'

class App{
  public app:express.Application
  public port:string|number

  constructor(routes:Routes[]){
    this.app=express()
    this.port=process.env.PORT||3000
    this.initializeMiddlewares()
    this.initializeHealthCheck()
    const allRoutes = [...routes, new NotificationRoutes()];
    this.initializeRoutes(allRoutes)
    this.connectDatabase()
  }

  public startServer(){
    this.app.listen(this.port,()=>{
      console.log(`server is running on port ${this.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(cors())
    this.app.use(express.json())
  }

  private initializeRoutes(routes:Routes[]){
    routes.forEach((route) => {
      this.app.use("/", route.router)
    })
  }

  private initializeHealthCheck() {
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok' })
    })
  }

  private async connectDatabase() {
    let uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI is missing in environment variables")
    }

    if (!uri.includes('mongodb.net/chits')) {
          uri = uri.replace('mongodb.net/', 'mongodb.net/chitsdb')
    }

    try {
      await connect(uri)
      console.log("Database connected...")
    } catch (err) {
      console.error(err)
    }
  }
}


export default App