import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import TopicHours from "../components/TopicHours";
import { formatDate } from "../utils";
import { getPlansWithRequiredHours } from "../../../services/scheduleRequests";

function TopicHoursContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);
  const [notViablePlan, setNotViablePlan] = useState(null);

  const updatePageData = async () => {
    const response = await getPlansWithRequiredHours();

    if (response.ok) {
      const fetchedPlansData = await response.json();
      setPlansData(fetchedPlansData);
      setIsLoading(false);
    } else if (response.status === 400) {
      // If the user input data cannot form a feasible schedule within their study
      // hour time constraints
      const fetchedNotViablePlan = await response.json();
      setNotViablePlan(fetchedNotViablePlan);
      setIsLoading(false);
    }
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
