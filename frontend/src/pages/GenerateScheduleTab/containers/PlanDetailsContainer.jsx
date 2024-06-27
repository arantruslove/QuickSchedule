import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getPrivatePlans } from "../../../services/planRequests";
import { plansListToDict, completeISODate } from "../utils";
import PlanDetails from "../components/PlanDetails";

const computeTotalPercent = (plansDict) => {
  let total = 0;
  for (const planDetails of Object.values(plansDict)) {
    total += Number(planDetails["percent_allocated"]);
  }
  return total;
};

/**Checks if all the input dates in plansData are valid. */
const areInputDatesValid = (plansDict) => {
  for (const planDetails of Object.values(plansDict)) {
    const referenceDate = new Date(planDetails["exam_date"]);
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

function PlanDetailsContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [plansDict, setPlansDict] = useState(null);
  const [totalPercent, setTotalPercent] = useState(0);

  const updatePageData = async () => {
    const [plansResponse, formsResponse] = await Promise.all([
      getPrivatePlans(),
      getFormDraft(),
    ]);

    if (plansResponse.ok && formsResponse.ok) {
      const privatePlansList = await plansResponse.json();
      const savedFormData = await formsResponse.json();
      const planSelectionDict = savedFormData["plan_selection_status"];

      // Filtering out is_selected = false values
      const selectedPlansList = privatePlansList.filter((plan) => {
        const isSelected = planSelectionDict[plan["id"]]["is_selected"];
        return isSelected;
      });

      // Creating plans data structure base with default exam date and percent
      // allocated fields
      const initialPlansDict = plansListToDict(selectedPlansList, {
        percent_allocated: 0,
        exam_date: "T00:00:00Z",
      });

      // Syncing with any existing draft data on the server
      // 'details' refers to the plans' percentage time allocation and exam dates
      const savedPlansDetails = savedFormData["plan_details"];
      if (savedPlansDetails) {
        for (const planId of Object.keys(initialPlansDict)) {
          if (savedPlansDetails[planId]) {
            initialPlansDict[planId]["percent_allocated"] =
              savedPlansDetails[planId]["percent_allocated"];
            initialPlansDict[planId]["exam_date"] =
              savedPlansDetails[planId]["exam_date"];
          }
        }
      }

      setTotalPercent(computeTotalPercent(initialPlansDict));
      setPlansDict(initialPlansDict);
      setIsLoading(false);
    }
  };

  // Fetch initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Check if the section is completet
  useEffect(() => {
    if (plansDict) {
      if (areInputDatesValid(plansDict) && totalPercent === 100) {
        onComplete();
      } else {
        onIncomplete();
      }
    }
  }, [plansDict]);

  // Event handling
  const handlePercentChange = async (newPercent, id) => {
    // Negative numbers are not allowed
    if (Number(newPercent) < 0) {
      return null;
    }
    const updatedPlansDict = { ...plansDict };
    updatedPlansDict[id]["percent_allocated"] = newPercent;

    // Save on the server
    const data = { plan_details: updatedPlansDict };
    const response = await updateFormDraft(data);

    if (response.ok) {
      setPlansDict(updatedPlansDict);

      // Update the total percent to display
      const total = computeTotalPercent(updatedPlansDict);
      setTotalPercent(total);
    }
  };

  const handleDateChange = async (newExamDate, id) => {
    // Adding back time part of the ISO format date (set to midnight)
    const updatedPlansDict = { ...plansDict };
    updatedPlansDict[id]["exam_date"] = completeISODate(newExamDate);

    // Save on the server
    const data = { plan_details: updatedPlansDict };
    const response = await updateFormDraft(data);

    if (response.ok) {
      setPlansDict(updatedPlansDict);
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
        <PlanDetails
          plansDict={plansDict}
          totalPercent={totalPercent}
          onPercentChange={handlePercentChange}
          onDateChange={handleDateChange}
        />
      )}
    </>
  );
}

export default PlanDetailsContainer;
