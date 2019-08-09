const express = require("express");
const router = express.Router();
const UserController = require("./controller/User");
const PostController = require("./controller/Post");

const upload = require("./middleware/uploadImage");
const verifyToken = require("./middleware/verifyToken");


//User
router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);


//Post
router.post("/posts", upload, verifyToken, PostController.createPost);
router.get("/posts", PostController.getListPost);
router.get("/posts/:post_id", PostController.getPost);


module.exports = router;