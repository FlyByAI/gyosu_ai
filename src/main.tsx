import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import "./init"

import {
  BrowserRouter,
} from "react-router-dom"



import GyosuRoutes from './GyosuRoutes.tsx'
import { DarkModeProvider } from './contexts/useDarkMode.tsx'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <App>
          <GyosuRoutes />
        </App>
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)