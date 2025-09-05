import { Routes, Route } from 'react-router';
import ProtectedRoute from '@/react-app/components/ProtectedRoute';
import AdminApp from '@/react-app/admin/react-app/App';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Routes>
        <Route path="/*" element={<AdminApp />} />
      </Routes>
    </ProtectedRoute>
  );
}
