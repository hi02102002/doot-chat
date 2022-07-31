import { useToast } from '@/hooks';
import { IToast } from '@/types';
import classNames from 'classnames/bind';
import { IoMdClose } from 'react-icons/io';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

interface Props {
   toast: IToast;
}

const Toast: React.FC<Props> = ({ toast }) => {
   const toastCtx = useToast();

   const handleRemove = () => {
      toastCtx?.removeToast(toast.id);
   };

   return (
      <div className={cx('toast-item', toast.type)}>
         <div className="flex items-center justify-between">
            <span>{toast.content}</span>
            <button onClick={handleRemove}>
               <IoMdClose className="text-current w-5 h-5" />
            </button>
         </div>
      </div>
   );
};

export default Toast;
