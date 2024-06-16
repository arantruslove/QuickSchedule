import { Navigate } from "react-router";
import { useContext } from "react";

import { AuthContext } from "../authentication/AuthProvider";

/**
 * Checks if a user is authenticated before rendering the component. If the user is
 * not authenticated then they will be redirected to the login.
 */
function PrivateRoute({ children }) {
  const { isLoading, isLoggedIn } = useContext(AuthContext);

  if (isLoading) {
    return null;
  }
  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
