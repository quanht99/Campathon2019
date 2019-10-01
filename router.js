const express = require("express");
const router = express.Router();
const UserController = require("./controller/User");
const PostController = require("./controller/Post");
const CommentController = require("./controller/Comment");
const NotificationController = require("./controller/Notification");
const RoleController = require("./controller/Role");

const upload = require("./middleware/uploadImage");
const verifyToken = require("./middleware/verifyToken");
const verifyPermission = require("./middleware/verifyPermission");


//User
router.post("/users/register", UserController.register);
router.post("/users/login", UserController.login);
router.get("/users", verifyToken, verifyPermission("list_user"), UserController.statisticUsers);
router.get("/users/:user_id",  UserController.getUser);
router.put("/users/:user_id", verifyToken, verifyPermission("change_permission"), UserController.changeRoleUser);


//Post
router.post("/posts", verifyToken, verifyPermission("create_post"), upload, PostController.createPost);
router.get("/posts", PostController.getListPost);
router.get("/posts/:post_id", PostController.getPost);
router.post("/posts/:post_id/vote", verifyToken, PostController.votePost);
router.get("/posts/:post_id/vote/check", verifyToken, PostController.checkVotePost);
router.put("/posts/:post_id", verifyToken, verifyPermission("confirm_post"), PostController.confirmPost);


//Comment
router.get("/posts/:post_id/comments", CommentController.getComments);
router.post("/posts/:post_id/comments", verifyToken, verifyPermission("create_comment"), upload, CommentController.createComment);
router.post("/comments/:comment_id/vote", verifyToken, CommentController.voteComment);
router.get("/comments/vote/check", verifyToken, CommentController.checkVoteComment);


//Notification
router.get("/notifications", verifyToken, NotificationController.getNotifications);
router.put("/notifications/:noti_id", verifyToken, NotificationController.changeStatusNotification);

//Role
router.get("/roles", verifyToken, verifyPermission("change_permission"), RoleController.getRoles);
module.exports = router;