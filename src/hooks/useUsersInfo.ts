import { userServices } from '@/services';
import { IUser } from '@/types';
import { useEffect, useMemo, useState } from 'react';

const cache: { [key: string]: Array<IUser> } = {};

export const useUsersInfo = (usersId: Array<string>) => {
   const key = useMemo(() => {
      return JSON.stringify(usersId);
   }, [usersId]);
   const [users, setUsers] = useState<Array<IUser>>(cache[key] || []);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      if (cache[key]) {
         setUsers(cache[key]);
         setLoading(false);
         return;
      }

      setLoading(true);
      userServices
         .getListUsersByListUserId(usersId)
         .then((_users) => {
            setUsers(_users);
            cache[key] = _users;
            setLoading(false);
         })
         .catch((error) => {
            console.log(error);
            setLoading(false);
         });
   }, [usersId, key]);

   return { users, loading };
};
