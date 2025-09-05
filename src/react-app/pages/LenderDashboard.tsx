import { Routes, Route } from 'react-router';
import ProtectedRoute from '@/react-app/components/ProtectedRoute';
import LenderApp from '@/react-app/lender/src/react-app/App';

export default function LenderDashboard() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <Routes>
        <Route path="/*" element={<LenderApp />} />
      </Routes>
    </ProtectedRoute>
  );
}
