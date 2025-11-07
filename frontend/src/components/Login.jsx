import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBackendUrl } from "@/context/UrlProvider";
import { Button } from "./ui/button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { backendUrl } = useBackendUrl();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, login } = useUser();

  console.log(user);
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const registerHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/v1/user/login`,
        { email, password },
        config
      );
      login(data.userToShow);

      toast.success("User has logged in!");
      navigate("/");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-center pt-5 text-3xl font-semibold">Login</h1>
      <div className="h-screen max-lg:h-3/4 px-3 w-screen flex justify-center pt-24">
        <form
          className="w-[500px] flex flex-col gap-7"
          onSubmit={registerHandler}
        >
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </Button>

          <p>
            Don't have an account &nbsp;&nbsp;
            <Link to={"/signUp"}>
              <span className="text-blue-900">Sign up</span>
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
