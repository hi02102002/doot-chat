import { db } from '@/firebase';
import { IMessage } from '@/types';
import {
   collection,
   limitToLast,
   onSnapshot,
   orderBy,
   query,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';

const cache: { [key: string]: Array<IMessage> } = {};
export const useMessages = (conversationId: string, limit: number) => {
   const key = useMemo(() => {
      return `conversation-${conversationId}-${limit}`;
   }, [conversationId, limit]);
   const [messages, setMessages] = useState<Array<IMessage>>(cache[key] || []);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const ref = query(
         collection(db, `conversations/${conversationId}/messages`),
         orderBy('createdAt'),
         limitToLast(limit)
      );
      const unsub = onSnapshot(ref, (snapshot) => {
         if (snapshot.empty) {
            setLoading(false);
            setMessages([]);
            cache[key] = [];
            return;
         }
         const _messages = snapshot.docs.map((doc) => {
            const message = doc.data() as IMessage;
            return message;
         });
         setMessages(_messages);
         cache[key] = _messages;
         setLoading(false);
      });
      return () => {
         unsub();
      };
   }, [conversationId, limit, key]);
   return { messages, loading };
};
