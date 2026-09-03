// Base URL for the FloraFind backend. Configure via VITE_API_BASE_URL in a
// .env file (see .env.example) - defaults to the local backend dev server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseResponse = async (response) => {
  let body = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response (e.g. the API is unreachable/misconfigured).
  }

  if (!response.ok || !body?.success) {
    throw new ApiError(
      body?.message || "Something went wrong while talking to the server.",
      response.status
    );
  }

  return body;
};

export const apiGet = async (path) => {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${path}`);
  } catch (error) {
    throw new ApiError(
      error.name === "AbortError"
        ? "The server took too long to respond. Please try again."
        : "Could not reach the FloraFind server. Please check your connection.",
      0
    );
  }
  return parseResponse(response);
};

export const apiPostForm = async (path, formData) => {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    throw new ApiError(
      error.name === "AbortError"
        ? "The server took too long to respond. Please try again."
        : "Could not reach the FloraFind server. Please check your connection.",
      0
    );
  }
  return parseResponse(response);
};

/**
 * Authenticated JSON request used by auth/cart/wishlist/order APIs.
 * `token` (from the auth slice) is sent as a Bearer header when present.
 */
export const apiRequest = async (path, { method = "GET", body, token } = {}) => {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError(
      error.name === "AbortError"
        ? "The server took too long to respond. Please try again."
        : "Could not reach the FloraFind server. Please check your connection.",
      0
    );
  }
  return parseResponse(response);
};
