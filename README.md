# Plataforma de Gestión de Deudas

Este proyecto es una aplicación web desarrollada con React (Vite) para la materia Plataformas de Desarrollo
La app permite gestionar deudas personales, registrar gastos, administrar cuotas y visualizar tanto lo que debo como lo que me deben.
El sistema funciona 100% en frontend, utilizando localStorage para almacenar información como deudas, cuotas pagadas y detalles de cada gasto.

✔️ 1. Dashboard

Resumen general de gastos.

Acceso rápido al modal para crear un nuevo gasto o deuda.

Visualización de las tarjetas estadísticas del mes.

✔️ 2. Crear gasto / deuda (modal)

Desde el botón del Dashboard podés:

Cargar un título, monto, moneda, tipo (Debo / Me deben) y entidad.

La información se guarda en localStorage.

La deuda se refleja inmediatamente en las secciones correspondientes.

✔️ 3. Sección Debo

Lista todas las deudas que el usuario debe pagar.

Se combinan datos mock + lo que el usuario crea.

Cada item muestra:

Título

Monto formateado

Moneda

Botón "Ver detalle" para abrir la vista completa.

✔️ 4. Sección Me deben

Lista las deudas donde otra persona le debe al usuario.

Cada item muestra:

Título

Monto formateado en verde

Moneda

Botón "Ver detalle".

✔️ 5. Detalle de deuda (CompraDetalle)

Muestra información completa:

Título

Estado

Entidad

Tipo (Debo / Me deben)

Moneda

Monto total

Progreso del pago

Generación automática de cuotas según el monto total y cantidad de cuotas.

✔️ Acciones desde esta vista:

Marcar la próxima cuota como pagada

Ver progreso en tiempo real

Editar la deuda:

Cambiar título

Entidad

Monto total

Moneda

Cantidad de cuotas

Eliminar deuda desde “Zona de Peligro”

✔️ Mensajes diferenciados según el tipo:

Si era Debo →
"¡Felicitaciones! Ya terminaste de pagar 'Título'."

Si era Me deben →
"¡Genial! Registraste que ya te pagaron 'Título'."


✔️ 6. Persistencia en localStorage

Todas las deudas y gastos

Se actualizan automáticamente con:

agregarDeuda

actualizarDeuda

eliminarDeuda

obtenerDeudas

obtenerDeudaPorId

🔧 Tecnologías usadas

React + Vite

React Router

Tailwind / clases utilitarias

localStorage

JavaScript moderno (ES6+)

git clone <URL_DEL_REPO>
cd web-plataformas-de-desarrollo
npm install
npm run dev

👥 Autores

Gonzalo Rigoni
Agustin Masa
Romina Herrera
























# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
