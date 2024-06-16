import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { getLastUrlSegment } from "../../../services/utils";
import { verifyEmail } from "../../../services/accountRequests";
import PageNotFound from "../../PageNotFound/PageNotFound";

/**
 * Component that attempts to verify a user by their token. If the verification succeeds
 * they are taken to the success page otherwise they will be taken to PageNotFound.
 *
 * @returns {null | PageNotFound}
 */
function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);

  const url = useLocation().pathname;
  const verificationToken = getLastUrlSegment(url);
  const navigate = useNavigate();

  useEffect(() => {
    const effectFunction = async () => {
      const data = { token: verificationToken };
      const response = await verifyEmail(data);
      if (response.ok) {
        navigate("/verify-email/success");
      }
      setIsLoading(false);
    };

    effectFunction();
  }, []);

  if (isLoading) {
    return null;
  } else return <PageNotFound />;
}

export default VerifyEmail;
