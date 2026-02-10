import express from "express"

import {connect} from "mongoose"

class App{
  public app:express.Application
  public port:string|number

  constructor(){
    this.app=express()
    this.port=3000
    this.initializeMiddlewares()
    this.connectDatabase()
  }

  public startServer(){
    this.app.listen(this.port,()=>{
      console.log(`server is running on port ${this.port}`)
    })
  }

  private initializeMiddlewares() {
    this.app.use(express.json())
  }

  private async connectDatabase() {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("MONGODB_URI is missing in environment variables")
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