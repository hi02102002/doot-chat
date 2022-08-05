import React from 'react';
import { IoClose } from 'react-icons/io5';

interface Props {
   title?: string;
   onClose: () => void;
}

const ModalHeader: React.FC<Props> = ({ onClose, title }) => {
   return (
      <div className="flex items-center justify-between p-4 border-b border-[#f6f6f9]">
         <h4 className="text-base font-semibold">{title || 'Modal'}</h4>
         <button onClick={onClose}>
            <IoClose className="w-5 h-5" />
         </button>
      </div>
   );
};

export default ModalHeader;
