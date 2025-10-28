import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";
import cors from "cors"

import path from "path"; 

import  authRoutes from "./routes/authRoute.js";
import { connectDB } from "./lib/db.js";
import  messageRoutes from "./routes/messageRoute.js";
import { app,server } from "./lib/socket.js";

const __dirname= path.resolve();

dotenv.config();

app.use(express.json({ limit: "10mb" }));     // allows up to 10MB
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
        
    })
}

server.listen(process.env.PORT,()=>{
    console.log("server is running on Port:"+process.env.PORT)
    connectDB();
})
