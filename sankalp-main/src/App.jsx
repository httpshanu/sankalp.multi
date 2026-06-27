import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { LanguageProvider } from './context/LanguageContext';
import Settings from './pages/shared/Settings';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Supervisor
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import NewPatient from './pages/supervisor/NewPatient';
import PatientRegistry from './pages/supervisor/PatientRegistry';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AllPatients from './pages/admin/AllPatients';
import PatientDetailAdmin from './pages/admin/PatientDetailAdmin';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import Facilities from './pages/admin/Facilities';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/supervisor'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={user.role === 'admin' ? '/admin' : '/supervisor'} replace /> : <LoginPage />
      } />

      {/* Supervisor */}
      <Route path="/supervisor" element={<ProtectedRoute allowedRole="supervisor"><SupervisorDashboard /></ProtectedRoute>} />
      <Route path="/supervisor/patients" element={<ProtectedRoute allowedRole="supervisor"><PatientRegistry /></ProtectedRoute>} />
      <Route path="/supervisor/patients/new" element={<ProtectedRoute allowedRole="supervisor"><NewPatient /></ProtectedRoute>} />
      <Route path="/supervisor/patients/:id" element={<ProtectedRoute allowedRole="supervisor"><NewPatient /></ProtectedRoute>} />
      <Route path="/supervisor/reports" element={<ProtectedRoute allowedRole="supervisor"><Reports /></ProtectedRoute>} />
      <Route path="/supervisor/settings" element={<ProtectedRoute allowedRole="supervisor"><Settings /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><AllPatients /></ProtectedRoute>} />
      <Route path="/admin/patients/:id" element={<ProtectedRoute allowedRole="admin"><PatientDetailAdmin /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/facilities" element={<ProtectedRoute allowedRole="admin"><Facilities /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRole="admin"><Settings /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
