import React from 'react';
import '@/styles/index.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider, ToastProvider } from './contexts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <BrowserRouter>
      <AuthProvider>
         <ToastProvider>
            <App />
         </ToastProvider>
      </AuthProvider>
   </BrowserRouter>
);
