import { createContext, useState, useEffect } from "react";

// Context en minúsculas para que Fast Refresh no lo confunda con componente
export const authContext = createContext(null);

// Export default del Provider
export default function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const guardado = localStorage.getItem("auth_usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
    setCargando(false);
  }, []);

  const login = ({ email }) => {
    const data = { email };
    setUsuario(data);
    localStorage.setItem("auth_usuario", JSON.stringify(data));
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("auth_usuario");
  };

  return (
    <authContext.Provider value={{ usuario, cargando, login, logout }}>
      {children}
    </authContext.Provider>
  );
}
