import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Account from "../components/Account";
import { AuthContext } from "../../../authentication/AuthProvider";
import {
  removeRefreshAccessTokens,
  deleteUser,
  getAccountDetails,
} from "../../../services/accountRequests";

function AccountContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { updateLoginStatus } = useContext(AuthContext);

  useEffect(() => {
    const effectFunction = async () => {
      const response = await getAccountDetails();
      const data = await response.json();
      const email = data["email"];

      setEmail(email);
      setIsLoading(false);
    };
    effectFunction();
  }, []);

  const handleLogoutClick = async () => {
    // Logs out the user
    await removeRefreshAccessTokens();
    await updateLoginStatus();
  };

  const handleChangePasswordClick = () => {
    // Navigates to initiate password reset page
    navigate("/initiate-password-reset/");
  };

  const handleDeleteAccountClick = async () => {
    // Deletes the user's account and logs them out
    const response = await deleteUser();

    // If successful, log the user out of the page
    if (response.ok) {
      await updateLoginStatus();
    }
  };

  return (
    <Account
      isLoading={isLoading}
      email={email}
      onLogoutClick={handleLogoutClick}
      onChangePasswordClick={handleChangePasswordClick}
      onDeleteAccountClick={handleDeleteAccountClick}
    />
  );
}

export default AccountContainer;
