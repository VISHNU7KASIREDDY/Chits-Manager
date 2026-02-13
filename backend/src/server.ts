import App from "./app"
import "dotenv/config"
import UserRoutes from "./routes/userRoutes"
const userRoutes=new UserRoutes()
const app = new App([userRoutes])

app.startServer()