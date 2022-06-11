var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const { resErrorProd, resErrorDev } = require("./service/resErrors");

const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const uploadRouter = require("./routes/upload");

var app = express();

// 當程式出現重大錯誤時
process.on("uncaughtException", (err) => {
  // 記錄錯誤，等服務處理完，停掉該 process
  console.error("Uncaught Exception");
  console.error(err);
  // 跳出，系統離開
  process.exit(1);
});

require("./connections");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(usersRouter);
app.use(postsRouter);
app.use(uploadRouter);

// 404 錯誤
app.use((req, res, next) => {
  res.status(404).send({
    status: "false",
    message: "無此路由",
  });
});

// 錯誤 middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  // dev
  if (process.env.NODE_ENV === "dev") {
    return resErrorDev(err, res);
  }

  // production

  // ValidationError - mongoose 自訂錯誤
  if (err.name === "ValidationError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "資料欄位未填寫正確，請重新輸入！";
    return resErrorProd(err, res);
  }

  if (err.name === "SyntaxError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格式錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  if (err.name === "CastError") {
    err.isOperational = true;
    err.statusCode = 400;
    err.message = "格示錯誤，請重新確認！";
    return resErrorProd(err, res);
  }

  if (err.code === 11000) {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "Email 已被使用, 請更改 Email!";
    return resErrorProd(err, res);
  }

  if (err.name === "MulterError") {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = "圖檔名稱未設定!";
    return resErrorProd(err, res);
  }

  // 捕捉漏網之魚
  resErrorProd(err, res);
});

// 未捕捉到的 catch
process.on("unhandledRejection", (err, promise) => {
  console.error("未捕捉到的 Rejection", promise);
  console.error("原因： ", err);
});

module.exports = app;
