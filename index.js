import express from "express"
import dotenv from "dotenv"
import cookiesParser from "cookie-parser"

import connectDB from "./config/db.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config()
connectDB()

const app = express()
app.use(express.json())
app.use(cookiesParser())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", userRoutes)

app.get("/", (req, res) => {
    res.send("hello")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})
