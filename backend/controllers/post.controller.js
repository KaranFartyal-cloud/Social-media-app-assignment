import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const caption = req.body.caption?.trim();

    const image = req.file;
    console.log(req.file);

    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "image is required",
      });
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(image.mimetype)) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    const optimisedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimisedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({
        message: "cant find user",
      });
    }

    user.posts.push(post._id);
    await user.save();

    await post.populate("author", "-password");

    return res.status(201).json({
      message: "new post added",
      post,
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  console.log("get all Post hitted");
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username email profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    console.log("get all post finished");
    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "cant find post",
      });
    }

    await post.updateOne({ $addToSet: { likes: likeUserId } });
    await post.save();

    return res.status(200).json({
      message: "post liked",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const disLikeUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "cant find post",
      });
    }

    await post.updateOne({ $pull: { likes: disLikeUserId } });
    await post.save();

    return res.status(200).json({
      message: "post disliked",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (!text) {
      return res.status(400).json({
        message: "Text is required",
        success: false,
      });
    }

    let comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    comment = await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    await comment.save();
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added",
      success: true,
      comment,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      success: false,
    });
  }
};

export const getPostComment = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username , profilePicture",
    });

    if (!comments) {
      return res.status(404).json({
        message: "No comments",
        success: false,
      });
    }

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "user is not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);

    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
