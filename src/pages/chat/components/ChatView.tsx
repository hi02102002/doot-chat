import { Spiner } from '@/components';
import { useMessages } from '@/hooks';
import { IMessage } from '@/types';
import React, { useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import Message from './Message';

interface Props {
   onChooseMessage: (message: IMessage) => void;
}

const ChatView: React.FC<Props> = ({ onChooseMessage }) => {
   const { id } = useParams();
   const { messages, handleMore, hasMore, loading } = useMessages(id as string);
   const scrollHere = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      const el = document.querySelector('.chat-feed');

      if (el) {
         el.scrollTop = el.scrollHeight;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [messages.slice(0, 1)?.[0]?.id || '']);

   return loading ? (
      <div className="!h-[calc(100vh_-_150px)] flex items-center justify-center">
         <Spiner
            className="h-8 w-8 "
            style={{
               color: 'var(--theme-conversation-hex)',
            }}
         />
      </div>
   ) : messages.length === 0 ? (
      <div className="!h-[calc(100vh_-_150px)] flex items-center justify-center">
         No message recent.
      </div>
   ) : (
      <div
         className="!h-[calc(100vh_-_150px)] chat-feed pt-4 px-4"
         style={{
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column-reverse',
         }}
         id="scrollableDiv"
      >
         <InfiniteScroll
            dataLength={messages.length}
            hasMore={hasMore}
            next={handleMore}
            loader={
               <div className="flex items-center justify-center">
                  <Spiner className="h-8 w-8 text-primary" />
               </div>
            }
            className=" !overflow-hidden"
            inverse
            style={{ display: 'flex', flexDirection: 'column-reverse' }}
            scrollableTarget="scrollableDiv"
         >
            <div ref={scrollHere}></div>
            {messages.map((message) => {
               return (
                  <Message
                     key={message.id}
                     onChooseMessage={onChooseMessage}
                     message={message}
                  />
               );
            })}
         </InfiniteScroll>
      </div>
   );
};

export default ChatView;
