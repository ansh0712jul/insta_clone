import { Router } from "express";
import { addPost, commentOnPost,  getAllComments, getAllPosts, getPostsByUser, likeOrDislikePost } from "../controllers/post.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/get-all-posts").get(verifyJwt ,getAllPosts);
router.route("/user/get-post").get(verifyJwt ,getPostsByUser);
router.route("/:postId/get/comment-on-post").get(verifyJwt ,getAllComments)
router.route("/add-post").post(verifyJwt, upload.single("image"), addPost);
router.route("/:postId/like-Or-Dislike-post").post(verifyJwt ,likeOrDislikePost);
router.route("/:postId/comment-on-post").post(verifyJwt ,commentOnPost);



export default router