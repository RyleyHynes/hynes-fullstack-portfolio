/**
 * External Imports
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
/** 
 * Internal Imports
 */
import App from './app/App'
/** 
 * Style Imports
 */
import './index.css'
import './styles/global.scss'

/**
 * Mounts the root React tree with strict mode and client-side routing configured.
 *
 * @remarks
 * The BrowserRouter uses the Vite-provided `BASE_URL` so the app can deploy to subpaths.
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
