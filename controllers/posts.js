const validator = require("validator");
const resSuccess = require("../service/resSuccess");
const appError = require("../service/appError");
const Post = require("../models/post");
const User = require("../models/user");

const posts = {
  // 取得所有貼文
  async getPosts(req, res, next) {
    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const keyword =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword) }
        : {};

    const posts = await Post.find(keyword)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(sort);

    resSuccess(res, 200, posts);
  },
  // 取得指定用戶所有貼文
  async getUserPosts(req, res, next) {
    const userId = req.params.id;

    // 驗證此用戶 ID 使否存在
    const isExist = await User.findById(userId).exec();
    if (!isExist) {
      return next(appError(400, "查無此用戶 ID", next));
    }

    // 排序
    const sort = req.query.sort == "asc" ? "createdAt" : "-createdAt";

    // 關鍵字搜尋
    const filter =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword), user: userId }
        : { user: userId };

    const posts = await Post.find(filter)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(sort);

    resSuccess(res, 200, posts);
  },
  // 取得單一貼文
  async getPost(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }

    const post = await Post.findById(id).populate({
      path: "user",
      select: "name photo",
    });

    // 若取得失敗
    if (!post) {
      return next(appError(400, "取得貼文失敗，查無此貼文 ID", next));
    }
    resSuccess(res, 200, post);
  },
  // 新增貼文
  async createPost(req, res, next) {
    const { image, content } = req.body;
    const userId = req.user._id;

    // 若沒寫內容
    if (!content) {
      return next(appError(400, "新增失敗，貼文內容必須填寫", next));
    }

    const newPost = await Post.create({
      user: userId,
      image,
      content,
    });

    resSuccess(res, 200, newPost);
  },
  // 刪除單一貼文
  async deletePost(req, res, next) {
    const { id } = req.params;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    const delPost = await Post.findByIdAndDelete(id, {
      new: true,
    });

    // 若取得失敗
    if (!delPost) {
      return next(appError(400, "刪除失敗，查無此貼文 ID", next));
    }

    // 回傳更新後的全部貼文
    const posts = await Post.find().populate({
      path: "user",
      select: "name photo",
    });

    resSuccess(res, 200, posts);
  },
  // 按讚貼文
  async createLike(req, res, next) {
    const { id } = req.params;
    const userId = req.user._id;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "按讚失敗，查無此貼文 ID", next));
    }

    const like = await Post.findOneAndUpdate(
      { _id: id },
      // 使用 $addToSet 語法，若不存在才新增
      { $addToSet: { likes: userId } }
    );

    // 若取得失敗
    if (!like) {
      return next(appError(400, "按讚失敗，查無此貼文 ID", next));
    }

    const data = {
      postId: id,
      userId,
    };

    resSuccess(res, 201, data);
  },
  // 取消按讚貼文
  async deleteLike(req, res, next) {
    const { id } = req.params;
    const userId = req.user._id;

    // 驗證此 ID 使否存在
    const isExist = await Post.findById(id).exec();
    if (!isExist) {
      return next(appError(400, "按讚失敗，查無此貼文 ID", next));
    }

    const like = await Post.findOneAndUpdate(
      { _id: id },
      { $pull: { likes: userId } }
    );

    // 若取得失敗
    if (!like) {
      return next(appError(400, "按讚失敗，查無此貼文 ID", next));
    }

    const data = {
      postId: id,
      userId,
    };

    resSuccess(res, 201, data);
  },
};

module.exports = posts;
