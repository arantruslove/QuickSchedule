import { useState } from "react";
import { useLocation } from "react-router-dom";

import ResetPassword from "../components/ResetPassword";
import { getLastUrlSegment } from "../../../services/utils";
import { resetPassword } from "../../../services/accountRequests";

/**Tests if the password and confirm password are the same and of the same length. */
const isValid = (password, confirmPassword) => {
  if (password.length >= 8 && password === confirmPassword) {
    return true;
  } else {
    return false;
  }
};

function ResetPasswordContainer() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isInputsValid, setIsInputsValid] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const url = useLocation().pathname;
  const verificationToken = getLastUrlSegment(url);

  const handlePasswordChange = (newText) => {
    setPassword(newText);
    setIsInputsValid(isValid(newText, confirmPassword));
  };

  const handleConfirmPasswordChange = (newText) => {
    setConfirmPassword(newText);
    setIsInputsValid(isValid(password, newText));
  };

  const handleButtonClick = async () => {
    const response = await resetPassword({
      new_password: password,
      token: verificationToken,
    });

    if (response.ok) {
      setIsResetSuccess(true);
    } else {
      setHasErrorOccurred(true);
    }
  };

  return (
    <ResetPassword
      password={password}
      confirmPassword={confirmPassword}
      isInputsValid={isInputsValid}
      hasErrorOccurred={hasErrorOccurred}
      isResetSuccess={isResetSuccess}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onButtonClick={handleButtonClick}
    />
  );
}

export default ResetPasswordContainer;
