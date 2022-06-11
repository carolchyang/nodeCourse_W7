const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "請輸入您的名字"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    photo: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "請輸入您的電子信箱"],
      // 去除兩邊空白
      trim: true,
      // 唯一索引
      unique: true,
      // lowercase 全部小寫 / uppercase 全部大寫
      lowercase: true,
      // 驗證 email，正規表達式來源： https://ithelp.ithome.com.tw/articles/10094951
      validate: {
        validator(value) {
          return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
            value
          );
        },
        message: "請輸入有效的電子郵件",
      },
      select: false,
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      // 驗證密碼為英數混和且為 8 個字元以上
      validate: {
        validator(value) {
          return /^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/.test(value);
        },
        message: "密碼需為英數混和且為 8 個字元以上",
      },
      minLength: 8,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

const User = new mongoose.model("user", userSchema);

module.exports = User;
