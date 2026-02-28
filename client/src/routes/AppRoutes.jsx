import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../page/public/Home";
import Login from "../page/public/Login";
import Register from "../page/public/Register";
import Browse from "../page/public/Browse";
import Dashboard from "../page/private/seller/Dashboard";
import AddListing from "../page/private/seller/AddListing";
import MyListings from "../page/private/seller/MyListings";
import Orders from "../page/private/seller/Orders";
import Customers from "../page/private/seller/Customers";
import Profile from "../page/private/seller/Profile";
import RenterDashboard from "../page/private/renter/RenterDashboard";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/browse" element={<Browse />} />  {/* ← NEW */}

      {/* Seller Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }>
        <Route index element={<div>Welcome to Dashboard</div>} />
        <Route path="add-listing" element={<AddListing />} />
        <Route path="my-listings" element={<MyListings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Renter Protected Routes */}
      <Route path="/renter-dashboard" element={
        <ProtectedRoute>
          <RenterDashboard />
        </ProtectedRoute>
      }>
        <Route index element={null} />
        <Route path="browse" element={null} />
        <Route path="my-rentals" element={null} />
        <Route path="cart" element={null} />
        <Route path="history" element={null} />
        <Route path="settings" element={null} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}