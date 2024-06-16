import { BACKEND_URL } from "./config";
import { toQueryString } from "./utils.js";
import { apiClient } from "./apiClient.js";

const BASE_URL = `${BACKEND_URL}/accounts`;

/**
 * Requires an object input with the following fields:
 * - email
 *
 * @param {object} data
 * @returns Promise
 */
export async function getEmailTakenStatus(data) {
  const url = `${BASE_URL}/is-email-taken/?${toQueryString(data)}`;
  const response = await apiClient.get(url, false);
  return response;
}

/**
 * Signs up a user with the following fields:
 * - email
 * - password
 *
 * @param {object} data
 * @returns Promise
 */
export async function createUser(data) {
  const url = `${BASE_URL}/sign-up/`;

  const response = await apiClient.post(url, false, data);

  return response;
}

/**
 * Verifies a user's email. Requires the following fields:
 * - token
 *
 * @param {object} data
 * @returns Promise
 */
export async function verifyEmail(data) {
  const url = `${BASE_URL}/verify-email/`;
  const response = await apiClient.post(url, false, data);
  return response;
}

/**
 * User login request which obtains a refresh and access token and saves them as http
 * only cookies. Requires the following fields:
 * - email
 * - password
 *
 * @param {object} data
 * @returns Promise
 */
export async function getAuthToken(data) {
  const url = `${BASE_URL}/get-auth-token/`;
  const response = await apiClient.post(url, false, data);
  return response;
}

/**
 * Checks if a user is authenticated.
 */
export async function getAuthStatus() {
  const url = `${BASE_URL}/get-auth-status/`;
  const response = await apiClient.get(url, true);
  return response;
}

/**
 * Refreshes the access token by making a POST request to the server.
 *
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Response>} - A promise that resolves to the response from the
 *                                server.
 */
export async function getRefreshAccessTokens(data) {
  const url = `${BASE_URL}/token/refresh/`;

  const response = await apiClient.post(url, false, data);
  return response;
}

/**Fetches the user's email address.*/
export async function getAccountDetails() {
  const url = `${BASE_URL}/account-details/`;
  const response = await apiClient.get(url, true);
  return response;
}

/**Removes the refresh and access token so that the user is logged out. */
export async function removeRefreshAccessTokens() {
  const url = `${BASE_URL}/logout/`;
  const response = await apiClient.post(url, true);
  return response;
}

/**Hard deletes the user's account and removes refresh and access tokens. */
export async function deleteUser() {
  const url = `${BASE_URL}/delete-user/`;
  const response = await apiClient.delete(url, true);
  return response;
}

/** Initiates the password reset process.
 *
 * Requires the field:
 * - email
 */
export async function initiatePasswordReset(data) {
  const url = `${BASE_URL}/initiate-password-reset/`;
  const response = await apiClient.post(url, false, data);
  return response;
}

/**Completes the password reset.
 *
 * Requires the fields:
 * - new_password
 * - token
 */
export async function resetPassword(data) {
  const url = `${BASE_URL}/reset-password/`;
  const response = await apiClient.post(url, false, data);
  return response;
}
