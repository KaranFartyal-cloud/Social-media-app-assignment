import React from "react";
import Posts from "./Posts";
import CreatePost from "./CreatePost";
import ProfileSum from "./ProfileSum";

const Home = () => {
  return (
    <div className="flex gap-5 mt-5 justify-center w-full">
      {/* <ProfileSum /> */}
      <div className="w-[600px] flex flex-col items-center">
        <CreatePost />
        <Posts />
      </div>
    </div>
  );
};

export default Home;
