// Configuration file for API endpoints

// Backend URL configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://mern-auth-api-zeta.vercel.app/api" : "http://localhost:5000/api"

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
  VERIFY_RESET_TOKEN: `${API_BASE_URL}/auth/verify-reset-token`,

  // User endpoints
  GET_PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,

  // Google auth
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,

  // Health check
  HEALTH: `${API_BASE_URL}/health`,
}

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  try {
    // Default options for fetch
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    // Add authorization header if token exists
    const token = localStorage.getItem("token")
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`
    }

    // Merge default options with provided options
    const fetchOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    }

    // Make the request
    const response = await fetch(endpoint, fetchOptions)

    // Parse the JSON response
    const data = await response.json()

    // If the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }

    // Return the data
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Export the API endpoints and helper function
export { API_ENDPOINTS, makeRequest, API_BASE_URL }
