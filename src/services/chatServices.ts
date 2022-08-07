import { db } from '@/firebase';
import { IConversation, IFile } from '@/types';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';
import isEqual from 'lodash.isequal';
export const chatServices = {
   async conversationIsCreated(members: Array<string>, userId: string) {
      const q = query(
         collection(db, 'conversations'),
         where('members', 'array-contains', userId)
      );
      const querySnapshot = await getDocs(q);

      const conversations = querySnapshot.docs.map((doc) => {
         return doc.data() as IConversation;
      });

      const conversationCreated = conversations.find((conversation) => {
         return isEqual([...conversation.members].sort(), [...members.sort()]);
      });
      return conversationCreated;
   },
   async getConversation(id: string) {
      const conversationRef = doc(db, 'conversations', id);

      const conversationSnapshot = await getDoc(conversationRef);

      return conversationSnapshot.data() as IConversation;
   },

   async getConversationFiles(conversationId: string) {
      const filesRef = collection(db, `conversations/${conversationId}/files`);
      const filesSnapshot = await getDocs(filesRef);
      return filesSnapshot.docs.map((doc) => {
         return doc.data() as IFile;
      });
   },
};
