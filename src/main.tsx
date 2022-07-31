import '@/styles/index.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <BrowserRouter>
      <AuthProvider>
         <App />
      </AuthProvider>
   </BrowserRouter>
);
