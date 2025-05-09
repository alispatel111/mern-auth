// Configuration file for API endpoints

// Backend URL configuration
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "https://mern-auth-api-zeta.vercel.app" : "http://localhost:5000"

// API endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
  RESEND_VERIFICATION: `${API_BASE_URL}/api/auth/resend-verification`,
  VERIFY_RESET_TOKEN: `${API_BASE_URL}/api/auth/verify-reset-token`,

  // User endpoints
  GET_PROFILE: `${API_BASE_URL}/api/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,

  // Google auth
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,

  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
  TEST: `${API_BASE_URL}/api/test`,
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

    console.log(`Making request to: ${endpoint}`, fetchOptions)

    // Make the request
    const response = await fetch(endpoint, fetchOptions)

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse JSON, but handle case where response is not JSON
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        // If response is not JSON, use text instead
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`)
    }

    // Parse the JSON response
    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

// Export the API endpoints and helper function
export { API_ENDPOINTS, makeRequest, API_BASE_URL }
