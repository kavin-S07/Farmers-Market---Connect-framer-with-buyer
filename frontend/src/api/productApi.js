// src/api/productApi.js - CLEANED UP VERSION
import axios from './axiosConfig';

export const productApi = {
  // Public endpoints
  getAllProducts: (params) => axios.get('/products', { params }),
  getProductById: (id) => axios.get(`/products/${id}`),
  getProductsByFarmer: (farmerId) => axios.get(`/products/farmer/${farmerId}`),

  // Farmer endpoints
  createProduct: (data) => axios.post('/farmer/products', data),
  getMyProducts: () => axios.get('/farmer/products'),
  getFarmerProduct: (id) => axios.get(`/farmer/products/${id}`),
  updateProduct: (id, data) => axios.put(`/farmer/products/${id}`, data),
  deleteProduct: (id) => axios.delete(`/farmer/products/${id}`),
  
  // ✅ Image upload (if you implement it later)
  uploadProductImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`/farmer/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // ✅ REMOVED: toggleProductStatus - Not implemented in backend
  // If you need this feature, add it to the backend first:
  // @PatchMapping("/products/{id}/toggle")
  // public ResponseEntity<ProductResponse> toggleProductStatus(...)
};