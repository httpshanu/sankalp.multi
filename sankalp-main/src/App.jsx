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
import SupervisorPatientDetail from './pages/supervisor/SupervisorPatientDetail';

// Nurse
import NurseDashboard from './pages/nurse/NurseDashboard';
import NurseRegistry from './pages/nurse/NurseRegistry';
import NewPatientNurse from './pages/nurse/NewPatientNurse';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AllPatients from './pages/admin/AllPatients';
import PatientDetailAdmin from './pages/admin/PatientDetailAdmin';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import Facilities from './pages/admin/Facilities';
import AuditLogsPage from './pages/admin/AuditLogs';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole) {
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!roles.includes(user.role)) {
      if (user.role === 'admin') return <Navigate to="/admin" replace />;
      if (user.role === 'nurse') return <Navigate to="/nurse" replace />;
      return <Navigate to="/supervisor" replace />;
    }
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to={
          user.role === 'admin' ? '/admin' : user.role === 'nurse' ? '/nurse' : '/supervisor'
        } replace /> : <LoginPage />
      } />

      {/* Supervisor */}
      <Route path="/supervisor" element={<ProtectedRoute allowedRole="supervisor"><SupervisorDashboard /></ProtectedRoute>} />
      <Route path="/supervisor/patients" element={<ProtectedRoute allowedRole="supervisor"><PatientRegistry /></ProtectedRoute>} />
      <Route path="/supervisor/patients/new" element={<ProtectedRoute allowedRole="supervisor"><NewPatient /></ProtectedRoute>} />
      <Route path="/supervisor/patients/:id" element={<ProtectedRoute allowedRole="supervisor"><SupervisorPatientDetail /></ProtectedRoute>} />
      <Route path="/supervisor/patients/:id/edit" element={<ProtectedRoute allowedRole="supervisor"><NewPatient /></ProtectedRoute>} />
      <Route path="/supervisor/reports" element={<ProtectedRoute allowedRole="supervisor"><Reports /></ProtectedRoute>} />
      <Route path="/supervisor/settings" element={<ProtectedRoute allowedRole="supervisor"><Settings /></ProtectedRoute>} />

      {/* Nurse */}
      <Route path="/nurse" element={<ProtectedRoute allowedRole="nurse"><NurseDashboard /></ProtectedRoute>} />
      <Route path="/nurse/patients" element={<ProtectedRoute allowedRole="nurse"><NurseRegistry /></ProtectedRoute>} />
      <Route path="/nurse/patients/new" element={<ProtectedRoute allowedRole="nurse"><NewPatientNurse /></ProtectedRoute>} />
      <Route path="/nurse/patients/:id" element={<ProtectedRoute allowedRole="nurse"><SupervisorPatientDetail /></ProtectedRoute>} />
      <Route path="/nurse/patients/:id/edit" element={<ProtectedRoute allowedRole="nurse"><NewPatientNurse /></ProtectedRoute>} />
      <Route path="/nurse/settings" element={<ProtectedRoute allowedRole="nurse"><Settings /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute allowedRole="admin"><AllPatients /></ProtectedRoute>} />
      <Route path="/admin/patients/:id" element={<ProtectedRoute allowedRole="admin"><PatientDetailAdmin /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRole="admin"><Reports /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><UserManagement /></ProtectedRoute>} />
      <Route path="/admin/facilities" element={<ProtectedRoute allowedRole="admin"><Facilities /></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute allowedRole="admin"><AuditLogsPage /></ProtectedRoute>} />
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
