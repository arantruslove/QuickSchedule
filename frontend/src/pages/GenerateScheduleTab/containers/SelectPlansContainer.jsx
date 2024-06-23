import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import {
  getFormDraft,
  updateFormDraft,
} from "../../../services/scheduleRequests";
import {
  updateManySelectedStatus,
  addFieldToObjects,
  switchBool,
} from "../selectPlansUtils";
import SelectPlans from "../components/SelectPlans";

function SelectPlansContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);

  const updatePageData = async () => {
    const [plansResponse, formsResponse] = await Promise.all([
      getPrivatePlans(),
      getFormDraft(),
    ]);

    if (plansResponse.ok) {
      const fetchedPlansData = await plansResponse.json();
      // Add is_selected field to the data with a default of false
      const defaultPlansData = addFieldToObjects(
        fetchedPlansData,
        "is_selected",
        false
      );

      const savedFormData = await formsResponse.json();
      const savedPlansData = savedFormData["plan_selection_status"];
      let initialPlansData;
      if (savedPlansData) {
        // console.log(savedPlansData);
        // Updating from the server if not null
        initialPlansData = updateManySelectedStatus(
          defaultPlansData,
          savedPlansData
        );
        console.log(initialPlansData);
      } else {
        initialPlansData = defaultPlansData;
      }
      setPlansData(initialPlansData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updatePageData();
  }, []);

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
