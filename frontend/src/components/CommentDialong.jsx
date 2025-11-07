import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useBackendUrl } from "@/context/UrlProvider";
import axios from "axios";
import { toast } from "sonner";
const CommentDialong = ({ open, setOpen, comments, postId }) => {
  const [addComment, setAddComment] = useState("");
  const { backendUrl } = useBackendUrl();

  const AddCommentHandler = async (e) => {
    e.preventDefault();
    if (!addComment.trim()) return toast.error("Comment cannot be empty");

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/v1/post/${postId}/comment`,
        { text: addComment },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Comment added");
        setAddComment("");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };
  return (
    <Dialog open={open} setOpen={setOpen}>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false);
        }}
      >
        <DialogTitle></DialogTitle>
        <form onSubmit={AddCommentHandler} className="flex items-center gap-3">
          <Input
            placeholder="Type here to add your own comment"
            type={"text"}
            className={"border-black"}
            onChange={(e) => setAddComment(e.target.value)}
            value={addComment}
          />
          <Button type={"submit"}>Add</Button>
        </form>
        <Separator />

        <div className="flex flex-col gap-3">
          {comments.map((comment, index) => (
            <div key={index} className="flex items-center gap-5">
              <div className="flex gap-3 items-center">
                <Avatar>
                  <AvatarImage src={comment?.author?.profilePicture} />
                </Avatar>

                <h1 className="text-sm font-bold">
                  {comment?.author?.username}
                </h1>
              </div>

              {comment?.text}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialong;
