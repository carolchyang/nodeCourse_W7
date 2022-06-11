const path = require("path");
const multer = require("multer");

// 上傳圖片 middleware
const uploadImage = multer({
  limit: {
    // 大小限制: 2MB
    fileSize: 2 * 1024 * 1024,
  },
  // 篩選資料
  fileFile(req, file, cb) {
    // 利用 path 取出得到得檔案副檔名，並轉小寫
    const ext = path.extname(file.originalname).toLowerCase();
    // 僅限 jpg、png、jpeg 格式
    if (ext != ".jpg" && ext != ".png" && ext != ".pneg") {
      cb(new Error("檔案格式僅限為 .jpg、.png、.pneg"));
    }
    cb(null, true);
  },
  // 可傳多個圖檔
}).any();

module.exports = uploadImage;
