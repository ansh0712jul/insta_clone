import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary  from "../utils/cloudinary.js"

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