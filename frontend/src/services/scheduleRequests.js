import { BACKEND_URL } from "./config";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/schedules`;

/**Gets a StudyDateHour instance by user id. */
export async function getUpdateStudyDatesHours() {
  const url = `${BASE_URL}/study-date-hour-list/`;
  const response = await apiClient.post(url, true);
  return response;
}

/**Update a StudyDateHour instance by instance pk. */
export async function updateStudyDateHour(pk, data) {
  const url = `${BASE_URL}/study-date-hour/${pk}/`;
  const response = await apiClient.patch(url, true, data);
  return response;
}

/**Setting all StudyDateHours instances associated with a user to have hours=0 */
export async function zeroStudyDatesHours() {
  const url = `${BASE_URL}/study-date-hour-list/zero/`;
  const response = await apiClient.patch(url, true);
  return response;
}

/**Fetching plan and topics data with required_hours field by user id.*/
export async function getPlansWithRequiredHours() {
  const url = `${BASE_URL}/plan-required-hours/`;
  const response = await apiClient.get(url, true);
  return response;
}
