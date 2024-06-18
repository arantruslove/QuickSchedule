import { Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import LandingPage from "./pages/LandingPage/components/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import LoginContainer from "./pages/Auth/containers/LoginContainer";
import SignUpContainer from "./pages/Auth/containers/SignUpContainer";
import AccountContainer from "./pages/Account/containers/AccountContainer";
import VerifyEmail from "./pages/Auth/components/VerifyEmail";
import VerifyEmailSuccess from "./pages/Auth/components/VerifyEmailSuccess";
import AuthProvider from "./authentication/AuthProvider";
import ResetPasswordContainer from "./pages/Auth/containers/ResetPasswordContainer";
import InitiateResetContainer from "./pages/Auth/containers/InitiateResetContainer";
import PageLayout from "./components/PageLayout";

function App() {
  return (
    <AuthProvider value={true}>
      <Routes>
        {/* Private Routes */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <AccountContainer />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="" element={<LandingPage />} />
        <Route path="/login" element={<LoginContainer />} />
        <Route path="/sign-up" element={<SignUpContainer />} />
        <Route path="/verify-email/success" element={<VerifyEmailSuccess />} />
        <Route path="/verify-email/*" element={<VerifyEmail />} />
        <Route
          path="/initiate-password-reset"
          element={<InitiateResetContainer />}
        />
        <Route path="/reset-password/*" element={<ResetPasswordContainer />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/playground" element={<PageLayout />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
