import { useState, useEffect, createContext } from "react";

import { getAuthStatus } from "../services/accountRequests";

// To access context in other components
export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoginStatus = async () => {
    const response = await getAuthStatus();

    if (response.ok) {
      setIsLoggedIn(true);
      setIsLoading(false);
    } else {
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  // Automatically refreshes access token periodically
  // Will stay logged in if the refresh of the access token is successful
  // Will logout if the refresh is unsuccessful
  useEffect(() => {
    updateLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isLoggedIn,
        setIsLoggedIn,
        updateLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
