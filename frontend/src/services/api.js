import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const productService = {
  // Get all products with optional pagination and filtering
  getProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get a single product by ID
  getProduct: async (id) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error)
      throw error
    }
  },

  // Create a new product
  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData)
      return response.data
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }
}

export const departmentService = {
  // Get all departments
  getDepartments: async (includeProducts = false) => {
    try {
      const params = includeProducts ? { include_products: 'true' } : {}
      const response = await api.get('/departments', { params })
      return response.data
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Get department by ID
  getDepartment: async (id, includeProducts = false) => {
    try {
      const params = includeProducts ? { include_products: 'true' } : {}
      const response = await api.get(`/departments/${id}`, { params })
      return response.data
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error)
      throw error
    }
  },

  // Create new department
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData)
      return response.data
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  },

  // Update department
  updateDepartment: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData)
      return response.data
    } catch (error) {
      console.error(`Error updating department ${id}:`, error)
      throw error
    }
  },

  // Delete department
  deleteDepartment: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error)
      throw error
    }
  }
}

export default api 
