import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        trim: true,
        required: [true, "Caption is required"]
    },
    image: {
        type: String,
        trim: true,
        required: [true, "Image is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [  
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
export default Post;
