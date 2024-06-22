import { BACKEND_URL } from "./config";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/schedules`;

/**Gets a ScheduleFormDraft instance by user id. */
export async function getFormDraft() {
  const url = `${BASE_URL}/draft/`;
  const response = await apiClient.get(url, true);
  return response;
}

/**Creates a ScheduleFormDraft instance by user id. */
export async function createFormDraft() {
  const url = `${BASE_URL}/draft/`;
  const response = await apiClient.post(url, true);
  return response;
}

/**Updates the ScheduleFormDraft instance by user id.
 * Data takes the fields:
 * - daily_study_hours
 */
export async function updateFormDraft(data) {
  const url = `${BASE_URL}/draft/`;
  const response = await apiClient.patch(url, true, data);
  return response;
}
