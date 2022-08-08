import { useEffect, useState } from 'react';
export const useDebounce = <T = unknown>(value: T, delay = 800) => {
   const [debounce, setDebounce] = useState<T>(value);

   useEffect(() => {
      setTimeout(() => {
         setDebounce(value);
      }, delay);
   }, [value, delay]);
   return debounce;
};
