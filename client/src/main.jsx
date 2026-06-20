import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import './i18n';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from "./AuthContext";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
       <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);