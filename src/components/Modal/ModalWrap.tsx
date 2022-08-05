import { motion } from 'framer-motion';
import React from 'react';
import { createPortal } from 'react-dom';

const modalEl = document.querySelector('#modal') as HTMLDivElement;

interface Props {
   children: React.ReactNode;
}

const ModalWrap: React.FC<Props> = ({ children }) => {
   return createPortal(
      <motion.div
         className="fixed z-[999] w-full h-full overflow-x-hidden overflow-y-auto inset-0 bg-black/50"
         initial={{
            opacity: 0,
         }}
         animate={{
            opacity: 1,
         }}
         exit={{
            opacity: 0,
         }}
         transition={{
            duration: 0.15,
            ease: 'linear',
         }}
      >
         {children}
      </motion.div>,
      modalEl
   );
};

export default ModalWrap;
