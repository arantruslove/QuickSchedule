import { BACKEND_URL } from "./config";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/schedules`;

/**Gets a ScheduleFormDraft instance by user id. */
export async function getUpdateStudyDatesHours() {
  const url = `${BASE_URL}/study-date-hour-list/`;
  const response = await apiClient.post(url, true);
  return response;
}

/**Update a ScheduleFormDraft instance by instance pk. */
export async function updateStudyDateHour(pk, data) {
  const url = `${BASE_URL}/study-date-hour/${pk}/`;
  const response = await apiClient.patch(url, true, data);
  return response;
}
