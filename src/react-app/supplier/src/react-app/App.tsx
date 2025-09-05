import { Routes, Route } from "react-router";
import { Toaster } from 'react-hot-toast';
import LanguageProvider from "./components/LanguageProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ProductsEnhanced from "./pages/ProductsEnhanced";
import Oders from "./pages/Oders";
import Customer from "./pages/Customer";
import Deliveries from "./pages/Deliveries";
import Invoice from "./pages/Invoice";
import Analytics from "./pages/Analytics";
import Payment from "./pages/Payment";
import Inventory from "./pages/Inventory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Products from "./pages/Products";
import Home from "./pages/Home";

export default function SupplierApp() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsEnhanced />} />
          <Route path="products-simple" element={<Products />} />
          <Route path="orders" element={<Oders />} />
          <Route path="customers" element={<Customer />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="invoices" element={<Invoice />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="payments" element={<Payment />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </LanguageProvider>
  );
}
