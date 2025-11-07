import React, { useState } from "react";
import { useBackendUrl } from "@/context/UrlProvider";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";

const EditProfile = () => {
  const { backendUrl } = useBackendUrl();
  const { user, setUser, login } = useUser();

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();
    if (!profilePicture) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/profile/edit`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      login(data?.user);
      if (data.success) {
        setUser(data.user);
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center gap-6"
      >
        <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-slate-100">
          Edit Profile Picture
        </h1>

        {/* Profile Picture Preview */}
        <div className="relative group">
          <img
            src={preview}
            alt="Profile Preview"
            className="h-32 w-32 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          <label
            htmlFor="profilePicture"
            className="absolute bottom-0 right-0 bg-rose-600 p-2 rounded-full cursor-pointer text-white hover:bg-rose-700 transition-all"
          >
            <Camera className="h-5 w-5" />
          </label>
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
          Click the camera icon to select a new profile picture
        </p>

        <Button
          onClick={editProfileHandler}
          disabled={loading}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          {loading ? "Updating..." : "Save Changes"}
        </Button>
      </motion.div>
    </main>
  );
};

export default EditProfile;
