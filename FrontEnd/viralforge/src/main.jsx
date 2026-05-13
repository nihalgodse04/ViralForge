import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '47331291542-le7dut2afcfasmsgjqj04obd6qnjeuu6.apps.googleusercontent.com'}>
    <App />
  </GoogleOAuthProvider>
)




