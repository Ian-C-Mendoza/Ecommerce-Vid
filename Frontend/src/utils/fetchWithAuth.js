// src/utils/fetchWithAuth.js
const BACKEND_URL = "http://localhost:5000"; // adjust if needed

export async function fetchWithAuth(endpoint, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Initial request
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // If token expired, try refreshing
    if (response.status === 401) {
      const data = await response.json();

      if (data.message === "Access token expired" && refreshToken) {
        const refreshResponse = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        });

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok) {
          // Save new token
          localStorage.setItem("accessToken", refreshData.accessToken);
          accessToken = refreshData.accessToken;

          // Retry the original request with new token
          const retryResponse = await fetch(`${BACKEND_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${accessToken}`,
            },
          });

          return retryResponse;
        } else {
          // Refresh failed — force logout
          logoutUser();
          return refreshResponse;
        }
      }
    }

    return response;
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    throw error;
  }
}

function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
