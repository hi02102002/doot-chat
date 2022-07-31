import { IToast, IToastContext } from '@/types';
import React, { createContext, useEffect, useState } from 'react';

export const ToastContext = createContext<IToastContext | null>(null);

interface Props {
   children: React.ReactNode;
}

export const ToastProvider: React.FC<Props> = ({ children }) => {
   const [toasts, setToasts] = useState<Array<IToast>>([]);

   const addToast = (toast: IToast) => {
      setToasts(toasts.concat(toast));
   };

   const removeToast = (toastId: string) => {
      setToasts((toasts) => {
         return toasts.filter((toast) => toast.id !== toastId);
      });
   };

   useEffect(() => {
      let timer: NodeJS.Timer;
      if (toasts.length > 0) {
         timer = setTimeout(() => {
            removeToast(toasts[0].id);
         }, 2000);
      }
      return () => {
         timer && clearTimeout(timer);
      };
   }, [toasts]);

   return (
      <ToastContext.Provider
         value={{
            toasts,
            removeToast,
            addToast,
         }}
      >
         {children}
      </ToastContext.Provider>
   );
};
