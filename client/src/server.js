// API configuration
const API_BASE_URL = "https://mern-auth-api-zeta.vercel.app/api"

// API endpoints
export const API_ENDPOINTS = {
  TEST: `${API_BASE_URL}/test`,
  REGISTER: `${API_BASE_URL}/auth/signup`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/auth/profile`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
}

// Helper function to make API requests
export const makeRequest = async (url, options = {}) => {
  console.log(`Making request to: ${url}`, options)

  try {
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        "Content-Type": "application/json",
      }
    }

    // Add authorization header if token exists
    const token = localStorage.getItem("token")
    if (token && !options.headers.Authorization) {
      options.headers.Authorization = `Bearer ${token}`
    }

    // Make the request
    const response = await fetch(url, options)

    // Log the raw response for debugging
    const responseText = await response.text()
    console.log(`Raw response from ${url}:`, responseText)

    // Parse the response as JSON
    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`)
    }

    // Check if response is ok
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`)
    }

    return data
  } catch (error) {
    console.error(`Error making request to ${url}:`, error)
    throw error
  }
}
