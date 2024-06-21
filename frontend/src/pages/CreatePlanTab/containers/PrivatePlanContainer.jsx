import { useState } from "react";
import { useLocation } from "react-router-dom";

import PrivatePlan from "../components/PrivatePlan";
import { getLastUrlSegment } from "../../../services/utils";
import { createTopic } from "../../../services/planRequests";

function PrivatePlanContainer() {
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicHours, setNewTopicHours] = useState(2);

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
    const data = { private_plan: privatePlanId, title: newTopicTitle };
    console.log(data);
    const response = await createTopic(data);

    if (response.ok) {
      setNewTopicTitle("");
    }
  };

  return (
    <PrivatePlan
      newTopicTitle={newTopicTitle}
      newTopicHours={newTopicHours}
      onNewTopicTitleChange={handleNewTopicTitleChange}
      onNewTopicHoursClick={handleNewTopicHoursClick}
      onSubmitClick={handleSubmitClick}
    />
  );
}

export default PrivatePlanContainer;
