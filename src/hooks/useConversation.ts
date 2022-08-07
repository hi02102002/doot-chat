import { db } from '@/firebase';
import { useChat } from '@/hooks';
import { IConversation } from '@/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';

export const useConversation = (conversationId: string) => {
   const chatCtx = useChat();
   useEffect(() => {
      const unSub = onSnapshot(
         doc(db, 'conversations', conversationId),
         (snapShot) => {
            const conversation = snapShot.data() as IConversation;
            chatCtx?.selectConversation?.(conversation);
         }
      );
      return () => {
         unSub();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [conversationId]);
};
