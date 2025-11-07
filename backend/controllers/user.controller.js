import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Post } from "../models/post.model.js";
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "user created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "please provide all the details",
    });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Can't find user with this email",
      });
    }

    const isPasswordMatch = bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);

        if (post.author.equals(user._id)) {
          return post;
        }
      })
    );

    const userToShow = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,

      posts: populatedPost,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      })
      .json({
        message: `${user.username} is logged in`,
        success: true,
        userToShow,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        maxAge: 0,
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    await user.populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const profilePicture = req.file;

    if (!profilePicture) {
      return res.status(400).json({
        success: false,
        message: "No profile picture uploaded",
      });
    }

    // Convert to data URI and upload to Cloudinary
    const fileUri = getDataUri(profilePicture);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update profile picture URL
    user.profilePicture = cloudResponse.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
