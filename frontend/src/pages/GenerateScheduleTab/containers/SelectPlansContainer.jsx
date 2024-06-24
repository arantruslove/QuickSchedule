import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import {
  getFormDraft,
  updateFormDraft,
} from "../../../services/scheduleRequests";
import { updateManySelectedStatus, switchBool } from "../selectPlansUtils";
import { addFieldToObjects } from "../utils";
import SelectPlans from "../components/SelectPlans";

// Utility functions
const areAnySelected = (plansData) => {
  let anySelected = false;
  for (const object of plansData) {
    if (object["is_selected"]) {
      anySelected = true;
      break;
    }
  }
  return anySelected;
};

function SelectPlansContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);

  // useEffects
  const updatePageData = async () => {
    const [plansResponse, formsResponse] = await Promise.all([
      getPrivatePlans(),
      getFormDraft(),
    ]);

    if (plansResponse.ok) {
      const fetchedPlansData = await plansResponse.json();
      // Add is_selected field to the data with a default of false
      let defaultPlansData = addFieldToObjects(
        fetchedPlansData,
        "is_selected",
        false
      );

      const savedFormData = await formsResponse.json();
      const savedPlansData = savedFormData["plan_selection_status"];
      let initialPlansData;
      if (savedPlansData) {
        // Updating from the server if not null
        initialPlansData = updateManySelectedStatus(
          defaultPlansData,
          savedPlansData
        );
      } else {
        initialPlansData = defaultPlansData;
      }
      setPlansData(initialPlansData);
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
  const handleCheckChange = async (planId) => {
    const updatedPlansData = switchBool(plansData, planId);

    // Saving the data on the server
    const data = { plan_selection_status: updatedPlansData };
    const response = await updateFormDraft(data);

    if (response.ok) {
      setPlansData(updatedPlansData);
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
