import { useToast } from '@/hooks';
import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import Toast from './Toast';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

const toastContainerEl = document.querySelector(
   '#toast-container'
) as HTMLDivElement;

const ToastContainer = () => {
   const toastCtx = useToast();

   return createPortal(
      <div className={cx('toast-wrap')}>
         <ul className={cx('list')}>
            <AnimatePresence>
               {toastCtx?.toasts.map((toast) => (
                  <motion.li
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
                     key={toast.id}
                  >
                     <Toast toast={toast} />
                  </motion.li>
               ))}
            </AnimatePresence>
         </ul>
      </div>,
      toastContainerEl
   );
};

export default ToastContainer;
