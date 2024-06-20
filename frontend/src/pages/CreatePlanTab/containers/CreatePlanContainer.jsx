import { useState } from "react";

import CreatePlan from "../components/CreatePlan";
import { createPrivatePlan } from "../../../services/planRequests";

function CreatePlanContainer() {
  const [planTitle, setPlanTitle] = useState("");

  // Event handling
  const handleInputChange = (newText) => {
    setPlanTitle(newText);
  };

  const handleSubmitClick = async () => {
    await createPrivatePlan({ name: planTitle });
    setPlanTitle("");
  };

  return (
    <CreatePlan
      planTitle={planTitle}
      onInputChange={handleInputChange}
      onSubmitClick={handleSubmitClick}
    />
  );
}

export default CreatePlanContainer;
