// src/App.jsx
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import EntidadesFinancieras from './pages/EntidadesFinancieras';
import EntidadDetalle from './pages/EntidadDetalle';
import FinanceDashboard from './pages/FinancialDashboard';

export default function App() {
    return (
        <Routes>
            {/* Ruta pública (si querés usar un login real) */}
            {/* <Route path="/login" element={<Login />} />s */}

            {/* Todo lo que va con Sidebar fijo */}
            <Route path="/" element={<AppLayout />}>
                {/* Redirigí raíz a /dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />

                <Route path="dashboard" element={<FinanceDashboard />} />
                <Route path="entidades" element={<EntidadesFinancieras />} />
                <Route path="entidades/:id" element={<EntidadDetalle />} />

                {/* 404 → dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}
