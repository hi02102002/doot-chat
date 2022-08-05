import { PropsButton } from '@/types';
import React from 'react';
import Button from '../Button';

interface Props {
   onClose?: () => void;
   onOk?: () => void;
   propsButtonOk?: PropsButton;
   propsButtonCancel?: PropsButton;
   textCancel?: string;
   textOk?: string;
}

const ModalFooter: React.FC<Props> = ({
   onClose,
   onOk,
   propsButtonCancel,
   propsButtonOk,
   textCancel = 'Cancel',
   textOk = 'Ok',
}) => {
   return (
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
            <Button typeBtn="primary" onClick={onOk} {...propsButtonOk}>
               {textOk}
            </Button>
         </div>
      </div>
   );
};

export default ModalFooter;
