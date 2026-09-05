import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import './mobile.css'
import './responsive-redesign.css'
import './admin-redesign.css'
import './pages/Dictionnaire.css'
import './mia.css'
import './participation-admin.css'
import './admin-gate.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
