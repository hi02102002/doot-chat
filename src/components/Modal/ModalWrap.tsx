import { useClickOutside } from '@/hooks';
import { PropsButton } from '@/types';
import { motion } from 'framer-motion';
import React, { useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import Button from '../Button';

const modalEl = document.querySelector('#modal') as HTMLDivElement;

interface Props {
   onClose?: () => void;
   onOk?: () => void;
   customHeader?: React.ReactNode;
   customFooter?: React.ReactNode;
   title?: string;
   children: React.ReactNode;
   textCancel?: string;
   textOk?: string;
   propsButtonOk?: PropsButton;
   propsButtonCancel?: PropsButton;
}

const ModalWrap: React.FC<Props> = ({
   customFooter,
   customHeader,
   onClose,
   onOk,
   title,
   children,
   textCancel = 'Cancel',
   textOk = 'Ok',
   propsButtonOk,
   propsButtonCancel,
}) => {
   const modalContentRef = useRef<HTMLDivElement | null>(null);
   const handleClose = useCallback(
      (e: MouseEvent | TouchEvent) => {
         e.stopPropagation();
         onClose && onClose();
      },
      [onClose]
   );

   useClickOutside(modalContentRef, handleClose);

   return createPortal(
      <motion.div
         className="fixed z-40 w-full h-full overflow-x-hidden overflow-y-auto inset-0 bg-black/50"
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
         <div className="h-full w-full max-w-[500px] mx-auto flex items-center justify-center ">
            <motion.div
               className="bg-white rounded-lg max-h-[calc(100vh_-_3.5rem)] w-full relative z-50"
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
               {customHeader || (
                  <div className="flex items-center justify-between p-4 border-b border-[#f6f6f9]">
                     <h4 className="text-base font-semibold">
                        {title || 'Modal'}
                     </h4>
                     <button onClick={onClose}>
                        <IoClose className="w-5 h-5" />
                     </button>
                  </div>
               )}
               <div>{children}</div>
               {customFooter || (
                  <div className="border-t border-[#f6f6f9] p-4">
                     <div className="flex items-center justify-end gap-4">
                        <Button
                           typeBtn="sort-primary"
                           className="!bg-white hover:!text-primary !border-white hover:underline"
                           onClick={onClose}
                           {...propsButtonCancel}
                        >
                           {textCancel}
                        </Button>
                        <Button
                           typeBtn="primary"
                           onClick={onOk}
                           {...propsButtonOk}
                        >
                           {textOk}
                        </Button>
                     </div>
                  </div>
               )}
            </motion.div>
         </div>
      </motion.div>,
      modalEl
   );
};

export default ModalWrap;
