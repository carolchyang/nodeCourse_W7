const resErrors = {
  // dev 模式
  resErrorDev(err, res) {
    res.status(err.statusCode).send({
      message: err.message,
      error: err,
      stack: err.stack,
    });
  },

  // production 模式
  resErrorProd(err, res) {
    // 判斷是否為自定義的錯誤
    if (err.isOperational) {
      res.status(err.statusCode).send({
        status: false,
        message: err.message,
      });
    } else {
      // log 記錄
      console.log("出現重大錯誤： ", err);

      // 送出罐頭預設訊息
      res.status(500).send({
        status: "error",
        message: "系統錯誤，請聯絡系統管理員",
      });
    }
  },
};

module.exports = resErrors;
