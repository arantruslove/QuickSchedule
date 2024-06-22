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

/**Sets the time part of the ISO 8106 representation to midnight. */
function getDateOnly() {
  const dateOnly = new Date();
  dateOnly.setHours(0, 0, 0, 0);
  return dateOnly;
}

/**Generates a list of lists where each sublist corresponds to a week until Sunday. Each
 * index to a day of the week and contains an object with the fields:
 *
 * - isoDate
 * - formattedDate
 * - hours
 *
 * Where isoDate is used for standardisation and logic and formattedData is used for
 * displaying the date. hours is set to 0 initially and will be the number of days that
 * the
 */
export function getWeeksDaysHours(nWeeks) {
  const weeks = [];

  let dayOffset = 0;
  for (let weekNumber = 0; weekNumber < nWeeks; weekNumber++) {
    let week = [];
    let weekDay = -1;
    while (weekDay != 0) {
      const date = getDateOnly();
      date.setDate(date.getDate() + dayOffset);

      const formattedDate = `${date.getDate()} ${
        MONTH_STR_REP[date.getMonth()]
      } ${date.getFullYear()}`;

      const dateFields = {
        isoDate: date.toISOString(),
        formattedDate: formattedDate,
        hours: 0,
      };
      week.push(dateFields);

      weekDay = date.getDay();
      dayOffset++;
    }
    weeks.push(week);
  }

  return weeks;
}
