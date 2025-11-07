import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackendUrl } from "@/context/UrlProvider";
import { Button } from "./ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl } = useBackendUrl();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/register`,
        {
          username,
          email,
          password,
        },
        config
      );

      console.log(data);

      navigate("/login");
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      // setEmail("");
      // setUsername("");
      // setPassword("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <h1 className="text-center pt-5 text-3xl font-semibold">Sign-up</h1>
      <div
        className="h-screen w-screen max-lg:h-3/4 px-3 flex justify-center pt-24"
        onSubmit={registerHandler}
      >
        <form className="w-[500px] flex flex-col gap-7">
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full ">Submit</Button>
          <p>
            Already have an account?
            <Link to={"/login"}>
              &nbsp;&nbsp;
              <span className="text-blue-900">Login</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
