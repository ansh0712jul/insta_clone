import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary  from "../utils/cloudinary.js"
import Comment from "../models/comments.model.js";

// endpoint to add a new post 

export const addPost = asyncHandler(async (req , res) =>{

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"unauthorized access")
    }

    const { caption } = req.body;
    console.log(caption);
    if(!caption){
        throw new ApiError(400,"caption is required")
    }

    const img = req.file?.path;
    if(!img){
        throw new ApiError(400,"image is required")
    }

    const imageUrl = await uploadOnCloudinary(img);
    if(!imageUrl){
        throw new ApiError(500,"something went wrong while uploading image")
    }

    const addedPost =await Post.create(
        {
            caption,
            image:imageUrl.url,
            author:userId
        }
    )

    if(!addedPost){
        throw new ApiError(500,"something went wrong while adding post")
    }


    // add post in post array of user
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"user not found")
    }
    user.posts.push(addedPost._id);
    await user.save({ValidateBeforeSave:false});


    await addedPost.populate({path:"author",select:"-password -refreshToken"})

    return res
    .status(201)
    .json(
        new ApiResponse(201, addedPost,"post added successfully")
    )
})

// ednpoint to get all posts

export const getAllPosts = asyncHandler(async (_, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({ path: "author", select: "username profileImg" })
        .populate({
            path: "comments",
            sort: { createdAt: -1 },
            populate: { path: "author", select: "username profileImg" }
        });

    if (!posts || posts.length === 0) {
        throw new ApiError(500, "Something went wrong while fetching posts");
    }

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

// endpoint to get post posted by user 

export const getPostsByUser = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"unauthorized access")
    }

    const posts = await Post.find({author:userId})
                    .sort({ createdAt: -1 })
                    .populate({ path: "author", select: "username profileImg" })
                    .populate({
                        path: "comments",
                        sort: { createdAt: -1 },
                        populate: { path: "author", select: "username profileImg" }
                    });

    if (!posts || posts.length === 0) {
        throw new ApiError(500, "Something went wrong while fetching posts");
    }

    return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
                           
})

// endpoint to like a post 

export const likeOrDislikePost = asyncHandler(async (req, res) => {
    
    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"unauthorized access")
    }

    const postId = req.params.postId;
    if(!postId){
        throw new ApiError(400,"post id is required")
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404,"post not found")
    }
    let msg = ""
    if(post.likes.includes(userId)){

        // $pull is used to remove an element from an array
        await post.updateOne({$pull:{likes:userId}})
        msg = "post disliked successfully"
    }
    else {

        // $addToSet is used to add unique elements to an array
        await post.updateOne({$addToSet:{likes:userId}})
        msg = "post liked successfully"
    }
    await post.save({ValidateBeforeSave:false});

    return res
    .status(200)
    .json(new ApiResponse(200,post,msg))
})

// endpoint to comment on a post 

export const commentOnPost = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    if(!userId){
        throw new ApiError(401,"unauthorized access")
    }

    const postId = req.params.postId;
    if(!postId){
        throw new ApiError(400,"post id is required")
    }

    const { text } = req.body;
    if(!text){
        throw new ApiError(400,"comment is required")
    }

    const post = await Post.findById(postId);
    if(!post){
        throw new ApiError(404,"post not found")
    }

    const comment = await Comment.create({
        text,
        post:postId,
        author:userId
    });
    await comment.populate({path:"author",select:"username profileImg"});

    if(!comment){
        throw new ApiError(500,"something went wrong while adding comment")
    }

    post.comments.push(comment._id);
    await post.save({ValidateBeforeSave:false});

    return res
    .status(201)
    .json(new ApiResponse(201,post ,"comment added successfully"))

})

// endpoint to get all comments on a post

export const getAllComments = asyncHandler(async (req, res) => {

    const postId = req.params.postId;
    if(!postId){
        throw new ApiError(400,"post id is required")
    }

    const comments = await Comment.find({post:postId})
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profileImg" });

    if (!comments || comments.length === 0) {
        throw new ApiError(500, "Something went wrong while fetching comments");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comments,"comments fetched successfully"))
})

