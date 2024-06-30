import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CreatePlan from "../components/CreatePlan";
import {
  createPrivatePlan,
  deletePrivatePlan,
  getPrivatePlans,
  updatePrivatePlan,
} from "../../../services/planRequests";

function CreatePlanContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [planTitle, setPlanTitle] = useState("");
  const [privatePlansData, setPrivatePlansData] = useState([]);

  const navigate = useNavigate();

  const getPrivatePlansData = async () => {
    const response = await getPrivatePlans();
    const data = await response.json();

    if (response.ok) {
      // Ordering from most recent to least
      setPrivatePlansData(data);
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

  const handleTabClick = (privatePlanId) => {
    navigate(`/create-plan/${privatePlanId}`);
  };

  const handleEditPlanTitle = async (title, id) => {
    const data = { title: title };
    const response = await updatePrivatePlan(id, data);

    if (response.ok) {
      await getPrivatePlansData();
    }
  };

  const handleDeletePlan = async (id) => {
    const response = await deletePrivatePlan(id);
    if (response.ok) {
      await getPrivatePlansData();
    }
  };

  return (
    <CreatePlan
      isLoading={isLoading}
      planTitle={planTitle}
      privatePlansData={privatePlansData}
      onInputChange={handleInputChange}
      onSubmitClick={handleSubmitClick}
      onTabClick={handleTabClick}
      onEditPlanTitle={handleEditPlanTitle}
      onDeletePlan={handleDeletePlan}
    />
  );
}

export default CreatePlanContainer;
