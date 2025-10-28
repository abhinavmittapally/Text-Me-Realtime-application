import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB);

    console.log(`Mongo db connected: ${conn.connection.host}`);
  }  
  catch(error){
    console.log("error:",error);
  }
};
