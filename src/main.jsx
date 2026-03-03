import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './components/PasswordGate.css'
import App from './App.jsx'
import V1ShareApp from './versions/v1_share/V1ShareApp.jsx'
import PasswordGate from './components/PasswordGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/v1-share" element={<V1ShareApp />} />
        </Routes>
      </BrowserRouter>
    </PasswordGate>
  </StrictMode>,
)
