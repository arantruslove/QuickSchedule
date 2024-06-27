/******************************************
 * Handling date and time utility functions
 ******************************************/

// Constants
const MONTH_STR_REP = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const DAY_STR_REP = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

/**Truncate the time part of the ISO format date. */
export function truncateISODate(dateToTruncate) {
  return dateToTruncate.split("T")[0];
}

/**Add back the time part of the ISO date and set it to midnight. */
export function completeISODate(truncatedDate) {
  return `${truncatedDate}T00:00:00.000Z`;
}

/**Format the date to a human readable form. */
export function formatDate(isoDateString) {
  const dateObject = new Date(isoDateString);
  return `${dateObject.getDate()} ${
    MONTH_STR_REP[dateObject.getMonth()]
  } ${dateObject.getFullYear()}`;
}

/**Sets the time part of the ISO 8106 representation to midnight. */
export function getDateOnly() {
  const dateOnly = new Date();
  const truncatedISODate = truncateISODate(dateOnly.toISOString());
  const midnightISODate = completeISODate(truncatedISODate);
  return new Date(midnightISODate);
}

/**Sorts a list of ISO format dates in order of earliest to latest. */
function orderISODates(datesToOrder) {
  datesToOrder.sort((date1, date2) => {
    const date1Obj = new Date(date1);
    const date2Obj = new Date(date2);
    return date1Obj - date2Obj;
  });
}

/**Starting from today, gets a list of ISO format dates in consecutive days returning
 * a dictionary of nDays keys.
 */
export function getISODatesToZeroHours(nDays) {
  const datesToHours = {};
  for (let i = 0; i < nDays; i++) {
    const date = getDateOnly();
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString();

    // Setting to zero hours
    datesToHours[isoDate] = 0;
  }
  return datesToHours;
}

/**Format dates to a list with extra fields such as day, */
export function formatDatesInList(datesToHours) {
  const datesList = Object.keys(datesToHours);
  orderISODates(datesList); // Ordering the list of dates

  const formattedList = [];
  for (const isoDate of datesList) {
    // Getting the formatted date representation
    const dateObj = new Date(isoDate);
    const formattedRepresentation = formatDate(dateObj.toISOString());
    // Creating an object with all the necessary fields
    // snake_case used for fields to align with server variable conventions
    const formattedDateObj = {};
    formattedDateObj["iso_date"] = isoDate;
    formattedDateObj["formatted_date"] = formattedRepresentation;
    formattedDateObj["day"] = DAY_STR_REP[dateObj.getDay()]; // Day of the week
    formattedDateObj["study_hours"] = datesToHours[isoDate];

    formattedList.push(formattedDateObj);
  }

  return formattedList;
}

/**Split into a list of sublists where each sublist corresponds to a week. */
export function splitByWeek(inputDates) {
  const weekByWeekDates = [];

  let week = [];
  for (const dateObj of inputDates) {
    week.push(dateObj);
    if (dateObj["day"] === "Sunday") {
      weekByWeekDates.push(week);
      week = [];
    }
  }

  // Append the remaining week if it is not empty
  if (week.length != 0) {
    weekByWeekDates.push(week);
  }
  return weekByWeekDates;
}

/******************************************
 * Handling plan data structure conversions
 ******************************************/

/**Converts a list of plans data structure into a dictionary format where id is the key
 * and value is another dictionary with relevant fields associated with the plan.
 */
export function plansListToDict(plansList, extraKeyValues = {}) {
  const plansDict = {};

  for (const plan of plansList) {
    const planInfo = {};
    // Setting the fields
    planInfo["title"] = plan["title"];
    // Including extra key-values
    for (const [key, value] of Object.entries(extraKeyValues)) {
      planInfo[key] = value;
    }

    const planId = plan["id"];
    plansDict[planId] = planInfo;
  }
  return plansDict;
}

/**Converts a plans dictionary data structure back into the list format. */
export function plansDictToList(plansDict) {
  const plansList = [];

  for (const planId of Object.keys(plansDict)) {
    const planInfo = plansDict[planId];
    const planObject = {};
    for (const key of Object.keys(planInfo)) {
      planObject[key] = planInfo[key];
    }
    planObject["id"] = planId;

    plansList.push(planObject);
  }

  // Order from largest id (added most recently) to smallest (added least recently)
  plansList.sort((planObject1, planObject2) => {
    return planObject2["id"] - planObject1["id"];
  });

  return plansList;
}

/*********************************************
 * Utility functions for TopicHours components
 *********************************************/

export function computeTotalDictHours(datesToHours) {
  const hoursList = Object.values(datesToHours);
  const total = hoursList.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  });
  return total;
}

function computerTotalListHours(plansList) {
  let total = 0;
  for (const planDetails of plansList) {
    total += planDetails["hours_allocated"];
  }
  return total;
}

function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

/**To check that two floats are equal to within typical floating point rounding error.
 */
function areFloatsEqual(num1, num2, epsilon = Number.EPSILON) {
  return Math.abs(num1 - num2) < epsilon;
}

/**Enforcing that the sum of the hours_allocated fields match with that of the
 * required hours (i.e. the total hours specified in the study schedule)
 */
export function enforceHours(plansDict, requiredHours) {
  const plansList = plansDictToList(plansDict);
  // Sorting from largest number of hours allocated to smallest
  plansList.sort((planDetails1, planDetails2) => {
    return planDetails2["hours_allocated"] - planDetails1["hours_allocated"];
  });

  // Enforcing the hours in the list format
  let currentHours = computerTotalListHours(plansList);
  let i = 0;
  while (
    !areFloatsEqual(currentHours, requiredHours) &&
    i < 5 * plansList.length // To prevent a page freeze in case of an error
  ) {
    const index = i % plansList.length;
    if (currentHours < requiredHours) {
      plansList[index]["hours_allocated"] += 0.5;
    } else {
      plansList[index]["hours_allocated"] -= 0.5;
    }

    currentHours = computerTotalListHours(plansList);
    i++;
  }

  // Updating the original input object
  for (const planDetails of plansList) {
    const id = planDetails["id"];
    const updatedHours = planDetails["hours_allocated"];
    plansDict[id]["hours_allocated"] = updatedHours;
  }
}

/**Assigns the number of hours that each plan should be studied. */
export function assignPlanHours(plansDict, totalHours) {
  const updatedPlansDict = { ...plansDict };
  for (const [planId, planDetails] of Object.entries(plansDict)) {
    const fraction = planDetails["percent_allocated"] / 100;
    const hoursToAllocate = roundToNearestHalf(fraction * totalHours);
    updatedPlansDict[planId]["hours_allocated"] = hoursToAllocate;
  }

  // Ensuring that the sum of the hours allocated to each plan matched totalHours
  enforceHours(updatedPlansDict, totalHours);
  return updatedPlansDict;
}

/**Returns a list of the exam date index relative to the first date of study in
 * datesToHours
 */
function getExamDateIndices(plansDict, datesToHours) {
  // Creates a list of the final day that each plan can be studied on
  const datesList = Object.keys(datesToHours);
  const examDayNums = []; // Index of the exam date of a plan
  for (const planDetails of Object.values(plansDict)) {
    const examDate = planDetails["exam_date"];
    const examDayNum = datesList.indexOf(examDate);
    examDayNums.push(examDayNum);
  }
  examDayNums.sort((a, b) => a - b);
  return examDayNums;
}

/**Gets the number of hours available before each exam. */
function getAvailableHours(hoursList, examDateIndices) {
  const availableHours = [];
  let startIndex = 0;

  for (let i = 0; i < examDateIndices.length; i++) {
    const endIndex = examDateIndices[i];
    const totalHours = hoursList
      .slice(startIndex, endIndex)
      .reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    availableHours.push(totalHours);
    startIndex = endIndex;
  }
  return availableHours;
}

function getRemainingHours(plansList, availableHours) {
  const remainders = [];
  for (let i = 0; i < availableHours.length; i++) {
    let remainder = availableHours[i] - plansList[i]["hours_allocated"];

    if (i > 0) {
      remainder += remainders[i - 1];
    }
    remainders.push(remainder);
  }
  return remainders;
}

export function isViable(plansDict, datesToHours) {
  // Creates a list of the number of hours that should be studied on each day (index)
  const hoursList = [];
  for (const hour of Object.values(datesToHours)) {
    hoursList.push(hour);
  }
  const plansList = plansDictToList(plansDict);
  // Order plans by closest to furthest away
  plansList.sort((dict1, dict2) => {
    const date1 = new Date(dict1["exam_date"]);
    const date2 = new Date(dict2["exam_date"]);
    return date1.getTime() - date2.getTime();
  });

  const examDateIndices = getExamDateIndices(plansDict, datesToHours);
  const availableHours = getAvailableHours(hoursList, examDateIndices);
  const remainingHours = getRemainingHours(plansList, availableHours);

  for (let i = 0; i < remainingHours.length; i++) {
    if (remainingHours[i] < 0) {
      return plansList[i];
    }
  }
  return true;
}
