import {
   ChooseUsers,
   Modal,
   ModalContent,
   ModalFooter,
   ModalHeader,
} from '@/components';
import { db } from '@/firebase';
import { useAuth, useChat } from '@/hooks';
import { chatServices } from '@/services';
import { IUser } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
   onClose: () => void;
}

const ModalAddMembers: React.FC<Props> = ({ onClose }) => {
   const authCtx = useAuth();
   const [chooseUsers, setChooseUsers] = useState<Array<IUser>>([]);
   const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
   const chatCtx = useChat();
   const [users, setUsers] = useState<Array<IUser>>([]);
   const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
   const { id: conversationId } = useParams();

   const handleAddMembers = useCallback(async () => {
      try {
         setLoadingAdd(true);
         const idsUsersChoose = chooseUsers.map((user) => user.id);
         const conversationRef = doc(
            db,
            'conversations',
            conversationId as string
         );
         await updateDoc(conversationRef, {
            members: [
               ...(chatCtx?.currentConversation?.members as Array<string>),
               ...idsUsersChoose,
            ],
         });
         chatServices.addMessage(
            `${authCtx?.user?.displayName} has added new ${
               idsUsersChoose.length > 1 ? 'members' : 'member'
            }.`,
            null,
            authCtx?.user?.uid as string,
            conversationId as string,
            'SYSTEM'
         );
         setLoadingAdd(false);
         onClose();
      } catch (error) {
         console.log(error);
         setLoadingAdd(false);
      }
   }, [chatCtx, chooseUsers, conversationId, onClose, authCtx]);

   useEffect(() => {
      setLoadingUsers(true);
      chatServices
         .getUserNotInMembersConversation(
            chatCtx?.currentConversation?.members as Array<string>,
            authCtx?.user?.uid as string
         )
         .then((_users) => {
            setUsers(_users);
            setLoadingUsers(false);
         })
         .catch((error) => {
            console.log(error);
            setLoadingUsers(false);
         });
   }, [chatCtx?.currentConversation?.members, authCtx?.user?.uid]);

   return (
      <Modal>
         <ModalContent onClose={onClose}>
            <ModalHeader title="Add members" onClose={onClose} />
            <ChooseUsers
               chooseUsers={chooseUsers}
               loading={loadingUsers}
               setChooseUsers={setChooseUsers}
               users={users}
               title={'Choose user to add new member.'}
            />
            <ModalFooter
               onClose={onClose}
               onOk={handleAddMembers}
               propsButtonOk={{
                  disabled: chooseUsers.length === 0 || loadingAdd,
                  isLoading: loadingAdd,
               }}
            />
         </ModalContent>
      </Modal>
   );
};

export default ModalAddMembers;
