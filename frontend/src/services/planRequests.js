import { BACKEND_URL } from "./config";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/plans`;

/**Create a new PrivatePlan instance
 *
 * Requires the fields:
 * - name
 *
 */
export async function createPrivatePlan(data) {
  // Adding this field since user's creating the plan will be the author
  data["is_user_author"] = true;
  const url = `${BASE_URL}/private-plan/`;
  const response = await apiClient.post(url, true, data);
  return response;
}
