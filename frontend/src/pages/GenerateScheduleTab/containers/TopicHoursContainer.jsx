import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import TopicHours from "../components/TopicHours";
import { formatDate } from "../utils";
import {
  generateSchedule,
  getPlansWithRequiredHours,
} from "../../../services/scheduleRequests";
import { updateTopic } from "../../../services/planRequests";

// Utility functions
/**Adding topic_hours field to each plan based on the hours assigned to each topic. */
const addTopicHoursField = (plansData) => {
  for (const plan of plansData) {
    const topics = plan["topics"];

    let total = 0;
    for (const topic of topics) {
      total += topic["hours"];
    }
    plan["topic_hours"] = total;
  }
};

/**Checking whether the topic_hours of each plan equals the required_hours. */
const areTopicHoursComplete = (plansData) => {
  for (const plan of plansData) {
    if (plan["topic_hours"] != plan["required_hours"]) {
      return false;
    }
  }
  return true;
};

function TopicHoursContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [plansData, setPlansData] = useState(null);
  const [notViablePlan, setNotViablePlan] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerateError, setIsGenerateError] = useState(false);

  const navigate = useNavigate();

  const updatePageData = async () => {
    const response = await getPlansWithRequiredHours();

    if (response.ok) {
      const fetchedPlansData = await response.json();
      fetchedPlansData.sort((a, b) => b["id"] - a["id"]);
      addTopicHoursField(fetchedPlansData);

      // Filtering out any plans that have required_hours === 0
      const filteredPlansData = fetchedPlansData.filter(
        (plan) => plan["required_hours"] != 0
      );

      setPlansData(filteredPlansData);
      setIsComplete(areTopicHoursComplete(fetchedPlansData));
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

  // Event handling
  const handeHoursClick = async (topicId, hours) => {
    const data = { hours: hours };
    const response = await updateTopic(topicId, data);

    if (response.ok) {
      updatePageData();
    }
  };

  const handleGenerateScheduleClick = async () => {
    setIsGenerating(true);
    const response = await generateSchedule();

    if (response.ok) {
      navigate("/home");
    } else {
      setIsGenerating(false);
      setIsGenerateError(true);
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
        <>
          {notViablePlan != null ? (
            <p>
              *There are not enough study hours allocated before the{" "}
              <strong>{notViablePlan["title"]}</strong> exam date. Please
              allocate some more hours before{" "}
              <strong>{formatDate(notViablePlan["exam_date"])}.</strong>
            </p>
          ) : (
            <TopicHours
              plansData={plansData}
              onHoursClick={handeHoursClick}
              isGenerateScheduleActive={isComplete}
              isGenerating={isGenerating}
              displayError={isGenerateError}
              onGenerateScheduleClick={handleGenerateScheduleClick}
              onHideModal={() => setIsGenerateError(false)}
            />
          )}
        </>
      )}
    </>
  );
}

export default TopicHoursContainer;
