import { useContext } from "react";
import { authContext } from "./AuthContext"; 

export function useAuth() {
  const ctx = useContext(authContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
