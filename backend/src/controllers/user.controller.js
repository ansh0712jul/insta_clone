import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/user.model.js";



//  helper function to generate access and refresh token 

const generateAccessTokenAndRefreshToken = async (userId) =>{
    try {
        const user = await User.findById(userId);

        if(!user){
            throw new ApiError(404,"user not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ValidateBeforeSave:false});

        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token");
    }
}


// endpoint to register a user 
export const registerUser = asyncHandler(async (req , res) =>{

    const {username, email , password} = req.body;

    if(
        [username,email,password].some((field) => field.trim() === "")
    ){
        throw new ApiError(400,"all fields are required");
    }

    //check for existing user

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if(existedUser){
        throw new ApiError(409,"user already exist")
    }

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        password
    
    });
    await user.save();

    const createdUser = await User.findOne(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user . please try again later");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201,createdUser,"user created successfully")
        )
})


// endpoin to login user 

export const loginUser = asyncHandler(async (req , res) =>{

    const {email , password,username} = req.body;

    if(!email && !password) {
        throw new ApiError(400,"email or password are required");
    }

    const loggedInUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if(!loggedInUser){
        throw new ApiError(401,"user does not exist ");
    }

    const isPasswordCorrect = await loggedInUser.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid user credentials");
    }

    const { accessToken , refreshToken } = await generateAccessTokenAndRefreshToken(loggedInUser._id);

    const user = await User.findById(loggedInUser._id).select("-password -refreshToken");

    // send cookies 

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken,
                    refreshToken
                },
                "user logged in succesfully"
            )
        )
})


