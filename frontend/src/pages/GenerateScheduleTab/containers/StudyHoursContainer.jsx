import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import {
  getUpdateStudyDatesHours,
  updateStudyDateHour,
  zeroStudyDatesHours,
} from "../../../services/scheduleRequests";
import StudyHours from "../components/StudyHours";

function StudyHoursContainer({ onComplete, onIncomplete }) {
  const [isLoading, setIsLoading] = useState(true);
  const [weekNumber, setWeekNumber] = useState(0);
  const [datesHours, setDatesHours] = useState(null);

  // useEffects
  const updatePageData = async () => {
    let response = await getUpdateStudyDatesHours();

    if (response.ok) {
      const fetchedDatesHours = await response.json();
      setDatesHours(fetchedDatesHours);
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
    if (datesHours) {
      let totalHours = 0;
      for (const dateObj of datesHours) {
        totalHours += Number(dateObj["hours"]);
      }

      if (totalHours === 0) {
        onIncomplete();
      } else {
        onComplete();
      }
    }
  }, [datesHours]);

  // Event handling
  const handleWeekNumberDecrement = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleWeekNumberIncrement = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handleHoursClick = async (newHours, id) => {
    const data = { hours: newHours };
    const response = await updateStudyDateHour(id, data);
    if (response.ok) {
      updatePageData();
    }
  };

  const handleZeroAllHours = async () => {
    const response = await zeroStudyDatesHours();
    if (response.ok) {
      setIsLoading(true);
      updatePageData();
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
          datesHours={datesHours}
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
