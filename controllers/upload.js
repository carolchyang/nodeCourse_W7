const sizeOf = require("image-size");
const { ImgurClient } = require("imgur");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");

const upload = {
  // 上傳圖片
  async uploadImage(req, res, next) {
    const { type } = req.query;

    // 未上傳圖片
    if (!req.files.length) {
      return next(appError(400, "尚未上傳圖片！", next));
    }

    // 取得上傳圖片的資訊
    const dimensions = sizeOf(req.files[0].buffer);

    // 若為頭像圖片則限制寬高比、像素
    if (type == "photo") {
      // 圖片寬高需為 1:1
      if (dimensions.width !== dimensions.height) {
        return next(appError(400, "圖片寬高需為 1:1！", next));
      }
    }

    // 圖片解析度需大於 300
    if (dimensions.width < 300) {
      return next(appError(400, "圖片解析度需大於 300！", next));
    }

    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });

    const response = await client.upload({
      // 將檔案 chunk 轉為 base64
      image: req.files[0].buffer.toString("base64"),
      type: "base64",
      album: process.env.IMGUR_ALBUM_ID,
    });

    const data = response.data.link;

    resSuccess(res, 201, data);
  },
};

module.exports = upload;
