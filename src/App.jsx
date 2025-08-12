import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardClient from './pages/DashboardClient';
import DashboardPro from './pages/DashboardPro';
import PublicBooking from './pages/PublicBooking';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/agendar" element={<PublicBooking />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute userType="cliente">
                  <DashboardClient />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard-pro"
              element={
                <PrivateRoute userType="profissional">
                  <DashboardPro />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/agendar" />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;