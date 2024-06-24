/**Updates the list with the selected status provided by another list
 * (i.e. from the server).
 * */
export function updateManySelectedStatus(listToUpdate, listWithUpdatedValues) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < updatedList.length; i++) {
    for (let j = 0; j < listWithUpdatedValues.length; j++) {
      if (updatedList[i]["id"] === listWithUpdatedValues[j]["id"]) {
        updatedList[i]["is_selected"] = listWithUpdatedValues[j]["is_selected"];
      }
    }
  }
  return updatedList;
}

/**Switch a boolean to its other value (true -> false or false -> true).
 */
export function switchBool(listToUpdate, planId) {
  const updatedList = JSON.parse(JSON.stringify(listToUpdate)); // Deep copy

  for (let i = 0; i < listToUpdate.length; i++) {
    if (listToUpdate[i]["id"] === planId) {
      updatedList[i]["is_selected"] = !updatedList[i]["is_selected"];
    }
  }
  return updatedList;
}
