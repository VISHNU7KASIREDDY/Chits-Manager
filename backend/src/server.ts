import App from "./app"
import "dotenv/config"
import UserRoutes from "./routes/userRoutes"
import ChitRoutes from './routes/chitRoutes'
import AdminUserRoutes from "./routes/adminUserRoutes"
import AdminChitRoutes from "./routes/adminChitRoutes"
const userRoutes=new UserRoutes()
const chitRoutes=new ChitRoutes()
const adminUserRoutes=new AdminUserRoutes()
const adminChitRoutes=new AdminChitRoutes()
const app = new App([userRoutes,chitRoutes,adminUserRoutes,adminChitRoutes])

app.startServer()