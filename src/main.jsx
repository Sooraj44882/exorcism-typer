import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/cinzel/600.css";
import "@fontsource/cinzel/800.css";
import "@fontsource/special-elite";
import "@fontsource/tiro-devanagari-sanskrit";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
