import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAuthToken } from "../../../services/accountRequests";
import { AuthContext } from "../../../authentication/AuthProvider";
import Login from "../components/Login";

function LoginContainer() {
  const navigate = useNavigate();
  const { updateLoginStatus } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginIncorrect, setIsLoginIncorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Event handles
  const handleEmailChange = (newText) => {
    setEmail(newText);
    setIsLoginIncorrect(false);
  };

  const handlePasswordChange = (newText) => {
    setPassword(newText);
    setIsLoginIncorrect(false);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    const data = { email: email, password: password };
    const response = await getAuthToken(data);

    if (response.ok) {
      // User login succeeded

      await updateLoginStatus();
      navigate("/home");
    } else if (response.status === 401) {
      // User provided incorrect credentials

      setIsLoginIncorrect(true);
    } else {
      // Another error occurred
      console.log("There has been an error processing your request.");
    }

    setIsLoading(false);
  };

  return (
    <Login
      email={email}
      password={password}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onLogin={handleLogin}
      isLoginIncorrect={isLoginIncorrect}
      isLoading={isLoading}
    />
  );
}

export default LoginContainer;
