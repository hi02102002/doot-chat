import { db } from '@/firebase';
import { useAllUser, useAuth, useChat } from '@/hooks';
import { chatServices } from '@/services';
import { IConversation, IUser } from '@/types';
import { doc, setDoc } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Avatar from '../Avatar';
import Modal, { ModalContent, ModalFooter, ModalHeader } from '../Modal';
import Spiner from '../Spiner';

interface Props {
   onClose: () => void;
}

const ModalCreateConversation: React.FC<Props> = ({ onClose }) => {
   const authCtx = useAuth();
   const { loading, users } = useAllUser(authCtx?.user?.uid as string);
   const [chooseUsers, setChooseUsers] = useState<Array<IUser>>([]);
   const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
   const navigate = useNavigate();
   const chatCtx = useChat();

   const isChecked = useCallback(
      (userId: string) => {
         return chooseUsers.some((user) => user.id === userId);
      },
      [chooseUsers]
   );

   const handleRemove = useCallback(
      (userId: string) => {
         setChooseUsers(chooseUsers.filter((_user) => _user.id !== userId));
      },
      [chooseUsers]
   );

   const handleChoose = useCallback(
      (user: IUser) => {
         if (isChecked(user.id)) {
            handleRemove(user.id);
         } else {
            setChooseUsers(chooseUsers.concat(user));
         }
      },
      [isChecked, chooseUsers, handleRemove]
   );

   const handleCreateConversation = async () => {
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
               conversationAvatar: '',
            };

            await setDoc(
               doc(db, 'conversations', idConversation),
               newConversation
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
   };

   return (
      <Modal>
         <ModalContent onClose={onClose}>
            <ModalHeader title="Create conversation" onClose={onClose} />
            <div className="p-4 flex items-start gap-2">
               <span className="font-semibold">To: </span>
               {chooseUsers.length > 0 ? (
                  <ul className="flex gap-2 flex-wrap max-h-[108px] overflow-y-auto">
                     {chooseUsers.map((user) => (
                        <li key={user.id}>
                           <div className="flex items-center gap-2 bg-primary rounded text-white p-1">
                              <span>{user.username}</span>
                              <button
                                 onClick={() => {
                                    handleRemove(user.id);
                                 }}
                              >
                                 <IoClose className="w-4 h-4" />
                              </button>
                           </div>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <span>Choose user to start conversation.</span>
               )}
            </div>
            <div className="py-4 flex flex-col gap-4">
               <h5 className="px-4 font-semibold ">Suggested</h5>
               <ul className="max-h-[183px] min-h-[183px] overflow-y-auto flex flex-col">
                  {loading ? (
                     <div className="h-full flex-1 flex items-center justify-center">
                        <Spiner className="text-primary w-6 h-6" />
                     </div>
                  ) : (
                     users.map((user) => (
                        <li key={user.id}>
                           <div
                              className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-bs-gray-400 transition-all select-none"
                              onClick={() => {
                                 handleChoose(user);
                              }}
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar
                                    src={user.avatar}
                                    style={{
                                       width: 44,
                                       height: 44,
                                    }}
                                 />
                                 <div>
                                    <h4>{user.username}</h4>
                                    <span>{user.email}</span>
                                 </div>
                              </div>
                              <button>
                                 {isChecked(user.id) ? (
                                    <svg
                                       aria-label="Toggle selection"
                                       height="24"
                                       role="img"
                                       viewBox="0 0 24 24"
                                       width="24"
                                       className="text-primary fill-primary"
                                    >
                                       <path d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm5.706 9.21l-6.5 6.495a1 1 0 01-1.414-.001l-3.5-3.503a1 1 0 111.414-1.414l2.794 2.796L16.293 8.3a1 1 0 011.414 1.415z"></path>
                                    </svg>
                                 ) : (
                                    <svg
                                       aria-label="Toggle selection"
                                       height="24"
                                       role="img"
                                       viewBox="0 0 24 24"
                                       width="24"
                                       className="fill-bs-gray-500 text-bs-gray-500"
                                    >
                                       <circle
                                          cx="12.008"
                                          cy="12"
                                          fill="none"
                                          r="11.25"
                                          stroke="currentColor"
                                          strokeLinejoin="round"
                                          strokeWidth="1.5"
                                       ></circle>
                                    </svg>
                                 )}
                              </button>
                           </div>
                        </li>
                     ))
                  )}
               </ul>
            </div>
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
