import Cookies from "js-cookie";

import { csrftoken } from "./utils";

/**
 * API request function naming conventions:
 * GET: e.g. getUser
 * POST: e.g. createUser
 * PUT/PATCH: e.g. editUser
 * DELTE: deleteUser
 *
 */

/**
 * Performs a GET request to the specified URL.
 * @param {string} url - The URL to send the GET request to.
 * @param {boolean} authenticated - Indicates whether the request should be authenticated.
 * @returns {Promise<Response>} - A Promise that resolves to the response of the GET request.
 */
async function get(url, authenticated) {
  const options = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Fetch access token and add as authorization header if required
  if (authenticated) {
    const authToken = Cookies.get("auth_token");
    options["headers"]["Authorization"] = `Token ${authToken}`;
  }

  const response = await fetch(url, options);

  return response;
}

/**
 * Sends a POST request to the specified URL.
 * @param {string} url - The URL to send the request to.
 * @param {boolean} authenticated - Indicates whether the request requires authentication.
 * @param {object} body - The request body to be sent as JSON.
 * @returns {Promise<Response>} - A Promise that resolves to the response of the request.
 */
async function post(url, authenticated, body = null) {
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };

  // Fetch access token and add as authorization header if required
  if (authenticated) {
    const authToken = Cookies.get("auth_token");
    options["headers"]["Authorization"] = `Token ${authToken}`;
  }

  // Adding JSON body if passed as an argument
  if (body) {
    options["body"] = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  return response;
}

/**
 * Sends a PUT request to the specified URL.
 * @param {string} url - The URL to send the request to.
 * @param {boolean} authenticated - Indicates whether the request requires authentication.
 * @param {object} body - The request body to be sent as JSON.
 * @returns {Promise<Response>} - A Promise that resolves to the response of the request.
 */
async function put(url, authenticated, body = null) {
  const options = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };

  // Fetch access token and add as authorization header if required
  if (authenticated) {
    const authToken = Cookies.get("auth_token");
    options["headers"]["Authorization"] = `Token ${authToken}`;
  }

  // Adding JSON body if passed as an argument
  if (body) {
    options["body"] = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  return response;
}

/**
 * Sends a DELETE request to the specified URL.
 * @param {string} url - The URL to send the DELETE request to.
 * @param {boolean} authenticated - Indicates whether the request should be authenticated.
 * @returns {Promise<Response>} - A promise that resolves to the response from the server.
 */

async function del(url, authenticated) {
  const options = {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
  };

  // Fetch access token and add as authorization header if required
  if (authenticated) {
    const authToken = Cookies.get("auth_token");
    options["headers"]["Authorization"] = `Token ${authToken}`;
  }

  const response = await fetch(url, options);

  return response;
}

/**
 * Creates an API client object with HTTP methods.
 * @returns {Object} The API client object.
 */
export const apiClient = {
  get: (url, authenticated) => get(url, authenticated),
  post: (url, authenticated, body) => post(url, authenticated, body),
  put: (url, authenticated, body) => put(url, authenticated, body),
  delete: (url, authenticated) => del(url, authenticated),
};
