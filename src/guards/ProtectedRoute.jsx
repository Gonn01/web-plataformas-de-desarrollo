import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute() {
  const { usuario, cargando } = useAuth();
  if (cargando) return null; // Podés poner un spinner si querés
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}
