import '@/styles/index.scss';
import ReactDOM from 'react-dom/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { BrowserRouter } from 'react-router-dom';
import 'tippy.js/dist/tippy.css';
import App from './App';
import {
   AuthProvider,
   ChatProvider,
   TabProvider,
   ToastProvider,
} from './contexts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <BrowserRouter>
      <AuthProvider>
         <ToastProvider>
            <ChatProvider>
               <TabProvider>
                  <App />
               </TabProvider>
            </ChatProvider>
         </ToastProvider>
      </AuthProvider>
   </BrowserRouter>
);
