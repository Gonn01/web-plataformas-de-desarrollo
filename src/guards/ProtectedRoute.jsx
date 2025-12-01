// src/guards/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null; // o spinner
    if (!user) return <Navigate to="/login" replace />;

    return children ?? <Outlet />;
}
