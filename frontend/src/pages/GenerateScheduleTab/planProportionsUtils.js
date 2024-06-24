/**
 * Remove all fields which correspond to a value of false
 */
export function removeFalseFields(listToUpdate, fieldName) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  let i = 0;
  while (i < updatedList.length) {
    if (updatedList[i][fieldName] === false) {
      updatedList.splice(i, 1);
    } else {
      i++;
    }
  }
  return updatedList;
}

/**
 * Filters a list by whether its id corresponds to is_selected = true in the reference list.
 */
export function filterByIsSelected(listToFilter, referenceList) {
  // Create a mapping of id to is_selected status
  const idToStatus = {};
  for (let i = 0; i < referenceList.length; i++) {
    idToStatus[referenceList[i].id] = referenceList[i].is_selected;
  }

  // Filter the list based on the is_selected status
  const filteredList = listToFilter.filter(
    (item) => idToStatus[item.id] === true
  );

  return filteredList;
}

/**Updates the percent allocated and the exam date (i.e. for syncing with saved form
 * data on the server)
 * */
export function updateExamDatesPercentsAllocated(
  listToUpdate,
  listWithUpdatedValues
) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < updatedList.length; i++) {
    for (let j = 0; j < listWithUpdatedValues.length; j++) {
      if (updatedList[i]["id"] === listWithUpdatedValues[j]["id"]) {
        updatedList[i]["percent_allocated"] =
          listWithUpdatedValues[j]["percent_allocated"];

        updatedList[i]["exam_date"] = listWithUpdatedValues[j]["exam_date"];
      }
    }
  }
  return updatedList;
}

/**Update a single percent field of an object queried by id.*/
export function updateSinglePercent(listToUpdate, id, newPercent) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < listToUpdate.length; i++) {
    if (listToUpdate[i]["id"] === id) {
      updatedList[i]["percent_allocated"] = newPercent;
    }
  }
  return updatedList;
}

/**Update a single exam_date field of an object queried by id.*/
export function updateSingleExamDate(listToUpdate, id, newISODate) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < listToUpdate.length; i++) {
    if (listToUpdate[i]["id"] === id) {
      updatedList[i]["exam_date"] = newISODate;
    }
  }
  return updatedList;
}

/**Truncate the time part of the ISO format date. */
export function truncateISODate(dateToTruncate) {
  return dateToTruncate.split("T")[0];
}

/**Add back the time part of the ISO date and set it to midnight. */
export function completeISODate(truncatedDate) {
  return `${truncatedDate}T00:00:00.000Z`;
}
