import { db } from '@/firebase';
import { useAuth } from '@/hooks';
import { IChatContext, IConversation } from '@/types';
import {
   collection,
   onSnapshot,
   query,
   Unsubscribe,
   where,
} from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';

interface Props {
   children: React.ReactNode;
}
export const ChatContext = createContext<IChatContext | null>(null);

const cache: { [key: string]: Array<IConversation> } = {};
export const ChatProvider: React.FC<Props> = ({ children }) => {
   const authCtx = useAuth();
   const [conversations, setConversations] = useState<Array<IConversation>>(
      cache['conversations'] || []
   );
   const [currentConversation, setCurrentConversation] =
      useState<IConversation | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   const handleSelectConversation = (conversation: IConversation | null) => {
      setCurrentConversation(conversation);
   };

   useEffect(() => {
      let unsub: Unsubscribe;
      if (authCtx?.user?.uid) {
         const q = query(
            collection(db, 'conversations'),
            where('members', 'array-contains', authCtx.user.uid)
         );
         unsub = onSnapshot(q, (querySnapshot) => {
            const _conversations = querySnapshot.docs
               .map((doc) => {
                  const _conversation = doc.data() as IConversation;
                  return _conversation;
               })
               .sort((a, b) => {
                  if (a.lastMessage?.createdAt && b.lastMessage?.createdAt) {
                     return b.lastMessage.createdAt.localeCompare(
                        a.lastMessage.createdAt
                     );
                  }

                  return b.createdAt.localeCompare(a.createdAt);
               });
            cache['conversations'] = _conversations;
            setConversations(_conversations);
            setLoading(false);
         });
      }

      return () => {
         unsub && unsub();
      };
   }, [authCtx?.user?.uid]);

   return (
      <ChatContext.Provider
         value={{
            conversations,
            currentConversation,
            selectConversation: handleSelectConversation,
            loading,
         }}
      >
         {children}
      </ChatContext.Provider>
   );
};
