import { useState, useEffect } from "react";

import CreatePlan from "../components/CreatePlan";
import {
  createPrivatePlan,
  getPrivatePlans,
} from "../../../services/planRequests";

function CreatePlanContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [planTitle, setPlanTitle] = useState("");
  const [privatePlansData, setPrivatePlansData] = useState([]);

  const getPrivatePlansData = async () => {
    const response = await getPrivatePlans();
    const data = await response.json();

    if (response.ok) {
      // Ordering from most recent to least
      setPrivatePlansData(data.reverse());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPrivatePlansData();
  }, []);

  // Event handling
  const handleInputChange = (newText) => {
    setPlanTitle(newText);
  };

  const handleSubmitClick = async () => {
    await createPrivatePlan({ title: planTitle });
    await getPrivatePlansData();
    setPlanTitle("");
  };

  return (
    <CreatePlan
      isLoading={isLoading}
      planTitle={planTitle}
      privatePlansData={privatePlansData}
      onInputChange={handleInputChange}
      onSubmitClick={handleSubmitClick}
    />
  );
}

export default CreatePlanContainer;
