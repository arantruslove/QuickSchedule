import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import {
  getISODatesToZeroHours,
  updateManyHours,
  updateSingleHours,
} from "../dateFormat";
import {
  createFormDraft,
  getFormDraft,
} from "../../../services/scheduleRequests";
import { updateFormDraft } from "../../../services/scheduleRequests";
import AllocateHours from "../components/AllocateHours";

// Constants
const NUMBER_DAYS_TO_RENDER = 182; // Half a year
const defaultDatesToHours = getISODatesToZeroHours(NUMBER_DAYS_TO_RENDER);

function AllocateHoursContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState(0);
  const [datesToHours, setDatesToHours] = useState(null);

  const updatePageData = async () => {
    let response = await getFormDraft();

    // Create a ScheduleFormDraft instance if it does not already exist
    if (response.status === 404) {
      response = await createFormDraft();
    }

    if (response.ok) {
      const data = await response.json();
      const fetchedDatesToHours = data["daily_study_hours"];

      let initialDatesToHours;
      if (fetchedDatesToHours) {
        // Update the default hours with those saved on the server from the previous session
        initialDatesToHours = updateManyHours(
          defaultDatesToHours,
          fetchedDatesToHours
        );
      } else {
        // If the server does not have any data saved from the previous session then use
        // the default of zero hours for each date
        initialDatesToHours = defaultDatesToHours;
      }

      setDatesToHours(initialDatesToHours);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    updatePageData();
  }, []);

  // Event handling
  const handleWeekNumberDecrement = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleWeekNumberIncrement = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handleHoursClick = async (newHours, isoDate) => {
    const updatedDatesToHours = updateSingleHours(
      datesToHours,
      isoDate,
      newHours
    );

    // Saving the updated hours on the server
    const data = { daily_study_hours: updatedDatesToHours };
    const response = await updateFormDraft(data);

    // Updating on the frontend if successfully saved on the server
    if (response.ok) {
      setDatesToHours(updatedDatesToHours);
    }
  };

  const handleZeroAllHours = async () => {
    // Creating a new array with all hours set to zero
    const updatedDatesToHours = datesToHours.map((dateToHours) => ({
      ...dateToHours,
      hours: 0,
    }));

    // Save the updated hours on the server
    const data = { daily_study_hours: updatedDatesToHours };
    const response = await updateFormDraft(data);

    // Updating the state with the new hours
    if (response.ok) {
      setDatesToHours(updatedDatesToHours);
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
        <AllocateHours
          datesToHours={datesToHours}
          weekNumber={weekNumber}
          onWeekNumberDecrement={handleWeekNumberDecrement}
          onWeekNumberIncrement={handleWeekNumberIncrement}
          onHoursClick={handleHoursClick}
          onZeroAllHours={handleZeroAllHours}
        />
      )}
    </>
  );
}

export default AllocateHoursContainer;
