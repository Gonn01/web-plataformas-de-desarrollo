// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './layouts/AppLayout';
import FinanceDashboard from './pages/FinancialDashboard';
import EntidadesFinancieras from './pages/EntidadesFinancieras';
import EntidadDetalle from './pages/EntidadDetalle';
import ProtectedRoute from './guards/ProtectedRoute';
import CompraDetalle from './pages/CompraDetalle';
import Debo from './pages/Debo';
import Configuracion from './pages/Configuracion';
import MeDeben from './pages/MeDeben';

export default function App() {
    return (
        <Routes>
            {/* Redirect raíz → /login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Pública */}
            <Route path="/login" element={<Login />} />

            {/* Protegidas */}
            <Route
                path="/app/*"
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="entidades" element={<EntidadesFinancieras />} />
                <Route path="entidades/:id" element={<EntidadDetalle />} />
                <Route path="debo" element={<Debo />} />
                <Route path="medeben" element={<MeDeben />} />
                <Route path="deuda/:id" element={<CompraDetalle />} />
                <Route path="configuracion" element={<Configuracion />} />
            </Route>

            {/* Fallback */}
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
    );
}
