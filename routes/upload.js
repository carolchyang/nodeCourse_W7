var express = require("express");
var router = express.Router();
const UploadControllers = require("../controllers/upload");
const handErrorAsync = require("../service/handErrorAsync");
const { isAuth } = require("../service/auth");
const image = require("../service/image");

// 上傳圖片
router.post(
  "/upload",
  isAuth,
  image,
  handErrorAsync(UploadControllers.uploadImage)
);

module.exports = router;
