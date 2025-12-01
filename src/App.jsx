// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login/Login';
import AppLayout from './layouts/AppLayout';
import EntidadesFinancieras from './pages/EntidadesFinancieras';
import EntidadDetalle from './pages/EntidadDetalle';
import ProtectedRoute from './guards/ProtectedRoute';
import CompraDetalle from './pages/CompraDetalle';
import Configuracion from './pages/Configuracion';
import Register from './pages/auth/Register/Register';
import Dashboard from './pages/dashboard/Dashboard';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
                path="/app/*"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="entidades" element={<EntidadesFinancieras />} />
                <Route path="entidades/:id" element={<EntidadDetalle />} />
                <Route path="deuda/:id" element={<CompraDetalle />} />
                <Route path="configuracion" element={<Configuracion />} />
            </Route>
        </Routes>
    );
}
