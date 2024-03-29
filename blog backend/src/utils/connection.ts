import { connect } from "mongoose";

export const connectToDatabase = async ()=>{
    try{
        await connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch(err){
        return   console.log("not Connected to MongoDB");
    }
}