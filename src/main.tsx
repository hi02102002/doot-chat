import '@/styles/index.scss';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider, TabProvider, ToastProvider } from './contexts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <BrowserRouter>
      <AuthProvider>
         <ToastProvider>
            <TabProvider>
               <App />
            </TabProvider>
         </ToastProvider>
      </AuthProvider>
   </BrowserRouter>
);
