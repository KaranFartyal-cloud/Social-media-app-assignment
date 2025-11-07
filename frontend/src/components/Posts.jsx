import { useBackendUrl } from "@/context/UrlProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Post from "./Post";

const Posts = () => {
  const { backendUrl } = useBackendUrl();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(`${backendUrl}/api/v1/post/all`, {
        withCredentials: true,
      });
      // console.log(data);
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Post post={post} key={post?._id} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
