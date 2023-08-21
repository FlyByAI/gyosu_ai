import "./init"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import 'react-quill/dist/quill.snow.css';

import {
  BrowserRouter,
} from "react-router-dom";



import ClerkProviderWithRoutes from './ClerkProviderWithRoutes.tsx';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <ClerkProviderWithRoutes />
      </App>
    </BrowserRouter>
  </React.StrictMode>,
)