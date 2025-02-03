import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import{ 
    followOrUnfollowUser,
        getProfile, 
        getSuggestedUsers, 
        loginUser, 
        logoutUser, 
        registerUser, 
        updateProfile 
    } from "../controllers/user.controller.js";

const router = Router()

router.route("/sign-up").post(upload.single("profileImg"), registerUser);
router.route("/sign-in").post(loginUser);

// secured routes
router.route("/:id/get-profile").get(verifyJwt,getProfile);
router.route("/:userId/follow-unfollow").post(verifyJwt,followOrUnfollowUser);
router.route("/get-suggested-user").get(verifyJwt,getSuggestedUsers);
router.route("/update-profile").post(verifyJwt,upload.single("profileImg"),updateProfile);
router.route("/sign-out").post(verifyJwt,logoutUser);

export default router