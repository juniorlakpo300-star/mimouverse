import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import './mobile.css'
import './responsive-redesign.css'
import './admin-redesign.css'
import './site-polish.css'
import './pages/Dictionnaire.css'
import './mia.css'
import './mia-redesign.css'
import './participation-admin.css'
import './participation-redesign.css'
import './publication-redesign.css'
import './admin-gate.css'
import './visual-overhaul.css'
import './book-reader.css'
import './admin-login-visual.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
