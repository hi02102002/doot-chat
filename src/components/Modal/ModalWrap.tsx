import { motion } from 'framer-motion';
import React from 'react';
import { createPortal } from 'react-dom';

const modalEl = document.querySelector('#modal') as HTMLDivElement;

interface Props {
   children: React.ReactNode;
   onClose?: () => void;
}

const ModalWrap: React.FC<Props> = ({ children, onClose }) => {
   return createPortal(
      <div className="fixed z-[999] w-full min-h-screen overflow-x-hidden overflow-y-auto inset-0 ">
         <motion.div
            className="bg-black/50 w-full min-h-screen  fixed inset-0"
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
            onClick={onClose}
         ></motion.div>
         {children}
      </div>,
      modalEl
   );
};

export default ModalWrap;
