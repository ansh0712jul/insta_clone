import { Router } from "express";
import { getProfile, getSuggestedUsers, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/sign-up").post(upload.single("profileImg"), registerUser);
router.route("/sign-in").post(loginUser);

// secured routes
router.route("/sign-out").post(verifyJwt,logoutUser);
router.route("/:id/get-profile").get(verifyJwt,getProfile);
router.route("/get-suggested-user").get(verifyJwt,getSuggestedUsers);

export default router