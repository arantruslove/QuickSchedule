/**Add a field with a default value to each object in a list of objects. */
export function addFieldToObjects(listToAddFieldsTo, fieldName, value) {
  const updatedList = JSON.parse(JSON.stringify(listToAddFieldsTo)); // Deep copy

  for (let i = 0; i < updatedList.length; i++) {
    updatedList[i][fieldName] = value;
  }

  return updatedList;
}
