import { useCallback } from "react"
import { toast } from "../store/useToastStore"

/**
 * 🛡️ Hook for centralized error handling across the app
 */
export const useErrorHandler = () => {
  /**
   * Handle API errors with proper messaging
   */
  const handleApiError = useCallback((error, context = "Operation") => {
    console.error(`❌ API Error in ${context}:`, error)

    let message = "Something went wrong. Please try again."
    let title = "Error"

    // Handle axios response errors
    if (error?.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          message = data?.message || "Invalid request. Please check your input."
          title = "Validation Error"
          break
        
        case 401:
          message = "Your session has expired. Please log in again."
          title = "Authentication Error"
          // Trigger logout if needed
          break
        
        case 403:
          message = "You don't have permission to perform this action."
          title = "Access Denied"
          break
        
        case 404:
          message = data?.message || "The requested resource was not found."
          title = "Not Found"
          break
        
        case 409:
          message = data?.message || "This resource already exists or conflicts with existing data."
          title = "Conflict Error"
          break
        
        case 422:
          message = data?.message || "The data you provided is invalid."
          title = "Validation Error"
          break
        
        case 429:
          message = "Too many requests. Please wait a moment and try again."
          title = "Rate Limit"
          break
        
        case 500:
          message = "Server error. Our team has been notified."
          title = "Server Error"
          break
        
        case 503:
          message = "Service is temporarily unavailable. Please try again later."
          title = "Service Unavailable"
          break
        
        default:
          message = data?.message || `Request failed with status ${status}`
          title = "Request Failed"
      }
    } 
    // Handle network errors
    else if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
      message = "Network connection failed. Please check your internet and try again."
      title = "Network Error"
    }
    // Handle timeout errors
    else if (error?.code === "ECONNABORTED") {
      message = "Request timed out. Please try again."
      title = "Timeout Error"
    }
    // Handle custom error messages
    else if (error?.message) {
      message = error.message
      title = error.title || "Error"
    }

    toast.error(message, title)
    return { message, title }
  }, [])

  /**
   * Handle form validation errors
   */
  const handleValidationError = useCallback((errors) => {
    if (!errors || typeof errors !== "object") return

    Object.entries(errors).forEach(([field, message]) => {
      toast.error(`${field}: ${message}`)
    })
  }, [])

  /**
   * Handle async operations with error handling
   */
  const handleAsync = useCallback(
    async (asyncFn, context = "Operation") => {
      try {
        return await asyncFn()
      } catch (error) {
        handleApiError(error, context)
        throw error
      }
    },
    [handleApiError]
  )

  /**
   * Handle loading state errors
   */
  const logError = useCallback((error, context = "Unknown") => {
    const errorInfo = {
      context,
      timestamp: new Date().toISOString(),
      message: error?.message || String(error),
      stack: error?.stack,
    }

    console.error("📋 Error Log:", errorInfo)

    // Send to error tracking service (optional)
    if (window.__logError) {
      window.__logError(errorInfo)
    }

    return errorInfo
  }, [])

  return {
    handleApiError,
    handleValidationError,
    handleAsync,
    logError,
  }
}

export default useErrorHandler
