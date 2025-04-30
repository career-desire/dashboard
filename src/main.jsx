import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { AlertProvider } from './context/AlertContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ResumeProvider } from './context/ResumeContext.jsx'
import Alert from './layout/Alert.jsx'
import { BrowserRouter } from 'react-router-dom'
import CoverLetterProvider from './context/CoverLetterContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <ResumeProvider>
            <CoverLetterProvider>
              <App />
              <Alert />
            </CoverLetterProvider>
          </ResumeProvider>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>,
)
