import { useEffect, useState } from 'react';
export const useView = () => {
   const [size, setSize] = useState<{
      width: number;
      height: number;
   }>({
      width: window.innerWidth,
      height: window.innerHeight,
   });

   useEffect(() => {
      const handleResize = () => {
         setSize({
            width: window.innerWidth,
            height: window.innerHeight,
         });
      };

      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, []);

   return { ...size };
};
