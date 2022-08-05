import { db } from '@/firebase';
import { IMessage } from '@/types';
import {
   collection,
   DocumentData,
   getDocs,
   limit,
   onSnapshot,
   orderBy,
   query,
   QueryDocumentSnapshot,
   startAfter,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

const LIMIT = 10;

export const useMessages = (conversationId: string) => {
   const [messages, setMessages] = useState<Array<IMessage>>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [hasMore, setHasMore] = useState<boolean>(false);
   const [lastDoc, setLastDoc] =
      useState<QueryDocumentSnapshot<DocumentData>>();

   const handleMore = useCallback(async () => {
      const ref = query(
         collection(db, `conversations/${conversationId}/messages`),
         orderBy('createdAt', 'desc'),
         limit(LIMIT),
         startAfter(lastDoc?.data().createdAt)
      );

      const documentSnapshots = await getDocs(ref);
      const _lastDoc =
         documentSnapshots.docs[documentSnapshots.docs.length - 1];

      const newMessages = documentSnapshots.docs.map((doc) => {
         const message = doc.data() as IMessage;
         return message;
      });

      setMessages([...messages, ...newMessages]);
      if (newMessages.length >= LIMIT) {
         setHasMore(true);
      } else {
         setHasMore(false);
      }
      setLastDoc(_lastDoc);
   }, [conversationId, lastDoc, messages]);

   useEffect(() => {
      const ref = query(
         collection(db, `conversations/${conversationId}/messages`),
         orderBy('createdAt', 'desc'),
         limit(LIMIT)
      );
      const unsub = onSnapshot(ref, (snapshot) => {
         const _lastDoc = snapshot.docs[snapshot.docs.length - 1];

         const _messages = snapshot.docs.map((doc) => {
            const message = doc.data() as IMessage;
            return message;
         });

         if (_messages.length >= LIMIT) {
            setHasMore(true);
         } else {
            setHasMore(false);
         }

         setMessages(_messages);
         setLastDoc(_lastDoc);
         setLoading(false);
      });
      return () => {
         unsub();
      };
   }, [conversationId]);
   return { messages, loading, hasMore, handleMore };
};
