import { db } from '@/firebase';
import { IMessage } from '@/types';
import {
   collection,
   limit,
   onSnapshot,
   orderBy,
   query,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

const LIMIT = 10;

export const useMessages = (conversationId: string) => {
   const [count, setCount] = useState(LIMIT);
   const [messages, setMessages] = useState<Array<IMessage>>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [hasMore, setHasMore] = useState<boolean>(false);

   const handleMore = useCallback(async () => {
      setCount(count + LIMIT);
   }, [count]);

   useEffect(() => {
      const ref = query(
         collection(db, `conversations/${conversationId}/messages`),
         orderBy('createdAt', 'desc'),
         limit(count)
      );
      const unsub = onSnapshot(ref, (snapshot) => {
         const _messages = snapshot.docs.map((doc) => {
            const message = doc.data() as IMessage;
            return message;
         });

         if (_messages.length >= count) {
            setHasMore(true);
         } else {
            setHasMore(false);
         }

         setMessages(_messages);
         setLoading(false);
      });
      return () => {
         unsub();
      };
   }, [conversationId, count]);
   return { messages, loading, hasMore, handleMore };
};
