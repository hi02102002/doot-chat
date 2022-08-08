import { userServices } from '@/services';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';

export const useSearchUsersByUsername = (userId: string, q: string) => {
   const [users, setUsers] = useState<Array<IUser>>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      setLoading(true);
      userServices
         .searchUsersByUsername(userId, q.toLocaleLowerCase())
         .then((_users) => {
            console.log(_users);
            setUsers(_users);
            setLoading(false);
         })
         .catch((error) => {
            console.log(error);
            setLoading(false);
         });
   }, [q, userId]);

   return { users, loading };
};
