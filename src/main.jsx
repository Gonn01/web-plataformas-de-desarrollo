import { createRoot } from 'react-dom/client';
import './index.css';
import AuthProvider from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import React from 'react';

createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
