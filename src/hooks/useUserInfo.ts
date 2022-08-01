import { userServices } from '@/services';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';

const cache: { [key: string]: IUser } = {};

export const useUserInfo = (userId: string) => {
   const [user, setUser] = useState<IUser | null>(cache[userId] || null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      if (cache[userId]) {
         return;
      } else {
         if (userId) {
            setLoading(true);
            userServices
               .getUserById(userId)
               .then((_user) => {
                  if (_user) {
                     setUser(_user);
                     cache[userId] = _user;
                  } else {
                     setUser(null);
                  }
                  setLoading(false);
               })
               .catch((error) => {
                  console.log(error);
                  setLoading(false);
               });
         }
      }
   }, [userId]);
   return { loading, user };
};
