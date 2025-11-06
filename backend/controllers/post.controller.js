import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

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
    
};

export const getUserPost = async () => {};

export const likePost = async () => {};

export const dislikePost = async () => {};

export const addComment = async () => {};

export const getPostComment = async () => {};

export const deletePost = async () => {};
