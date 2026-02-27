import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getAllUsers = () => API.get("/auth/users");

// Seller - Listings
export const getListings = () => API.get("/seller/listings");
export const createListing = (data) => API.post("/seller/listings", data);
export const updateListing = (id, data) => API.put(`/seller/listings/${id}`, data);
export const toggleListing = (id) => API.patch(`/seller/listings/${id}/toggle`);
export const deleteListing = (id) => API.delete(`/seller/listings/${id}`);

// Seller - Orders
export const getOrders = (date) => API.get(`/seller/orders${date ? `?date=${date}` : ""}`);

// Seller - Customers
export const getCustomers = () => API.get("/seller/customers");

export default API;