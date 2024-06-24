import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import {
  getFormDraft,
  updateFormDraft,
} from "../../../services/scheduleRequests";
import {
  filterByIsSelected,
  updateExamDatesPercentsAllocated,
  updateSinglePercent,
  updateSingleExamDate,
  completeISODate,
} from "../planProportionsUtils";
import { addFieldToObjects } from "../utils";
import PlanProportions from "../components/PlanProportions";

const computeTotalPercent = (plansData) => {
  let total = 0;
  for (const object of plansData) {
    total = total + Number(object["percent_allocated"]);
  }
  return total;
};

/**Checks if all the input dates in plansData are valid. */
const areInputDatesValid = (plansData) => {
  for (const object of plansData) {
    const dateToTest = object["exam_date"];
    const referenceDate = new Date(dateToTest);
    try {
      // Will throw an error if the date used to initialise the Date object is not
      // valid
      referenceDate.toISOString();
    } catch {
      return false;
    }
  }
  return true;
};

function PlanProportionsContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);
  const [totalPercent, setTotalPercent] = useState(0);

  const updatePageData = async () => {
    const [plansResponse, formsResponse] = await Promise.all([
      getPrivatePlans(),
      getFormDraft(),
    ]);

    if (plansResponse.ok && formsResponse.ok) {
      // Filtering plans by whether they have been selected
      const plans = await plansResponse.json();
      const savedFormData = await formsResponse.json();

      const filteredBySelectedPlans = filterByIsSelected(
        plans,
        savedFormData["plan_selection_status"]
      );

      // Adding default percent_allocated and exam_date fields
      let defaultPlansData = addFieldToObjects(
        filteredBySelectedPlans,
        "percent_allocated",
        ""
      );
      defaultPlansData = addFieldToObjects(
        defaultPlansData,
        "exam_date",
        "T00:00:00.000Z"
      );

      // Syncing with any existing draft data on the server
      // 'details' refers to the plans' percentage time allocation and exam dates
      let initialPlansData = defaultPlansData;
      const savedPlansData = savedFormData["plan_details"];
      if (savedPlansData) {
        initialPlansData = updateExamDatesPercentsAllocated(
          initialPlansData,
          savedPlansData
        );
      }
      setTotalPercent(computeTotalPercent(initialPlansData));
      setPlansData(initialPlansData);
      setIsLoading(false);
    }
  };

  // Fetch initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Check if the section is completet
  useEffect(() => {
    if (plansData) {
      if (areInputDatesValid(plansData) && totalPercent === 100) {
        onComplete();
      } else {
        onIncomplete();
      }
    }
  }, [plansData]);

  // Event handling
  const handlePercentChange = async (newPercent, id) => {
    const updatedPlansData = updateSinglePercent(plansData, id, newPercent);

    // Save on the server
    const data = { plan_details: updatedPlansData };
    const response = await updateFormDraft(data);

    if (response.ok) {
      setPlansData(updatedPlansData);

      // Update the total percent to display
      let total = 0;
      for (const object of updatedPlansData) {
        total = total + Number(object["percent_allocated"]);
      }

      setTotalPercent(total);
    }
  };

  const handleDateChange = async (newExamDate, id) => {
    // Adding back time part of the ISO format date (set to midnight)
    const completeDate = completeISODate(newExamDate);
    const updatedPlansData = updateSingleExamDate(plansData, id, completeDate);

    // Save on the server
    const data = { plan_details: updatedPlansData };
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
        <PlanProportions
          plansData={plansData}
          totalPercent={totalPercent}
          onPercentChange={handlePercentChange}
          onDateChange={handleDateChange}
        />
      )}
    </>
  );
}

export default PlanProportionsContainer;
