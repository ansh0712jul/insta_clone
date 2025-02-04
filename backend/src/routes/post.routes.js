import { Router } from "express";
import { addPost, getAllPosts } from "../controllers/post.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-post").post(verifyJwt, upload.single("image"), addPost);
router.route("/get-all-posts").get(getAllPosts);

export default router