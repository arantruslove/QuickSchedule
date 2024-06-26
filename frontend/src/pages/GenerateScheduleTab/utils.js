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

/**Sets the time part of the ISO 8106 representation to midnight. */
function getDateOnly() {
  const dateOnly = new Date();
  dateOnly.setHours(0, 0, 0, 0);
  return dateOnly;
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
    const formattedRepresentation = `${dateObj.getDate()} ${
      MONTH_STR_REP[dateObj.getMonth()]
    } ${dateObj.getFullYear()}`;

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

/**Truncate the time part of the ISO format date. */
export function truncateISODate(dateToTruncate) {
  return dateToTruncate.split("T")[0];
}

/**Add back the time part of the ISO date and set it to midnight. */
export function completeISODate(truncatedDate) {
  return `${truncatedDate}T00:00:00.000Z`;
}

/*********************************************
 * Utility functions for TopicHours components
 *********************************************/

export function computeTotalHours(datesToHours) {
  const hoursList = Object.values(datesToHours);
  const total = hoursList.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  });
  return total;
}
