import { useUser } from "@/context/UserContext";
import React, { useRef, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useBackendUrl } from "@/context/UrlProvider";
import axios from "axios";

const CreatePost = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const imgRef = useRef(null);
  const [caption, setCaption] = useState("");
  const { backendUrl } = useBackendUrl();
  const [loading, setLoading] = useState(false);

  const createPostHandler = async (e) => {
    e.preventDefault();

    const file = imgRef.current?.files[0];
    if (!file) {
      toast.error("Please select an image to post.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${backendUrl}/api/v1/post/addPost`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Post created successfully!");
      console.log("Post response:", data);

      // Close dialog and reset form
      setOpen(false);
      setCaption("");
      imgRef.current.value = "";
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90px] bg-[#F4F2EE] max-lg:w-[350px] mb-5 gap-5 py-3 px-6 flex items-center rounded-lg w-full">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user?.profilePicture} className="object-cover" />
        <AvatarFallback>user</AvatarFallback>
      </Avatar>

      <div
        className="flex-9/12 bg-white text-black border rounded-2xl text-center hover:bg-[#d8d8d8] py-3 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Create Post
      </div>

      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false);
            setCaption("");
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a new post</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={createPostHandler}
            className="flex flex-col gap-5 items-center"
          >
            <Input
              type="text"
              placeholder="Enter a caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <Input type="file" className="hidden" ref={imgRef} />
            <Button
              type="button"
              onClick={() => imgRef.current.click()}
              disabled={loading}
            >
              Choose a photo
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
