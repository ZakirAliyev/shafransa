import api from "./api"

// api.js interceptor already unwraps response.data
// Backend returns plain array for GET /plants

const normalizePlants = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

export const getPlants = async (params = {}) => {
  try {
    return normalizePlants(await api.get("/plants", { params }))
  } catch (error) {
    console.warn("⚠️ Failed to fetch plants from API", error?.message)
    return []
  }
}

export const getPlantsPaginated = async (params = {}) => {
  try {
    // API response contains {data: [], pageNumber: X, totalPages: Y}
    return await api.get("/plants/paginated", { params })
  } catch (error) {
    console.warn("⚠️ Failed to fetch paginated plants from API", error?.message)
    return { data: [], totalPages: 1, pageNumber: 1 }
  }
}

export const getPlant = async (id) => {
  return await api.get(`/plants/${id}`)
}

export const createPlant = async (data) => {
  return await api.post("/plants", data)
}

export const updatePlant = async (id, data) => {
  return await api.put(`/plants/${id}`, data)
}

export const deletePlant = async (id) => {
  return await api.delete(`/plants/${id}`)
}
