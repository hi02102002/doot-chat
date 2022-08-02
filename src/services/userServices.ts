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
   getListUsersByListUserId: async (usersId: Array<string>) => {
      const users = await Promise.all(
         usersId.map(async (id) => {
            const user = await userServices.getUserById(id);
            return user as IUser;
         })
      );
      return users.filter((user) => user !== undefined);
   },
   async getAllUser(userId: string) {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const users: Array<IUser> = [];

      for (const doc of querySnapshot.docs) {
         const user = doc.data() as IUser;

         if (!(user.id === userId)) {
            users.push(user);
         }
      }
      return users;
   },
};
