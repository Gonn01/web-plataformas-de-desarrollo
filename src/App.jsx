import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      {/* redirijo raíz a /login por ahora */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* si alguien entra a cualquier otra ruta, vuelve al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
