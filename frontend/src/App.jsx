import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Landing from './components/Landing';
import Profile from './components/Profile';
import DashboardHome from './components/DashboardHome';
import EnergyDashboard from './components/EnergyDashboard';
import DeviceManager from './components/DeviceManager';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Rooms from './components/Rooms';
import Automation from './components/Automation';
import Security from './components/Security';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import EnergyLogsView from './components/EnergyLogsView';
import TechnicianDashboard from './components/TechnicianDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<DashboardHome />} />
              <Route path="devices" element={<DeviceManager />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="energy-logs" element={<EnergyLogsView />} />
              <Route path="analytics" element={<EnergyDashboard />} />
              <Route path="automation" element={<Automation />} />
              <Route path="security" element={<Security />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/technician-hub" element={
              <ProtectedRoute>
                <TechnicianDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin-dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
