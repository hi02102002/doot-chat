import { useBodyOverflow, useChat } from '@/hooks';
import Tippy from '@tippyjs/react';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Skeleton from 'react-loading-skeleton';
import Button from '../Button';
import Conversation from './Conversation';
import ModalCreateConversation from './ModalCreateConversation';

const Chat = () => {
   const chatCtx = useChat();
   const [isShowModalCreateConversation, setIsShowModalCreateConversation] =
      useState<boolean>(false);

   const handleOpenModal = () => {
      setIsShowModalCreateConversation(true);
   };

   const handleCloseModal = () => {
      setIsShowModalCreateConversation(false);
   };

   useBodyOverflow(isShowModalCreateConversation);

   return (
      <div>
         <div className="pt-4 px-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <h4 className="text-lg font-medium">Chats</h4>
               <Tippy content="Create conversation" placement="bottom">
                  <Button
                     typeBtn="sort-primary"
                     className="!w-8 !h-8 !p-0 !min-h-[unset]"
                     onClick={handleOpenModal}
                  >
                     <AiOutlinePlus className="w-4 h-4" />
                  </Button>
               </Tippy>
            </div>
            <input
               className="form-input"
               type="text"
               placeholder="Search here..."
            />
         </div>
         {chatCtx?.loading ? (
            <div className="py-4">
               <Skeleton className="h-[40px] !rounded-[0px]" count={4} />
            </div>
         ) : (
            <div>
               {(chatCtx?.conversations.length as number) > 0 ? (
                  <ul className="py-4">
                     {chatCtx?.conversations.map((conversation) => {
                        return (
                           <li key={conversation.id}>
                              <Conversation conversation={conversation} />
                           </li>
                        );
                     })}
                  </ul>
               ) : (
                  <div className="p-4 flex items-center justify-center flex-col gap-4">
                     <span className="block text-center ">
                        Don&apos;t have any conversation.
                     </span>
                     <Button
                        typeBtn="primary"
                        className="!min-h-[40px]"
                        onClick={handleOpenModal}
                     >
                        Create now
                     </Button>
                  </div>
               )}
            </div>
         )}

         <AnimatePresence>
            {isShowModalCreateConversation && (
               <ModalCreateConversation onClose={handleCloseModal} />
            )}
         </AnimatePresence>
      </div>
   );
};

export default Chat;
