import { useState } from "react";

import { getISODatesToZeroHours } from "../dateFormat";
import AllocateHours from "../components/AllocateHours";

const NUMBER_DAYS_TO_RENDER = 182; // Half a year
const datesToHours = getISODatesToZeroHours(NUMBER_DAYS_TO_RENDER);

function AllocateHoursContainer() {
  const [weekNumber, setWeekNumber] = useState(0);

  // Event handling
  const handleWeekNumberDecrement = () => {
    setWeekNumber(weekNumber - 1);
  };

  const handleWeekNumberIncrement = () => {
    setWeekNumber(weekNumber + 1);
  };

  return (
    <AllocateHours
      datesToHours={datesToHours}
      weekNumber={weekNumber}
      onWeekNumberDecrement={handleWeekNumberDecrement}
      onWeekNumberIncrement={handleWeekNumberIncrement}
    />
  );
}

export default AllocateHoursContainer;
