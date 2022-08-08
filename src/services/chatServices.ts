import { db } from '@/firebase';
import { IConversation, IFile, IMessage } from '@/types';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   setDoc,
   updateDoc,
   where,
} from 'firebase/firestore';
import isEqual from 'lodash.isequal';
import { v4 } from 'uuid';
import { userServices } from './userServices';
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
   async addMessage(
      message: string,
      reply: IMessage['reply'],
      senderId: string,
      conversationId: string,
      type: IMessage['type'],
      callback?: () => void
   ) {
      const idMessage = v4();
      const newMessage: IMessage = {
         content: message,
         createdAt: new Date().toISOString(),
         id: idMessage,
         isUnsent: false,
         reply,
         senderId,
         type,
         nameFile: '',
         reactions: [],
      };
      const messagesRef = doc(
         db,
         `conversations/${conversationId}/messages`,
         idMessage
      );
      const conversationRef = doc(
         db,
         `conversations`,
         conversationId as string
      );
      setDoc(messagesRef, newMessage);
      callback && callback();
      updateDoc(conversationRef, {
         lastMessage: newMessage,
         usersRemoveConversation: [],
      });
   },
   async getUserNotInMembersConversation(
      currentMembersConversation: Array<string>,
      userId: string
   ) {
      //hrer
      const users = await userServices.getUsers(userId);

      return users.filter(
         (user) => !currentMembersConversation.includes(user.id)
      );
   },
};
