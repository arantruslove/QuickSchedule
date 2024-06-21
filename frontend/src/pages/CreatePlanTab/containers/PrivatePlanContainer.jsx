import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PrivatePlan from "../components/PrivatePlan";
import { getLastUrlSegment } from "../../../services/utils";
import {
  createTopic,
  getTopicsofPrivatePlan,
  updateTopic,
} from "../../../services/planRequests";

function PrivatePlanContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [topicsData, setTopicsData] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicHours, setNewTopicHours] = useState(2);

  const getTopicsData = async () => {
    const response = await getTopicsofPrivatePlan(privatePlanId);
    const data = await response.json();
    setTopicsData(data);
    setIsLoading(false);
  };
  useEffect(() => {
    getTopicsData();
  }, []);

  // Getting the PrivatePlan id
  const url = useLocation().pathname;
  const privatePlanId = getLastUrlSegment(url);

  // Event handling
  const handleNewTopicTitleChange = (newTitle) => {
    setNewTopicTitle(newTitle);
  };

  const handleNewTopicHoursClick = (newHours) => {
    setNewTopicHours(newHours);
  };

  const handleSubmitClick = async () => {
    const data = {
      private_plan: privatePlanId,
      title: newTopicTitle,
      hours: newTopicHours,
    };
    const response = await createTopic(data);

    if (response.ok) {
      setNewTopicTitle("");
      await getTopicsData();
    }
  };

  const handleEditTopicTitle = async (title, topicId) => {
    const data = { title: title };
    const response = await updateTopic(topicId, data);

    if (response.ok) {
      getTopicsData();
    }
  };

  return (
    <PrivatePlan
      isLoading={isLoading}
      topicsData={topicsData}
      newTopicTitle={newTopicTitle}
      newTopicHours={newTopicHours}
      onNewTopicTitleChange={handleNewTopicTitleChange}
      onNewTopicHoursClick={handleNewTopicHoursClick}
      onSubmitClick={handleSubmitClick}
      onEditTopicTitle={handleEditTopicTitle}
    />
  );
}

export default PrivatePlanContainer;
