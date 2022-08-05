import { useEffect } from 'react';

export const useBodyOverflow = (isOpen: boolean) => {
   useEffect(() => {
      const body = document.querySelector('body') as HTMLBodyElement;

      if (isOpen) {
         body.classList.add('overflow-hidden');
      } else {
         body.classList.remove('overflow-hidden');
      }
   }, [isOpen]);
};
