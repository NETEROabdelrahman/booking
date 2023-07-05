import express from "express";
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRouter } from "./routes/auth.js";
import { hotelRouter } from "./routes/hotels.js";
import { userRouter } from "./routes/users.js";
import { roomRouter } from "./routes/rooms.js";

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

app.use('/auth',authRouter)
app.use('/hotels',hotelRouter)
app.use('/users',userRouter)
app.use('/rooms',roomRouter)

mongoose.connect(process.env.CONNECTION_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    })


    const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log('running server')
})