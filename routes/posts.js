var express = require("express");
var router = express.Router();
const PostControllers = require("../controllers/posts");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../service/auth");

// 取得所有貼文
router.get("/posts", isAuth, handErrorAsync(PostControllers.getPosts));

// 取得指定用戶所有貼文
router.get(
  "/posts/user/:id",
  isAuth,
  handErrorAsync(PostControllers.getUserPosts)
);

// 取得單一貼文
router.get("/post/:id", isAuth, handErrorAsync(PostControllers.getPost));

// 新增貼文
router.post("/post", isAuth, handErrorAsync(PostControllers.createPost));

// 刪除單一貼文
router.delete("/post/:id", isAuth, handErrorAsync(PostControllers.deletePost));

// 按讚貼文
router.post(
  "/post/:id/like",
  isAuth,
  handErrorAsync(PostControllers.createLike)
);

// 取消按讚貼文
router.delete(
  "/post/:id/unlike",
  isAuth,
  handErrorAsync(PostControllers.deleteLike)
);

module.exports = router;
