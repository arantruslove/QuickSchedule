/**
 * Utility functions for handling different date/hour formats and represenations.
 */

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

// Functions

/**Sets the time part of the ISO 8106 representation to midnight. */
function getDateOnly() {
  const dateOnly = new Date();
  dateOnly.setHours(0, 0, 0, 0);
  return dateOnly;
}

export function getISODatesToZeroHours(nDays) {
  const dateToHours = [];
  for (let i = 0; i < nDays; i++) {
    const date = getDateOnly();
    date.setDate(date.getDate() + i);
    const isoDate = date.toISOString();

    // Initialise with zero hours
    const dateObj = { isoDate: isoDate, hours: 0 };
    dateToHours.push(dateObj);
  }
  return dateToHours;
}

/**Updates the hours of an original list with hour values from a fresh list. */
export function updateManyHours(listToUpdate, listWithUpdatedValues) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < updatedList.length; i++) {
    for (let j = 0; j < listWithUpdatedValues.length; j++) {
      if (updatedList[i]["isoDate"] === listWithUpdatedValues[j]["isoDate"]) {
        updatedList[i]["hours"] = listWithUpdatedValues[j]["hours"];
      }
    }
  }

  return updatedList;
}

/**Updates single hours in a list. */
export function updateSingleHours(listToUpdate, isoDateToUpdate, newHours) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < listToUpdate.length; i++) {
    if (listToUpdate[i]["isoDate"] === isoDateToUpdate) {
      updatedList[i]["hours"] = newHours;
    }
  }
  return updatedList;
}

/**Include formattedDate and day field which can be used as representation in the
 * presentational components.
 */
export function addFormattedDateDay(inputList) {
  const readableList = JSON.parse(JSON.stringify(inputList));

  for (let i = 0; i < inputList.length; i++) {
    const date = new Date(readableList[i]["isoDate"]);
    const formattedDate = `${date.getDate()} ${
      MONTH_STR_REP[date.getMonth()]
    } ${date.getFullYear()}`;
    const day = DAY_STR_REP[date.getDay()];

    readableList[i]["formattedDate"] = formattedDate;
    readableList[i]["day"] = day;
  }

  return readableList;
}

/**Split into a list of sublists where each sublist corresponds to a week. */
export function splitByWeek(inputList) {
  const weekByWeekDates = [];

  let week = [];
  for (let i = 0; i < inputList.length; i++) {
    const dayInfo = inputList[i];
    week.push(dayInfo);
    if (dayInfo["day"] === "Sunday") {
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
