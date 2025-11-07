import { useUser } from "@/context/UserContext";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading]);

  // Optional: show a loader while checking login status
  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default ProtectedRoutes;
