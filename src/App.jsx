// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login/Login';
import AppLayout from './layouts/AppLayout';
import EntidadesFinancieras from './pages/entidades_financieras/EntidadesFinancieras';
import EntidadDetalle from './pages/detalle_entidad/DetalleEntidad';
import ProtectedRoute from './guards/ProtectedRoute';
import DetalleGasto from './pages/detalle_compra/DetalleGasto';
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
                <Route path="gastos/:id" element={<DetalleGasto />} />
                <Route path="configuracion" element={<Configuracion />} />
            </Route>
        </Routes>
    );
}
