import { useChat } from '@/hooks';
import { chatServices } from '@/services';
import { IMessage } from '@/types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatView from './ChatView';
import Header from './Header';
import InputMessage from './InputMessage';
const Chat = () => {
   const chatCtx = useChat();
   const { id } = useParams();
   const [messageReply, setMessageReply] = useState<IMessage | null>(null);

   const handleSelectMessageReply = (message: IMessage | null) => {
      setMessageReply(message);
   };

   useEffect(() => {
      chatServices
         .getConversation(id as string)
         .then((conversation) => {
            chatCtx?.selectConversation?.(conversation);
         })
         .catch((error) => {
            console.log(error);
         });

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [id]);

   useEffect(() => {
      document.title = 'Doot Chat | Message';
   }, []);

   return (
      <div className=" bg-[#f2f2f2] flex-1 max-w-[calc(100vw_-_75px_-_300px)] h-screen">
         <div className="flex flex-col h-full relative">
            <Header />
            <ChatView onChooseMessage={handleSelectMessageReply} />
            <InputMessage
               messageReply={messageReply}
               onChooseMessage={handleSelectMessageReply}
            />
         </div>
      </div>
   );
};

export default React.memo(Chat);
