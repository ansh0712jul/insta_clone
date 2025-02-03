import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";
import ApiError from "./apiError";


// cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        // upload file on cloudinary

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto",
        })

        // file has been uploaded successfully
        console.log("file has been uploaded successfully", response.url);

        return response;
        
    } catch (error) {
        console.log("cloudinary upload error",error)
        throw new ApiError(501 , error.message)
        
    }
    finally{
        // remove the locally saved temporary files as the upload got failed 
        fs.unlinkSync(localFilePath)
    }
}

export default uploadOnCloudinary;