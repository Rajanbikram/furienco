import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import React, { Suspense } from "react";

const LoginPage = React.lazy(() => import("./page/public/Login"));
const RegisterPage = React.lazy(() => import("./page/public/Register"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Default - Sabai URL login ma redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;