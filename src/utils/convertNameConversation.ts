import { IUser } from '@/types';

export const convertNameConversation = (users: Array<IUser>) => {
   return users
      .slice(0, 3)
      .map((user) => user.username)
      .join(',');
};
