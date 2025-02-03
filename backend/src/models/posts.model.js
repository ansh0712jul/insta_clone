import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    
    caption:{
        type:String,
        trim:true,
        required:[true,"caption is required"]

    },
    image:{
        type:String,
        trim:true,
        required:[true,"image is required"]
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
    ],
    comment:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
},
{
    timestamps:true
})

const Post = mongoose.model("Post",postSchema);

export default Post