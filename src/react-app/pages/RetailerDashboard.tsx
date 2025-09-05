import { Routes, Route } from 'react-router';
import ProtectedRoute from '@/react-app/components/ProtectedRoute';
import RetailerApp from '@/react-app/retailer/src/react-app/app';

export default function RetailerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['retailer', 'customer']}>
      <Routes>
        <Route path="/*" element={<RetailerApp />} />
      </Routes>
    </ProtectedRoute>
  );
}
