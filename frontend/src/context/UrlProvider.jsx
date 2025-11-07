import { createContext, useContext } from "react";

const BackendUrlContext = createContext();

export const BackendUrlProvider = ({ children }) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  return (
    <BackendUrlContext.Provider value={{ backendUrl }}>
      {children}
    </BackendUrlContext.Provider>
  );
};

export const useBackendUrl = () => useContext(BackendUrlContext);
