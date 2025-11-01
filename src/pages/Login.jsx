import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { autenticar } from "../services/auth";
import "../styles/auth.css";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const validar = () => {
    if (!email.includes("@")) return "Email inválido";
    if (clave.length < 6) return "La contraseña debe tener 6+ caracteres";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) return setError(msg);

    try {
      setCargando(true);
      setError("");
      const user = await autenticar(email, clave);
      login(user);
      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error de autenticación");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth__layout">
      <div className="auth__card">
        <div className="auth__brand">
          <div className="auth__logo">💼</div>
          <h1 className="auth__title">Mis Cuentas</h1>
          <p className="auth__subtitle">Controla tus finanzas personales.</p>
        </div>

        <h2 className="auth__welcome">Bienvenido de vuelta</h2>
        <p className="auth__hint">Inicia sesión en tu cuenta para continuar</p>

        <form onSubmit={onSubmit} className="auth__form">
          <label className="auth__label">Email</label>
          <div className="auth__input">
            <span>📧</span>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth__row">
            <label className="auth__label">Contraseña</label>
            <button type="button" className="auth__link" onClick={() => alert("Función pendiente 😉")}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="auth__input">
            <span>🔒</span>
            <input
              type={mostrar ? "text" : "password"}
              placeholder="Introduce tu contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth__eye"
              onClick={() => setMostrar(!mostrar)}
              aria-label="Mostrar u ocultar contraseña"
            >
              {mostrar ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <div className="auth__error">{error}</div>}

          <button className="auth__btn" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        <div className="auth__or">o continúa con</div>
        <button className="auth__btn--alt" onClick={() => alert("Google OAuth pendiente")}>
          Continuar con Google
        </button>

        <div className="auth__footer">
          ¿No tienes una cuenta? <a href="#" onClick={(e)=>e.preventDefault()}>Regístrate</a>
        </div>
      </div>
    </div>
  );
}
