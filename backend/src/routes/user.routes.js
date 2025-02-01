import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/sign-up").post(registerUser);
router.route("/sign-in").post(loginUser);
router.route("/sign-out").post(verifyJwt,logoutUser);

export default router