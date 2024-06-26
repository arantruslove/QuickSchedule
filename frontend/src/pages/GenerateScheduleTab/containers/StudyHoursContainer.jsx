import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import { getISODatesToZeroHours, computeTotalHours } from "../utils";
import {
  createFormDraft,
  getFormDraft,
} from "../../../services/scheduleRequests";
import { updateFormDraft } from "../../../services/scheduleRequests";
import StudyHours from "../components/StudyHours";

// Constants
const NUMBER_DAYS_TO_RENDER = 182; // Half a year
const initialDatesToHours = getISODatesToZeroHours(NUMBER_DAYS_TO_RENDER);

function StudyHoursContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState(0);
  const [datesToHours, setDatesToHours] = useState(null);

  // useEffects
  const updatePageData = async () => {
    let response = await getFormDraft();

    // Create a ScheduleFormDraft instance if it does not already exist
    if (response.status === 404) {
      response = await createFormDraft();
    }

    if (response.ok) {
      const data = await response.json();
      const fetchedDatesToHours = data["daily_study_hours"];

      if (fetchedDatesToHours) {
        // Update the default hours with those saved on the server from the previous session
        const defaultDates = Object.keys(initialDatesToHours);
        const savedDates = Object.keys(fetchedDatesToHours);
        const commonDates = defaultDates.filter((item) =>
          new Set(savedDates).has(item)
        );
        for (const date of commonDates) {
          initialDatesToHours[date] = fetchedDatesToHours[date];
        }
      } else {
        // If the server does not have any data saved from the previous session then use
        // the default of zero hours for each date
        null;
      }

      setDatesToHours(initialDatesToHours);
      setIsLoading(false);
    }
  };

  // Fetching initial page data
  useEffect(() => {
    updatePageData();
  }, []);

  // Determine whether this section is complete based on whether any hours have been
  // registered
  useEffect(() => {
    if (datesToHours) {
      const totalHours = computeTotalHours(datesToHours);

      if (totalHours === 0) {
        onIncomplete();
      } else {
        onComplete();
      }
    }
  }, [datesToHours]);

  // Event handling
  const handleWeekNumberDecrement = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleWeekNumberIncrement = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handleHoursClick = async (newHours, isoDate) => {
    const updatedDatesToHours = { ...datesToHours };
    updatedDatesToHours[isoDate] = newHours;

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
    const updatedDatesToHours = { ...datesToHours };
    for (const date of Object.keys(updatedDatesToHours)) {
      updatedDatesToHours[date] = 0;
    }

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
        <StudyHours
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

export default StudyHoursContainer;
