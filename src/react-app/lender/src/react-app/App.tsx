import { Routes, Route } from "react-router";
import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Investment from "./pages/Investment";
import Profile from "./pages/Profile";
import DealFlow from "./pages/DealFlow";
import Cashflow from "./pages/Cashflow";
import Suppliers from "./pages/Suppliers";
import Payments from "./pages/Payments";
import AlertsManager from "./pages/AlertsManager";
import AutoLending from "./pages/AutoLending";
import RiskManagement from "./pages/RiskManagement";
import Analytics from "./pages/Analytics";
import OderTracking from "./pages/OderTracking";
import MobileTools from "./pages/MobileTools";
import LoanManagement from "./pages/LoanManagement";
import LoanDetails from "./pages/LoanDetails";
import Notifications from "./pages/Notifications";
import Home from "./pages/Home";

export default function LenderApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'dashboard':
        return <Dashboard />;
      case 'investments':
        return <Investment />;
      case 'deals':
        return <DealFlow />;
      case 'risk':
        return <RiskManagement />;
      case 'suppliers':
        return <Suppliers />;
      case 'cash-flow':
        return <Cashflow />;
      case 'orders':
        return <OderTracking />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <AlertsManager />;
      case 'automation':
        return <AutoLending />;
      case 'mobile':
        return <MobileTools />;
      case 'loans':
        return <LoanManagement />;
      case 'loan-details':
        return <LoanDetails />;
      case 'notifications':
        return <Notifications />;
      case 'payments':
        return <Payments />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <Routes>
        <Route path="/" element={renderContent()} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/investments" element={<Investment />} />
        <Route path="/deals" element={<DealFlow />} />
        <Route path="/risk" element={<RiskManagement />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/cash-flow" element={<Cashflow />} />
        <Route path="/orders" element={<OderTracking />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/alerts" element={<AlertsManager />} />
        <Route path="/automation" element={<AutoLending />} />
        <Route path="/mobile" element={<MobileTools />} />
        <Route path="/loans" element={<LoanManagement />} />
        <Route path="/loan-details" element={<LoanDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Profile />} />
      </Routes>
    </Layout>
  );
}
