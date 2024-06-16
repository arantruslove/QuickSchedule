import { useState, useEffect } from "react";
import validator from "validator";

import SignUp from "../components/SignUp";
import {
  getEmailTakenStatus,
  createUser,
} from "../../../services/accountRequests";

/**
 * Checks if the inputs fields are valid and allowed to be submitted.
 */
function isValid(email, password, confirmPassword, isEmailTaken) {
  if (
    validator.isEmail(email) &&
    password.length >= 8 &&
    confirmPassword === password &&
    !isEmailTaken
  ) {
    return true;
  } else return false;
}

function SignUpContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [isInputsValid, setIsInputsValid] = useState(false);
  const [signUpFailed, setSignUpFailed] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    const effectFunction = async () => {
      const response = await getEmailTakenStatus({ email });
      if (response.ok) {
        const data = await response.json();
        const isTaken = data.response;

        setIsEmailTaken(isTaken);
        setIsInputsValid(isValid(email, password, confirmPassword, isTaken));
        setSignUpFailed(false);
      }
    };

    effectFunction();
  }, [email, password, confirmPassword]);

  // Event handles
  const handleEmailChange = (newText) => {
    setEmail(newText);
  };

  const handlePasswordChange = (newText) => {
    setPassword(newText);
  };

  const handleConfirmPasswordChange = (newText) => {
    setConfirmPassword(newText);
  };

  // Signs up a new user when the sign up button is pressed
  const handleSignUp = async () => {
    const userInfo = { email: email, password: password };
    const response = await createUser(userInfo);

    if (response.ok) {
      setSignUpSuccess(true);
    } else {
      setSignUpFailed(true);
    }
  };

  return (
    <SignUp
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      isEmailTaken={isEmailTaken}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onSignUp={handleSignUp}
      isSubmittable={isInputsValid}
      signUpFailed={signUpFailed}
      signUpSuccess={signUpSuccess}
    />
  );
}

export default SignUpContainer;
