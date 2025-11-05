import { Navigate, Route, Routes } from 'react-router-dom';
import FinanceDashboard from './pages/FinancialDashboard';
import EntidadesFinancieras from './pages/EntidadesFinancieras';
import EntidadDetalle from './pages/EntidadDetalle';             

export default function App() {
  return (
    <Routes>
      {/* redirijo raíz a /login por ahora */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* OJO: acá hoy estás renderizando el Dashboard como si fuera el login */}
      <Route path="/login" element={<FinanceDashboard />} />

      {/* 👇 Rutas nuevas */}
      <Route path="/entidades" element={<EntidadesFinancieras />} />
      <Route path="/entidades/:id" element={<EntidadDetalle />} />

      {/* si alguien entra a cualquier otra ruta, vuelve al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
