import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BackendUrlProvider } from "./context/UrlProvider.jsx";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BackendUrlProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </BackendUrlProvider>
  </StrictMode>
);
