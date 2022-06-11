// 捕捉未使用 try catch 造成的 catch 錯誤
const handErrorAsync = (func) => {
  // func 將 async fun 當作參數
  // middleware 接住 router 資料
  return (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
  };
};

module.exports = handErrorAsync;
