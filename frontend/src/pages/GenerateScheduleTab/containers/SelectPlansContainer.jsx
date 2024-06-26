import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import {
  getFormDraft,
  updateFormDraft,
} from "../../../services/scheduleRequests";
import { plansListToDict } from "../utils";
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
  const [plansDict, setplansDict] = useState(null);

  // useEffects
  const updatePageData = async () => {
    const [plansResponse, formsResponse] = await Promise.all([
      getPrivatePlans(),
      getFormDraft(),
    ]);

    if (plansResponse.ok) {
      // Converting current plans list to dictionary format
      const fetchedPlansList = await plansResponse.json();
      let initialPlansDict = plansListToDict(fetchedPlansList, {
        is_selected: false,
      });
      console.log(initialPlansDict);

      const savedFormDict = await formsResponse.json();
      const savedPlansDict = savedFormDict["plan_selection_status"];

      // Updating savded statuses from the server if any are saved
      if (savedPlansDict) {
        const allPlanIds = Object.keys(initialPlansDict);
        for (const planId of allPlanIds) {
          const savedStatus = savedPlansDict[planId]["is_selected"];
          initialPlansDict[planId]["is_selected"] = savedStatus;
        }
      }
      setplansDict(initialPlansDict);
      setIsLoading(false);
    }
  };

  // Fetching the initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Checking whether this section has been completed or not
  useEffect(() => {
    if (plansDict) {
      const anySelected = areAnySelected(plansDict);

      if (anySelected) {
        onComplete();
      } else {
        onIncomplete();
      }
    }
  }, [plansDict]);

  // Event handling
  const handleCheckChange = async (planId) => {
    const updatedPlansDict = { ...plansDict };
    const currentStatus = updatedPlansDict[planId]["is_selected"];
    updatedPlansDict[planId]["is_selected"] = !currentStatus;

    // Saving the data on the server
    const data = { plan_selection_status: updatedPlansDict };
    const response = await updateFormDraft(data);

    if (response.ok) {
      setplansDict(updatedPlansDict);
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
        <SelectPlans plansDict={plansDict} onCheckChange={handleCheckChange} />
      )}
    </>
  );
}

export default SelectPlansContainer;
