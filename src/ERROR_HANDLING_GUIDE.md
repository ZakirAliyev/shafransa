/**
 * 📚 Error Handling Guide - Usage Examples
 * 
 * This file demonstrates how to use the error handling system throughout the app.
 */

// ============================================
// 1️⃣ Safe Data Access (Prevents "undefined" errors)
// ============================================

import { safeGet, safeGetArray, safeFormat, validateData, createSafeObject } from "@/lib/safeData"

// ❌ BEFORE: Can cause "herbData is not defined" error
function ComponentBefore({ data }) {
  return <div>{data.herbs[0].name}</div> // CRASH if herbs doesn't exist!
}

// ✅ AFTER: Safe access
function ComponentAfter({ data }) {
  const herbName = safeGet(data, "herbs.0.name", "No herb found")
  return <div>{herbName}</div> // Never crashes!
}

// Other safe access examples:
const userName = safeGet(user, "profile.name", "Anonymous")
const firstItem = safeGetArray(items, 0, { id: null })
const amount = safeFormat(price, "currency") // "$1,234.56"
const age = safeFormat(dateOfBirth, "date") // "12/25/1990"

// ============================================
// 2️⃣ Error Handler Hook (API & Validation)
// ============================================

import { useErrorHandler } from "@/hooks/useErrorHandler"

function MyComponent() {
  const { handleApiError, handleValidationError, handleAsync } = useErrorHandler()

  // Handle API errors
  const fetchData = async () => {
    try {
      const result = await api.get("/something")
    } catch (error) {
      handleApiError(error, "Fetching Data") // Shows appropriate error message
    }
  }

  // Handle async with error handling
  const submitForm = async () => {
    await handleAsync(async () => {
      const result = await api.post("/submit", formData)
      toast.success("Submitted!")
    }, "Form Submission")
  }

  // Handle validation errors
  const validateForm = () => {
    const errors = {}
    if (!email) errors.email = "Email is required"
    if (!password) errors.password = "Password is required"

    if (Object.keys(errors).length > 0) {
      handleValidationError(errors) // Shows toast for each error
      return false
    }
    return true
  }

  return (
    <div>
      <button onClick={fetchData}>Fetch</button>
      <button onClick={submitForm}>Submit</button>
    </div>
  )
}

// ============================================
// 3️⃣ Error Boundary (React Component Errors)
// ============================================

// The Error Boundary is already wrapping the app in App.jsx
// It catches component rendering errors automatically

// To wrap specific sections:
import ErrorBoundary from "@/components/ErrorBoundary"

function Page() {
  return (
    <div>
      <h1>Page</h1>
      <ErrorBoundary>
        <RiskyComponent /> {/* If this crashes, only this section shows error */}
      </ErrorBoundary>
    </div>
  )
}

// ============================================
// 4️⃣ Safe Async Operations
// ============================================

import { withErrorHandling } from "@/lib/safeData"

// Wrap async functions to catch errors automatically
const fetchUserData = withErrorHandling(
  async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },
  null // fallback value if error occurs
)

// Usage:
const userData = await fetchUserData(123) // Returns null if error

// ============================================
// 5️⃣ Forms with Error Handling
// ============================================

import { useErrorHandler } from "@/hooks/useErrorHandler"

function LoginForm() {
  const { handleApiError, handleValidationError } = useErrorHandler()
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const newErrors = {}
    if (!email) newErrors.email = "Email required"
    if (!password) newErrors.password = "Password required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      handleValidationError(newErrors)
      return
    }

    try {
      const result = await api.post("/login", { email, password })
      // Success!
    } catch (error) {
      // Error is automatically shown via handleApiError
      handleApiError(error, "Login")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} placeholder="Email" />
      {errors.email && <span>{errors.email}</span>}
      <input value={password} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password}</span>}
      <button type="submit">Login</button>
    </form>
  )
}

// ============================================
// 6️⃣ Displaying Lists Safely
// ============================================

import { safeGetArray, safeGet } from "@/lib/safeData"

function HerbsList({ herbs = [] }) {
  return (
    <ul>
      {/* Safe access even if herbs is undefined */}
      {herbs && herbs.map((herb, index) => (
        <li key={herb?.id || index}>
          <h3>{safeGet(herb, "name", "Unknown")}</h3>
          <p>{safeGet(herb, "description", "No description")}</p>
          <span>{safeFormat(safeGet(herb, "price"), "currency")}</span>
        </li>
      ))}
      {(!herbs || herbs.length === 0) && <li>No herbs found</li>}
    </ul>
  )
}

// ============================================
// 7️⃣ Query Operations with Error Handling
// ============================================

import { useQuery } from "@tanstack/react-query"

function MyData() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      try {
        return await api.get("/data")
      } catch (error) {
        // Error is already handled by interceptor
        throw error
      }
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // Use safeGet for nested data
  return <div>{safeGet(data, "user.name", "Unknown")}</div>
}

// ============================================
// 8️⃣ Global Error Logging
// ============================================

// To enable error logging, set this in your app:
window.__logError = (errorInfo) => {
  // Send to your error tracking service (Sentry, LogRocket, etc.)
  console.log("Logging error to service:", errorInfo)
}

// ============================================
// 9️⃣ Best Practices
// ============================================

/*
✅ DO:
- Use safeGet for accessing nested properties
- Use useErrorHandler in components that make API calls
- Validate data before using it
- Show user-friendly error messages
- Log errors in development
- Always provide fallback values

❌ DON'T:
- Access undefined properties directly (data.user.name)
- Ignore errors silently
- Show technical error messages to users
- Make assumptions about data structure
- Forget error boundaries
- Build without error handling in mind
*/

// ============================================
// 🔟 Common Error Scenarios
// ============================================

// Scenario 1: API call with proper error handling
const getProduct = async (id) => {
  try {
    const product = await api.get(`/products/${id}`)
    return product
  } catch (error) {
    handleApiError(error, "Loading Product")
    return null
  }
}

// Scenario 2: Nested data access
const getTherapistName = (therapist) => {
  return safeGet(therapist, "profile.name", "Unknown Therapist")
}

// Scenario 3: Array access
const getFirstReview = (product) => {
  return safeGetArray(product?.reviews, 0, { rating: 0, text: "No reviews" })
}

// Scenario 4: Conditional rendering with safe access
function ProfileCard({ user }) {
  if (!validateData(user, "object")) {
    return <div>Invalid user data</div>
  }

  return (
    <div>
      <h2>{safeGet(user, "name", "Anonymous")}</h2>
      <p>{safeGet(user, "email", "No email")}</p>
    </div>
  )
}

export default {} // This file is for documentation purposes
