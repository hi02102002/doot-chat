import { db } from '@/firebase';
import { IUser } from '@/types';
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   where,
} from 'firebase/firestore';

export const userServices = {
   getUserById: async (userId: string) => {
      const userRef = doc(db, 'users', userId);

      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
         return undefined;
      }

      return userSnapshot.data() as IUser;
   },
   getUserByUsername: async (username: string) => {
      const q = query(
         collection(db, 'users'),
         where('username', '==', username)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
         return doc.data() as IUser;
      })?.[0];
   },
};
