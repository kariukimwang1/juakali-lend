import { Routes, Route } from 'react-router';
import ProtectedRoute from '@/react-app/components/ProtectedRoute';
import SupplierApp from '@/react-app/supplier/src/react-app/App';

export default function SupplierDashboard() {
  return (
    <ProtectedRoute allowedRoles={['supplier']}>
      <Routes>
        <Route path="/*" element={<SupplierApp />} />
      </Routes>
    </ProtectedRoute>
  );
}
