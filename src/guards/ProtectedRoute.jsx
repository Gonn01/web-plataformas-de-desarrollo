// src/guards/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../context/use-auth';

export default function ProtectedRoute({ children }) {
    const { usuario, cargando } = useAuth();

    if (cargando) return null; // o spinner
    if (!usuario) return <Navigate to="/login" replace />;

    return children ?? <Outlet />;
}
