import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import SelectPlans from "../components/SelectPlans";

function SelectPlansContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);

  const updatePageData = async () => {
    const response = await getPrivatePlans();

    if (response.ok) {
      const fetchedPlansData = await response.json();
      
      setPlansData(fetchedPlansData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePageData();
  });

  return (
    <>
      {isLoading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <SelectPlans plansData={plansData} />
      )}
    </>
  );
}

export default SelectPlansContainer;
