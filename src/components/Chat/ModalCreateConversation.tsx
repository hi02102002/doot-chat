import { THEMES } from '@/constants';
import { db } from '@/firebase';
import { useAuth, useChat, useUsers } from '@/hooks';
import { chatServices } from '@/services';
import { IConversation, IUser } from '@/types';
import { doc, setDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import ChooseUser from '../ChooseUser';
import Modal, { ModalContent, ModalFooter, ModalHeader } from '../Modal';

interface Props {
   onClose: () => void;
}

const ModalCreateConversation: React.FC<Props> = ({ onClose }) => {
   const authCtx = useAuth();
   const [chooseUsers, setChooseUsers] = useState<Array<IUser>>([]);
   const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
   const navigate = useNavigate();
   const chatCtx = useChat();
   const { loading, users } = useUsers(authCtx?.user?.uid as string);

   const handleCreateConversation = useCallback(async () => {
      //here
      try {
         setLoadingCreate(true);
         const members = chooseUsers
            .map((user) => user.id)
            .concat(authCtx?.user?.uid as string);

         const conversationCreated = await chatServices.conversationIsCreated(
            members,
            authCtx?.user?.uid as string
         );

         if (conversationCreated) {
            setLoadingCreate(false);
            onClose();
            navigate(`/${conversationCreated.id}`);
            chatCtx?.selectConversation?.(conversationCreated);
         } else {
            const idConversation = uuid();
            const newConversation: IConversation = {
               createdAt: new Date().toISOString(),
               id: idConversation,
               lastMessage: null,
               members,
               type: members.length > 2 ? 'GROUP' : '1-1',
               conversationName: '',
               conversationAvatar: null,
               theme: THEMES[0],
               usersRemoveConversation: [],
            };
            await setDoc(
               doc(db, 'conversations', idConversation),
               newConversation
            );
            chatServices.addMessage(
               `${authCtx?.user?.displayName} has created conversation.`,
               null,
               authCtx?.user?.uid as string,
               idConversation as string,
               'SYSTEM'
            );
            setLoadingCreate(false);
            setChooseUsers([]);
            onClose();
            navigate(`/${idConversation}`);
            chatCtx?.selectConversation?.(newConversation);
         }
      } catch (error) {
         console.log(error);
      }
   }, [authCtx, chooseUsers, chatCtx, onClose, navigate]);

   return (
      <Modal>
         <ModalContent onClose={onClose}>
            <ModalHeader title="Create conversation" onClose={onClose} />
            <ChooseUser
               chooseUsers={chooseUsers}
               loading={loading}
               setChooseUsers={setChooseUsers}
               users={users}
               title={'Choose user to start conversation.'}
            />
            <ModalFooter
               onClose={onClose}
               onOk={handleCreateConversation}
               propsButtonOk={{
                  disabled: chooseUsers.length === 0 || loadingCreate,
                  isLoading: loadingCreate,
               }}
            />
         </ModalContent>
      </Modal>
   );
};

export default ModalCreateConversation;
