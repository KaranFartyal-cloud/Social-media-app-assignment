import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const MainLayout = () => {
  return (
    <div className="h-screen">
      <div className="flex justify-center">
        <NavBar />
      </div>
      <div className="container mx-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
