import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Loans from "./pages/Loans";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import FinancialHealth from "./pages/FinancialHealth";
import Notifications from "./pages/Notifications";
import Wishlist from "./pages/Wishlist";
import PaymentMethods from "./pages/PaymentMethods";
import BudgetPlanner from "./pages/BudgetPlanner";
import CustomerFeatures from "./pages/CustomerFeatures";
import Settings from "./pages/Settings";

export default function RetailerApp() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/financial-health" element={<FinancialHealth />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/payments" element={<PaymentMethods />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/budget" element={<BudgetPlanner />} />
        <Route path="/customer-features" element={<CustomerFeatures />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* Financial Tools Routes */}
        <Route path="/payment-schedule" element={<FinancialHealth />} />
        <Route path="/calculator" element={<FinancialHealth />} />
        <Route path="/goals" element={<FinancialHealth />} />
        <Route path="/spending" element={<FinancialHealth />} />
        
        {/* Customer Features Routes */}
        <Route path="/rewards" element={<Wishlist />} />
        <Route path="/referrals" element={<Wishlist />} />
        <Route path="/reviews" element={<Products />} />
        <Route path="/quick-apply" element={<Loans />} />
        <Route path="/compare" element={<Products />} />
        
        {/* Payment Gateway Routes */}
        <Route path="/payments/mpesa" element={<PaymentMethods />} />
        <Route path="/payments/absa" element={<PaymentMethods />} />
        <Route path="/payments/equity" element={<PaymentMethods />} />
        <Route path="/payments/kcb" element={<PaymentMethods />} />
        <Route path="/payments/wallet" element={<PaymentMethods />} />
        
        {/* Support Routes */}
        <Route path="/help" element={<Notifications />} />
        <Route path="/support" element={<Notifications />} />
        <Route path="/forum" element={<Notifications />} />
        <Route path="/education" element={<FinancialHealth />} />
        <Route path="/disputes" element={<Notifications />} />
        <Route path="/feedback" element={<Notifications />} />
      </Routes>
    </Layout>
  );
}
