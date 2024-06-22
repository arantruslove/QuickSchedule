import { useState } from "react";

import { getISODatesToZeroHours, updateSingleHours } from "../dateFormat";
import AllocateHours from "../components/AllocateHours";

const NUMBER_DAYS_TO_RENDER = 182; // Half a year
const initialDatesToHours = getISODatesToZeroHours(NUMBER_DAYS_TO_RENDER);

function AllocateHoursContainer() {
  const [weekNumber, setWeekNumber] = useState(0);
  const [datesToHours, setDatesToHours] = useState(initialDatesToHours);

  // Event handling
  const handleWeekNumberDecrement = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleWeekNumberIncrement = () => {
    setWeekNumber(weekNumber + 1);
  };

  const handleHoursClick = (newHours, isoDate) => {
    const updatedDatesToHours = updateSingleHours(
      datesToHours,
      isoDate,
      newHours
    );

    setDatesToHours(updatedDatesToHours);
  };

  return (
    <AllocateHours
      datesToHours={datesToHours}
      weekNumber={weekNumber}
      onWeekNumberDecrement={handleWeekNumberDecrement}
      onWeekNumberIncrement={handleWeekNumberIncrement}
      onHoursClick={handleHoursClick}
    />
  );
}

export default AllocateHoursContainer;
