import { useClickOutside } from '@/hooks';
import { motion } from 'framer-motion';
import React, { useCallback, useRef } from 'react';

interface Props {
   onClose?: () => void;
   children: React.ReactNode;
}

const ModalContent: React.FC<Props> = ({ onClose, children }) => {
   const modalContentRef = useRef<HTMLDivElement | null>(null);
   const handleClose = useCallback(
      (e: MouseEvent | TouchEvent) => {
         e.stopPropagation();
         onClose && onClose();
      },
      [onClose]
   );
   useClickOutside(modalContentRef, handleClose);
   return (
      <div className="h-full w-full max-w-[500px] mx-auto flex items-center justify-center px-4">
         <motion.div
            className="bg-white rounded-lg max-h-[calc(100vh_-_3.5rem)] w-full relative z-[1000]"
            ref={modalContentRef}
            initial={{
               y: -50,
               opacity: 0,
            }}
            animate={{
               y: 0,
               opacity: 1,
            }}
            exit={{
               y: -50,
               opacity: 0,
            }}
            transition={{
               duration: 0.15,
               ease: 'linear',
            }}
         >
            <div>{children}</div>
         </motion.div>
      </div>
   );
};

export default ModalContent;
