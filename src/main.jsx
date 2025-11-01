import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.querySelector('#root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
);
