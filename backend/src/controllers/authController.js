import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
export const signup = async (req,res) =>{
    const {fullname, email, password}= req.body
    try {
        //hash passsword
        if(!fullname || !email || !password){
            return res.status(400).json({message : "All fields must be filled"});
        }


        if(password.length <6 ){
            return res.status(400).json({message : "password must contain atleast 6 characters"});
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({message : "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        })

        if(newUser){
            
            //generate token

            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message: "Invalid user data"})
        }

    } catch (error) {
        console.log("error in signup controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
};

export const login = async (req,res) =>{

    const {email,password}= req.body
    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invaild user"})
        }

        const isPassword=  await bcrypt.compare(password,user.password)

        if(!isPassword){
            return res.status(400).json({message: "Invaild password"})
        }
        generateToken(user._id,res)
        res.status(200).json({
                 _id: user._id,
                fullname: user.fullname,
                email: user.email,
                profilePic: user.profilePic,
    })

    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:" internal error"})
    }
};

export const logout = (req,res) =>{


    try {
        
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Log out success"})
    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:" internal error"})
    }
};


export const updateProfile = async (req, res) => {
    try {
        const {profilePic}= req.body;
       const userId= req.user._id;
       if(!profilePic){
        return res.status(400).json({message:"profile is required"});
       }

       const uploadResponse = await cloudinary.uploader.upload(profilePic)

       const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

       res.status(200).json(updatedUser);

    } catch (error) {
        res.status(500).json({message: "internal error"})
    }
};

export const checkAuth = (req,res)=> {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message:"Internal error"});
    }
}