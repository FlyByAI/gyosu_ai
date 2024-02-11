import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "./init"

import {
  BrowserRouter,
} from "react-router-dom"



import GyosuRoutes from './GyosuRoutes.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <GyosuRoutes />
      </App>
    </BrowserRouter>
  </React.StrictMode>,
)