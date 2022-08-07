import { useChat, useConversation } from '@/hooks';
import { IMessage } from '@/types';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatView from './components/ChatView';
import Header from './components/Header';
import InputMessage from './components/InputMessage';
const Chat = () => {
   const chatCtx = useChat();
   const { id } = useParams();
   const [messageReply, setMessageReply] = useState<IMessage | null>(null);

   const handleSelectMessageReply = (message: IMessage | null) => {
      setMessageReply(message);
   };

   useConversation(id as string);

   useEffect(() => {
      document.title = 'Doot Chat | Message';
   }, []);

   return (
      <div
         className=" bg-[#f2f2f2] flex-1 max-w-[calc(100vw_-_75px_-_300px)] h-screen"
         style={
            {
               '--theme-conversation-hex': `${chatCtx?.currentConversation?.theme.colorHex}`,
               '--theme-conversation-rgb': `${chatCtx?.currentConversation?.theme.colorRgb}`,
            } as React.CSSProperties
         }
      >
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
