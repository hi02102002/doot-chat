import { db } from '@/firebase';
import { IUser } from '@/types';
import { doc, getDoc } from 'firebase/firestore';

export const userServices = {
   getUserById: async (userId: string) => {
      const userRef = doc(db, 'users', userId);

      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
         return undefined;
      }

      return userSnapshot.data() as IUser;
   },
};
