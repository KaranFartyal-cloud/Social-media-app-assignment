import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useUser } from "@/context/UserContext";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-sky-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg w-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6"
      >
        {/* Profile Avatar */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "anticipate" }}
        >
          <Avatar className="h-32 w-32 border-4 border-rose-400 shadow-md">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback className="text-sm text-slate-500">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* Username and Edit Button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4"
        >
          <h1 className="text-2xl font-semibold text-slate-900 capitalize dark:text-slate-100">
            {user?.username || "User"}
          </h1>
          <Button
            onClick={() => navigate("/account/edit")}
            className="px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-md"
          >
            Edit Profile
          </Button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full text-center flex flex-col gap-3 mt-4"
        >
          <h2 className="text-lg text-slate-700 dark:text-slate-300">
            Posts Created:{" "}
            <span className="font-bold text-rose-600 dark:text-rose-400">
              {user?.posts?.length || 0}
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Email:{" "}
            <span className="font-medium">
              {user?.email || "Not Available"}
            </span>
          </p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-[2px] bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 rounded-full mt-6"
        ></motion.div>

        {/* Footer Tip */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4"
        >
          Manage your account details and stay connected.
        </motion.p>
      </motion.div>
    </main>
  );
};

export default UserProfile;
