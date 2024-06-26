/**Sums up the total study hours contained in a datesToHours structure. */
export function computeTotalStudyHours(datesToHours) {
  let total = 0;
  for (const object of datesToHours) {
    total += object["hours"];
  }
  return total;
}


