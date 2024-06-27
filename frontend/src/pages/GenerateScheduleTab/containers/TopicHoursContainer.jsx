import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import TopicHours from "../components/TopicHours";
import { getFormDraft } from "../../../services/scheduleRequests";
import {
  computeTotalDictHours,
  assignPlanHours,
  isViable,
  formatDate,
} from "../utils";

function TopicHoursContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [notViablePlan, setNotViablePlan] = useState(null);

  const updatePageData = async () => {
    const [formResponse] = await Promise.all([getFormDraft()]);
    const formData = await formResponse.json();

    const totalHours = computeTotalDictHours(formData["daily_study_hours"]);
    const plansDict = assignPlanHours(formData["plan_details"], totalHours);
    const isInfoViable = isViable(plansDict, formData["daily_study_hours"]);

    // Sets notViablePlan to the plan details of the plan in which there are not
    // enough study hours allocated to before the exam
    if (isInfoViable != true) {
      setNotViablePlan(isInfoViable);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    updatePageData();
  }, []);

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
        <>
          {notViablePlan != null ? (
            <p>
              *There are not enough study hours allocated before the{" "}
              <strong>{notViablePlan["title"]}</strong> exam date. Please
              allocate some more hours before{" "}
              <strong>{formatDate(notViablePlan["exam_date"])}.</strong>
            </p>
          ) : (
            <TopicHours />
          )}
        </>
      )}
    </>
  );
}

export default TopicHoursContainer;
