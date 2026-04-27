import api from "./api"
import { MOCK_MARKET_PRODUCTS } from "./mockData"

// api.js interceptor already unwraps response.data — do NOT double-unwrap

const normalizeProductsResponse = (response) => {
  if (Array.isArray(response)) {
    return {
      data: response,
      pagination: { total: response.length, pages: 1 },
    }
  }

  return {
    ...response,
    data: Array.isArray(response?.data) ? response.data : [],
    pagination: response?.pagination || {},
  }
}

const filterSeedProducts = (products, params = {}) => {
  const search = String(params.search || "").toLowerCase()
  const form = String(params.form || "").toLowerCase()
  const category = String(params.category || "").toLowerCase()
  const minPrice = params.minPrice ? Number(params.minPrice) : null
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null

  return products.filter((product) => {
    const matchesSearch =
      !search ||
      product.title.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.scientificName.toLowerCase().includes(search)

    const matchesForm = !form || product.form.toLowerCase() === form
    const matchesCategory = !category || product.category?.slug?.toLowerCase() === category
    const matchesMin = minPrice === null || Number(product.price) >= minPrice
    const matchesMax = maxPrice === null || Number(product.price) <= maxPrice

    return matchesSearch && matchesForm && matchesCategory && matchesMin && matchesMax
  })
}

const mergeSeedProducts = (products, params = {}) => {
  const seedProducts = filterSeedProducts(MOCK_MARKET_PRODUCTS, params)
  const existingIds = new Set(products.map((product) => product.id))
  return [...seedProducts.filter((product) => !existingIds.has(product.id)), ...products]
}

export const getProducts = async (params = {}) => {
  try {
    const response = normalizeProductsResponse(await api.get("/products", { params }))
    const merged = mergeSeedProducts(response.data, params)

    return {
      ...response,
      data: merged,
      pagination: {
        ...response.pagination,
        total: response.pagination?.total ? response.pagination.total + merged.length - response.data.length : merged.length,
        pages: response.pagination?.pages || 1,
      },
    }
  } catch (error) {
    console.warn("⚠️ Using seeded marketplace products (API failed)", error?.message)
    const data = mergeSeedProducts([], params)
    return {
      data,
      pagination: { total: data.length, pages: 1 },
    }
  }
}

export const getProductById = async (id) => {
  const seedProduct = MOCK_MARKET_PRODUCTS.find((product) => product.id === id)
  if (seedProduct) return seedProduct

  return await api.get(`/products/${id}`)
}

export const getMyProducts = async () => {
  // Backend has no /my endpoint — returns all products via /products
  return await api.get("/products")
}

export const getSellerProducts = async () => {
  // Backend has no /products/seller/{id} endpoint.
  // Fetch all products with a high limit and filter client-side by sellerId.
  return await api.get("/products", { params: { limit: 200 } })
}

export const createProduct = async (data) => {
  return await api.post("/products", data)
}

export const updateProduct = async (id, data) => {
  return await api.put(`/products/${id}`, data)
}

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`)
}
