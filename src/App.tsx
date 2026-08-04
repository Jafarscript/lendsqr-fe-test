import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login/Login';
// import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import UserDetails from './pages/UserDetails/UserDetails';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Dashboard has no distinct design in the Figma export provided for
              this assessment (see README) — it currently renders a placeholder.
              It's still the default landing route so the sidebar link and any
              deep link work as expected. */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/dashboard/users" element={<Users />} />
          <Route path="/dashboard/users/:userId" element={<UserDetails />} />
        </Route>
      </Route>

      {/* Landing on Dashboard by default. */}
      <Route path="/" element={<Navigate to="/dashboard/users" replace />} />
      <Route path="*" element={<Navigate to="/dashboard/users" replace />} />
    </Routes>
  );
}
