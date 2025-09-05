import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import KYCVerification from "./pages/KYCVerifiction";
import CreditRisk from "./pages/CreditRisk";
import Transactions from "./pages/Transactions";
import Retailer from "./pages/Retailer";
import Inventory from "./pages/Inventory";
import Security from "./pages/Security";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Home from "./pages/Home";

export default function AdminApp() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/kyc" element={<KYCVerification />} />
        <Route path="/credit" element={<CreditRisk />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/retailers" element={<Retailer />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/security" element={<Security />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
