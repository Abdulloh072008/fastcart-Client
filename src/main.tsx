import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { store } from '@/app/store'
import { ThemeProvider } from '@/providers/ThemeProvider'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
          <ToastContainer position="bottom-right" newestOnTop />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
