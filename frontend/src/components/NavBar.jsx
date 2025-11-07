import React, { useState } from "react";
import Example from "./Example";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/context/UserContext";
import { Button } from "./ui/button";
import { useBackendUrl } from "@/context/UrlProvider";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NavBar = () => {
  const { user, logout } = useUser();

  const { backendUrl } = useBackendUrl();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/v1/user/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        logout();
        navigate("/login");
        toast.success("user logged out successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(user);
  return (
    <div className="w-screen h-30px bg-white py-3 flex  justify-between px-[30vh] max-lg:px-0 max-lg:justify-center  items-center">
      <h1 className="max-lg:hidden">Logo</h1>

      <div className="flex items-center   gap-10 pt-4">
        <Link to={"/"}>
          <div className="flex gap-1 flex-col items-center">
            <Home />
            <h1>Feed</h1>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex flex-col items-center">
              <Avatar className="w-7 h-7">
                <AvatarImage
                  src={user?.profilePicture}
                  className={" object-cover"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1>{user?.username}</h1>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className={"flex items-center justify-center"}>
              <Link to={`/${user?._id}/profile`}>
                <h1>My Profile</h1>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className={"flex items-center justify-center"}>
              <Button
                onClick={logoutHandler}
                className={
                  "bg-white hover:text-red-600 hover:bg-white text-red-400"
                }
              >
                Log out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default NavBar;
