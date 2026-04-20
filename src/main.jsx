import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ShioriProvider } from './context/ShioriContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShioriProvider>
        <App />
      </ShioriProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
