import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import { Toaster } from "sonner";
import HomePage from "@/react-app/pages/Home";
import LoginPage from "@/react-app/pages/Login";
import RegisterPage from "@/react-app/pages/Register";
import RoleBasedLogin from "@/react-app/pages/RoleBasedLogin";
import RoleBasedRegister from "@/react-app/pages/RoleBasedRegister";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import DashboardPage from "@/react-app/pages/Dashboard";
import AdminDashboard from "@/react-app/pages/AdminDashboard";
import LenderDashboard from "@/react-app/pages/LenderDashboard";
import SupplierDashboard from "@/react-app/pages/SupplierDashboard";
import RetailerDashboard from "@/react-app/pages/RetailerDashboard";
import RetailerLandingPage from "@/react-app/pages/RetailerLanding";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<RoleBasedLogin />} />
          <Route path="/register" element={<RoleBasedRegister />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Legacy auth pages */}
          <Route path="/login-simple" element={<LoginPage />} />
          <Route path="/register-simple" element={<RegisterPage />} />
          
          {/* Role-based Dashboard Routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/lender/*" element={<LenderDashboard />} />
          <Route path="/supplier/*" element={<SupplierDashboard />} />
          <Route path="/retailer/*" element={<RetailerDashboard />} />
          
          {/* Landing Pages */}
          <Route path="/retailer-landing" element={<RetailerLandingPage />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}
