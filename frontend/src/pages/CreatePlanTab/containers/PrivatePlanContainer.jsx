import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import PrivatePlan from "../components/PrivatePlan";
import { getLastUrlSegment } from "../../../services/utils";
import {
  getPrivatePlan,
  createTopic,
  deleteTopic,
  getTopicsofPrivatePlan,
  updateTopic,
} from "../../../services/planRequests";

function PrivatePlanContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [privatePlanTitle, setPrivatePlanTitle] = useState("");
  const [topicsData, setTopicsData] = useState([]);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicHours, setNewTopicHours] = useState(2);

  // Getting the PrivatePlan id
  const url = useLocation().pathname;
  const privatePlanId = getLastUrlSegment(url);

  // Fetching page data
  const getPageData = async () => {
    try {
      const [response1, response2] = await Promise.all([
        getTopicsofPrivatePlan(privatePlanId),
        getPrivatePlan(privatePlanId),
      ]);

      const [data1, data2] = await Promise.all([
        response1.json(),
        response2.json(),
      ]);

      setTopicsData(data1);
      setPrivatePlanTitle(data2["title"]);
      setIsLoading(false);
    } catch {
      console.log("There has been an error");
    }
  };
  useEffect(() => {
    getPageData();
  }, []);

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
      await getPageData();
    }
  };

  const handleEditTopicHours = async (hours, topicId) => {
    const data = { hours: hours };
    const response = await updateTopic(topicId, data);

    if (response.ok) {
      getPageData();
    }
  };

  const handleEditTopicTitle = async (title, topicId) => {
    const data = { title: title };
    const response = await updateTopic(topicId, data);

    if (response.ok) {
      getPageData();
    }
  };

  const handleDeleteTopic = async (topicId) => {
    const response = await deleteTopic(topicId);

    if (response.ok) {
      getPageData();
    }
  };

  return (
    <PrivatePlan
      isLoading={isLoading}
      privatePlanTitle={privatePlanTitle}
      topicsData={topicsData}
      newTopicTitle={newTopicTitle}
      newTopicHours={newTopicHours}
      onNewTopicTitleChange={handleNewTopicTitleChange}
      onNewTopicHoursClick={handleNewTopicHoursClick}
      onSubmitClick={handleSubmitClick}
      onEditTopicHours={handleEditTopicHours}
      onEditTopicTitle={handleEditTopicTitle}
      onDeleteTopic={handleDeleteTopic}
    />
  );
}

export default PrivatePlanContainer;
