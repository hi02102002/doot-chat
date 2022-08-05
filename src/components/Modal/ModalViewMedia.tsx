import React from 'react';
import Modal from '.';

interface Props {
   type: 'VIDEO' | 'IMAGE';
   onClose: () => void;
}

const ModalViewMedia: React.FC<Props> = ({ onClose, type }) => {
   if (type === 'VIDEO') {
      return <div>Video</div>;
   }

   return <Modal>hi</Modal>;
};

export default ModalViewMedia;
