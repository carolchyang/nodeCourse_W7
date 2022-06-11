const jwt = require("jsonwebtoken");
const resSuccess = require("../service/resSuccess");
const handErrorAsync = require("../service/handErrorAsync");
const appError = require("../service/appError");
const User = require("../models/user");

// 驗證用戶
const isAuth = handErrorAsync(async (req, res, next) => {
  let token = "";

  // 取得 headers 中的 token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 若 token 不存在
  if (!token) {
    return next(appError(401, "尚未登入！", next));
  }

  // 驗證 token，若正確會回傳資料，錯誤則由 handErrorAsync 接收
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

  // 利用 decoded 到 User 資料庫找符合的資料
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(appError(401, "查無此用戶 ID", next));
  }

  // 將資料塞到自訂的 req user 屬性中
  req.user = currentUser;
  next();
});

// 產生 JWT token
const generateSendJWT = (res, statusCode, user) => {
  // 產生 token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });

  // 將傳入的密碼清空，避免不小心外洩
  user.password = undefined;
  const data = {
    token,
    user: {
      _id: user._id,
      name: user.name,
      photo: user.photo,
      gender: user.gender,
    },
  };
  resSuccess(res, statusCode, data);
};

module.exports = {
  isAuth,
  generateSendJWT,
};
