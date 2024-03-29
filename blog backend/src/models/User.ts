import { Schema,model } from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    blogs:[{type:Schema.Types.ObjectId,ref:"Blog"}],
    comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]
});

export default model("User",userSchema);