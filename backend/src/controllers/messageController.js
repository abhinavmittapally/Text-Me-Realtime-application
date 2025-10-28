import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id ;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        res.status(500).json({error:"Internaal error"})
    }
};

export const getMessages= async(req,res)=>{
    try {
        const { id:userToChatId }= req.params;
        const myId= req.user._id;

        const messages= await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({error:"Internal error"});
    }
};

export const sendMessage = async(req,res)=>{
    try {
        const {text, image}= req.body;
        const{id: receiverId}= req.params;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl= uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            image:imageUrl,
            text,
        });

        await newMessage.save();

        //soket io
        const recevierSocketId= getReceiverSocketId(receiverId);
        if(recevierSocketId){
            io.to(recevierSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({error:"Internal error"});
    }
};