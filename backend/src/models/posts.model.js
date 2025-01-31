import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    caption:{
        type:String,
        trim:true,

    },
    image:{
        type:String,
        trim:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        }
    ]
},
{
    timestamps:true
})

const Post = mongoose.model("Post",postSchema);

export default Post