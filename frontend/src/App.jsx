import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import EditProfile from "./components/EditProfile";
import Profile from "./components/Profile";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Toaster } from "sonner";
import UserProfile from "./components/UserProfile";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Notfound from "./components/Notfound";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/profile/:id",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/account/edit",
          element: (
            <ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/:id/profile",
          element: (
            <ProtectedRoutes>
              <UserProfile />
            </ProtectedRoutes>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signUp",
      element: <SignUp />,
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={browserRouter} />

      <Toaster />
    </>
  );
}

export default App;
