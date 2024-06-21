/**
 * Converts a javascript object into query parameters.
 *
 * @param {object} params
 * @returns string
 */
export function toQueryString(params) {
  return Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
    )
    .join("&");
}

/**
 * Function to get the last segment of a URL or a pathname.
 *
 * @param {string} url - The URL or pathname to process.
 * @returns {string | null}
 */
export function getLastUrlSegment(url) {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // Remove leading and trailing slashes from the url, then split it into segments.
      const pathname = url.replace(/^\/|\/$/g, "");
      const segments = pathname.split("/");
      return segments[segments.length - 1];
    }

    const parsedUrl = new URL(url);

    const pathname = parsedUrl.pathname.replace(/^\/|\/$/g, "");
    const segments = pathname.split("/");

    // Return the last segment.
    return segments[segments.length - 1];
  } catch (e) {
    console.error(`Invalid URL: ${url}`);
    return null;
  }
}

/**
 * Function to get the first segment of a URL or a pathname.
 *
 * @param {string} url - The URL or pathname to process.
 * @returns {string | null}
 */
export function getFirstUrlSegment(url) {
  try {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      // Remove leading and trailing slashes from the url, then split it into segments.
      const pathname = url.replace(/^\/|\/$/g, "");
      const segments = pathname.split("/");
      return segments[0] || null;
    }

    const parsedUrl = new URL(url);

    const pathname = parsedUrl.pathname.replace(/^\/|\/$/g, "");
    const segments = pathname.split("/");

    // Return the first segment.
    return segments[0] || null;
  } catch (e) {
    console.error(`Invalid URL: ${url}`);
    return null;
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export const csrftoken = getCookie("csrftoken");
