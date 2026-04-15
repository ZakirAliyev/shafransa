/**
 * 🛡️ Safe Data Access Utilities
 * Prevents "undefined" errors by providing safe getters for nested properties
 */

/**
 * Safely get nested property value with fallback
 * @param {object} obj - Object to access
 * @param {string} path - Path to property (e.g., "user.profile.name")
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} Property value or default
 */
export const safeGet = (obj, path, defaultValue = null) => {
  try {
    if (!obj || !path) return defaultValue
    
    const value = path.split(".").reduce((acc, part) => {
      return acc?.[part]
    }, obj)
    
    return value !== undefined && value !== null ? value : defaultValue
  } catch (error) {
    console.warn(`⚠️ safeGet error for path "${path}":`, error)
    return defaultValue
  }
}

/**
 * Safely access array items with bounds checking
 * @param {array} arr - Array to access
 * @param {number} index - Index to access
 * @param {*} defaultValue - Default value if index is out of bounds
 * @returns {*} Array item or default
 */
export const safeGetArray = (arr, index, defaultValue = null) => {
  try {
    if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
      return defaultValue
    }
    return arr[index] ?? defaultValue
  } catch (error) {
    console.warn(`⚠️ safeGetArray error at index ${index}:`, error)
    return defaultValue
  }
}

/**
 * Safely call a function and handle errors
 * @param {function} fn - Function to call
 * @param {*} fallback - Value to return if function throws
 * @param {*} args - Arguments to pass to function
 * @returns {*} Function result or fallback
 */
export const safeCall = (fn, fallback = null, ...args) => {
  try {
    if (typeof fn !== "function") {
      console.warn("⚠️ safeCall: provided argument is not a function")
      return fallback
    }
    return fn(...args) ?? fallback
  } catch (error) {
    console.warn("⚠️ safeCall error:", error)
    return fallback
  }
}

/**
 * Safely format data for display (prevents rendering errors)
 * @param {*} value - Value to format
 * @param {string} type - Type of formatting (text, number, date, currency)
 * @returns {string} Formatted value or safe string representation
 */
export const safeFormat = (value, type = "text") => {
  try {
    if (value === null || value === undefined) return "—"

    switch (type) {
      case "number":
        return typeof value === "number" ? value.toLocaleString() : String(value)
      
      case "currency":
        return typeof value === "number" 
          ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          : String(value)
      
      case "date":
        return value instanceof Date 
          ? value.toLocaleDateString() 
          : new Date(value).toLocaleDateString()
      
      case "text":
      default:
        return String(value)
    }
  } catch (error) {
    console.warn(`⚠️ safeFormat error with type "${type}":`, error)
    return "—"
  }
}

/**
 * Validate and sanitize data before use
 * @param {*} value - Value to validate
 * @param {string} expectedType - Expected type (string, number, object, array, boolean)
 * @returns {boolean} Whether value is valid
 */
export const validateData = (value, expectedType = "object") => {
  try {
    if (value === null || value === undefined) return false

    const actualType = Array.isArray(value) ? "array" : typeof value
    return actualType === expectedType
  } catch (error) {
    console.warn("⚠️ validateData error:", error)
    return false
  }
}

/**
 * Create a safe object that handles all property access
 * @param {object} obj - Object to wrap
 * @param {*} defaultValue - Default value for missing properties
 * @returns {proxy} Proxied object with safe access
 */
export const createSafeObject = (obj, defaultValue = null) => {
  return new Proxy(obj || {}, {
    get: (target, prop) => {
      try {
        const value = target[prop]
        return value !== undefined ? value : defaultValue
      } catch (error) {
        console.warn(`⚠️ createSafeObject access error for property "${String(prop)}":`, error)
        return defaultValue
      }
    },
  })
}

/**
 * Merge multiple objects safely
 * @param {...objects} objects - Objects to merge
 * @returns {object} Merged object
 */
export const safeMerge = (...objects) => {
  return objects.reduce((acc, obj) => {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return { ...acc, ...obj }
    }
    return acc
  }, {})
}

/**
 * Create async operation wrapper with error handling
 * @param {function} asyncFn - Async function to execute
 * @param {*} fallback - Value to return on error
 * @returns {function} Wrapped async function
 */
export const withErrorHandling = (asyncFn, fallback = null) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      console.error("⚠️ Async operation error:", error)
      return fallback
    }
  }
}
