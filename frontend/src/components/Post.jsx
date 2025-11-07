import { MessageSquare, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import CommentDialong from "./CommentDialong";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import axios from "axios";
import { useBackendUrl } from "@/context/UrlProvider";
import { toast } from "sonner";

const Post = ({ post }) => {
  const [open, setOpen] = useState(false);
  const { backendUrl } = useBackendUrl();
  const { user } = useUser();
  const [liked, setLiked] = useState(post?.likes?.includes(user._id));
  const [likes, setLikes] = useState(post?.likes?.length);
  console.log(post);
  const toggleLike = async () => {
    if (liked) {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/v1/post/${post?._id}/dislike`,
          {
            withCredentials: true,
          }
        );

        setLikes((prev) => prev - 1);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    } else {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/v1/post/${post?._id}/like`,
          {
            withCredentials: true,
          }
        );

        setLikes((prev) => prev + 1);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    }
    setLiked(!liked);
    // optional: call like API here
  };

  return (
    <motion.div
      key={post?._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-xl mx-auto mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={post?.author?.profilePicture}
          alt="author"
          className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
        />
        <div>
          <h1 className="font-semibold text-slate-900 dark:text-slate-100">
            {post?.author?.username}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(post?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Image */}
      {post?.image && (
        <div className="relative w-full">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-[480px] object-cover border-y border-slate-100 dark:border-slate-800"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex gap-6 items-center">
          {/* Like */}
          <button
            onClick={toggleLike}
            className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors"
          >
            <ThumbsUp
              className={`w-6 h-6 transition-transform duration-200 ${
                liked ? "fill-rose-500 text-rose-500 scale-110" : ""
              }`}
            />
            <span className="text-xs">{likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs">{post?.comments?.length}</span>
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4">
        <h2 className="text-sm">
          <span className="font-semibold mr-2 text-slate-900 dark:text-slate-100">
            {post?.author?.username}
          </span>
          <span className="text-slate-700 dark:text-slate-300">
            {post?.caption}
          </span>
        </h2>
      </div>

      {/* Comment Dialog */}
      <CommentDialong
        open={open}
        setOpen={setOpen}
        comments={post?.comments}
        postId={post._id}
      />
    </motion.div>
  );
};

export default Post;
