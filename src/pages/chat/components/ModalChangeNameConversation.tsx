import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/components';
import { db } from '@/firebase';
import { useAuth, useChat, useToast } from '@/hooks';
import { chatServices } from '@/services';
import { IConversation } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';

interface Props {
   onClose?: () => void;
}

const ModalChangeConversationName: React.FC<Props> = ({ onClose }) => {
   const chatCtx = useChat();
   const toastCtx = useToast();
   const authCtx = useAuth();
   const [conversationName, setConversationName] = useState<string>(
      (chatCtx?.currentConversation?.conversationName as string) || ''
   );
   const { id: conversationId } = useParams();
   const [loading, setLoading] = useState<boolean>(false);

   const handleChangeConversationName = useCallback(async () => {
      try {
         if (conversationName.trim().length === 0) return;
         setLoading(true);
         const conversationRef = doc(
            db,
            'conversations',
            conversationId as string
         );

         await updateDoc(conversationRef, {
            conversationName,
         });

         setLoading(false);
         chatCtx?.selectConversation?.({
            ...(chatCtx.currentConversation as IConversation),
            conversationName,
         });
         chatServices.addMessage(
            `${authCtx?.user?.displayName} has changed name conversation  to ${conversationName}`,
            null,
            authCtx?.user?.uid as string,
            conversationId as string,
            'SYSTEM'
         );
         setConversationName('');
         toastCtx?.addToast({
            content: 'Change name conversation successfully.',
            id: v4(),
            type: 'success',
         });
         onClose && onClose();
      } catch (error) {
         setLoading(false);
         console.log(error);
         toastCtx?.addToast({
            content: 'Something went wrong.',
            id: v4(),
            type: 'error',
         });
      }
   }, [conversationName, conversationId, toastCtx, chatCtx, onClose, authCtx]);

   return (
      <Modal onClose={onClose}>
         <ModalContent>
            <ModalHeader onClose={onClose} title="Change name conversation" />
            <div className="p-4">
               <div className="space-y-2">
                  <label className="form-label">Name conversation</label>
                  <input
                     type="text"
                     className="form-input"
                     placeholder="Name conversation"
                     onChange={(e) => {
                        setConversationName(e.target.value);
                     }}
                     value={conversationName}
                  />
               </div>
            </div>
            <ModalFooter
               onClose={onClose}
               textOk="Save change"
               propsButtonOk={{
                  disabled: conversationName.trim().length === 0 || loading,
                  isLoading: loading,
                  style: {
                     backgroundColor: 'var(--theme-conversation-hex)',
                     borderColor: 'var(--theme-conversation-hex)',
                  },
               }}
               propsButtonCancel={{
                  style: {
                     color: 'var(--theme-conversation-hex)',
                  },
               }}
               onOk={handleChangeConversationName}
            />
         </ModalContent>
      </Modal>
   );
};

export default ModalChangeConversationName;
