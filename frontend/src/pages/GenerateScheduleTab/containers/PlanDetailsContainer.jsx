import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import {
  getPrivatePlans,
  updatePrivatePlan,
} from "../../../services/planRequests";
import PlanDetails from "../components/PlanDetails";

const computeTotalFraction = (plansData) => {
  let total = 0;
  for (const plan of plansData) {
    total += Number(plan["fraction"]);
  }
  return total;
};

/**Checks if all the input dates in plansData are valid. */
const areInputDatesValid = (plansData) => {
  for (const plan of plansData) {
    if (plan["exam_date"] === null) {
      return false;
    }

    const referenceDate = new Date(plan["exam_date"]);
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
  const [plansData, setPlansData] = useState(null);
  const [totalFraction, setTotalFraction] = useState(0);

  const updatePageData = async () => {
    const response = await getPrivatePlans(true);

    if (response.ok) {
      const fetchedPlansData = await response.json();
      console.log(fetchedPlansData);
      setPlansData(fetchedPlansData);
      setIsLoading(false);
    }
  };

  // Fetch initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Check if the section is complete
  useEffect(() => {
    if (plansData) {
      const total = computeTotalFraction(plansData);
      setTotalFraction(total);
      if (areInputDatesValid(plansData) && total === 1) {
        onComplete();
      } else {
        onIncomplete();
      }
    }
  }, [plansData]);

  // Event handling
  const handlePercentChange = async (planId, newPercent) => {
    // Negative numbers are not allowed
    if (Number(newPercent) < 0) {
      return null;
    }
    const data = { fraction: Number(newPercent) / 100 };
    const response = await updatePrivatePlan(planId, data);

    if (response.ok) {
      updatePageData();
    }
  };

  const handleDateChange = async (planId, newExamDate) => {
    const data = { exam_date: newExamDate };
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
        <PlanDetails
          plansData={plansData}
          totalFraction={totalFraction}
          onPercentChange={handlePercentChange}
          onDateChange={handleDateChange}
        />
      )}
    </>
  );
}

export default PlanDetailsContainer;
