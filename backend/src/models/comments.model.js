import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    text:{
        type:String,
        trim:true,

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{
    timestamps:true
})

const Comment = mongoose.model("Post",commentSchema);

export default Comment