import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import {
  getPrivatePlans,
  updatePrivatePlan,
} from "../../../services/planRequests";
import SelectPlans from "../components/SelectPlans";

// Utility functions
const areAnySelected = (plansDict) => {
  for (const planId of Object.keys(plansDict)) {
    const selectedStatus = plansDict[planId]["is_selected"];
    if (selectedStatus) {
      return true;
    }
  }
  return false;
};

function SelectPlansContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);

  // useEffects
  const updatePageData = async () => {
    const response = await getPrivatePlans();

    if (response.ok) {
      // Converting current plans list to dictionary format
      const fetchedPlansData = await response.json();
      setPlansData(fetchedPlansData);
      setIsLoading(false);
    }
  };

  // Fetching the initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Checking whether this section has been completed or not
  useEffect(() => {
    if (plansData) {
      const anySelected = areAnySelected(plansData);

      if (anySelected) {
        onComplete();
      } else {
        onIncomplete();
      }
    }
  }, [plansData]);

  // Event handling
  const handleCheckChange = async (planId, newCheck) => {
    const data = { is_selected: newCheck };
    const response = await updatePrivatePlan(planId, data);

    if (response.ok) {
      updatePageData();
    }
  };

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
        <SelectPlans plansData={plansData} onCheckChange={handleCheckChange} />
      )}
    </>
  );
}

export default SelectPlansContainer;
