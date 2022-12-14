import { userServices } from '@/services';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';

const cache: { [key: string]: Array<IUser> } = {};
export const useUsers = (currentUserId: string) => {
   const [users, setUser] = useState<Array<IUser>>(cache[currentUserId] || []);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      if (cache[currentUserId]) {
         setLoading(false);
         setUser(cache[currentUserId]);
         return;
      } else if (currentUserId) {
         setLoading(true);
         userServices
            .getUsers(currentUserId)
            .then((_users) => {
               setUser(_users);
               cache[currentUserId] = _users;
               setLoading(false);
            })
            .catch((error) => {
               console.log(error);
               setLoading(false);
            });
      }
   }, [currentUserId]);

   return { users, loading };
};
