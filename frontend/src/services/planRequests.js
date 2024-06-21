import { BACKEND_URL } from "./config";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/plans`;

/**Create a new PrivatePlan instance
 *
 * Requires the fields:
 * - title
 *
 */
export async function createPrivatePlan(data) {
  // Adding this field since user's creating the plan will be the author
  data["is_user_author"] = true;
  const url = `${BASE_URL}/private-plan/`;
  const response = await apiClient.post(url, true, data);
  return response;
}

/**Gets the list of PrivatePlans that are associated with the user.*/
export async function getPrivatePlans() {
  const url = `${BASE_URL}/private-plans/`;
  const response = await apiClient.get(url, true);
  return response;
}

/**Creates a new Topic associated with the PrivatePlan
 *
 * Requires the fields:
 * - private_plan
 * - title
 * - hours
 */
export async function createTopic(data) {
  const url = `${BASE_URL}/topic/`;
  const response = await apiClient.post(url, true, data);
  return response;
}

/**Gets the list of Topics associate with a PrivatePlan. */
export async function getTopicsofPrivatePlan(privatePlanId) {
  const url = `${BASE_URL}/topics/?private_plan_id=${privatePlanId}`;
  const response = await apiClient.get(url, true);
  return response;
}

/**Creates a new Topic associated with the PrivatePlan
 *
 * Updatable fields :
 * - title
 * - hours
 */
export async function updateTopic(pk, data) {
  const url = `${BASE_URL}/topic/${pk}/`;
  const response = await apiClient.patch(url, true, data);
  return response;
}
