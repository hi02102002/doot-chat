import { useChat, useMessages } from '@/hooks';
import { chatServices } from '@/services';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Chat = () => {
   const chatCtx = useChat();
   const { id } = useParams();
   const [limit, setLimit] = useState<number>(10);

   const { loading, messages } = useMessages(id as string, limit);

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

   return (
      <div>
         <div></div>
      </div>
   );
};

export default Chat;
