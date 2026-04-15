import api from "./api"
import { MOCK_ENCYCLOPEDIA_PLANTS } from "./mockData"

// api.js interceptor already unwraps response.data
// Backend returns plain array for GET /plants

const normalizePlants = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  return []
}

const filterSeedPlants = (plants, params = {}) => {
  const search = String(params.search || "").toLowerCase()

  return plants.filter((plant) => {
    if (!search) return true

    return (
      plant.name.toLowerCase().includes(search) ||
      plant.scientificName.toLowerCase().includes(search) ||
      plant.localName.toLowerCase().includes(search) ||
      plant.shortSummary.toLowerCase().includes(search) ||
      plant.activeCompounds.toLowerCase().includes(search)
    )
  })
}

const mergeSeedPlants = (plants, params = {}) => {
  const seedPlants = filterSeedPlants(MOCK_ENCYCLOPEDIA_PLANTS, params)
  const existingIds = new Set(plants.map((plant) => plant.id))
  return [...seedPlants.filter((plant) => !existingIds.has(plant.id)), ...plants]
}

export const getPlants = async (params = {}) => {
  try {
    return mergeSeedPlants(normalizePlants(await api.get("/plants", { params })), params)
  } catch (error) {
    console.warn("⚠️ Using seeded encyclopedia plants (API failed)", error?.message)
    return mergeSeedPlants([], params)
  }
}

export const getPlant = async (id) => {
  const seedPlant = MOCK_ENCYCLOPEDIA_PLANTS.find((plant) => plant.id === id)
  if (seedPlant) return seedPlant

  return await api.get(`/plants/${id}`)
}

export const createPlant = async (data) => {
  const isFormData = data instanceof FormData;
  return await api.post("/plants", data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const updatePlant = async (id, data) => {
  const isFormData = data instanceof FormData;
  return await api.put(`/plants/${id}`, data, {
    headers: {
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    },
  })
}

export const deletePlant = async (id) => {
  return await api.delete(`/plants/${id}`)
}
