import { IUser } from '@/types';
import React, { useCallback } from 'react';
import { IoClose } from 'react-icons/io5';
import Spiner from '../Spiner';
import User from './User';
interface Props {
   chooseUsers: Array<IUser>;
   setChooseUsers: (value: React.SetStateAction<IUser[]>) => void;
   users: Array<IUser>;
   loading: boolean;
   title: string;
}
const ChooseUser: React.FC<Props> = ({
   chooseUsers,
   loading,
   users,
   setChooseUsers,
   title,
}) => {
   const isChecked = useCallback(
      (userId: string) => {
         return chooseUsers.some((user) => user.id === userId);
      },
      [chooseUsers]
   );
   const handleRemove = useCallback(
      (userId: string) => {
         setChooseUsers(chooseUsers.filter((_user) => _user.id !== userId));
      },
      [chooseUsers, setChooseUsers]
   );
   const handleChoose = useCallback(
      (user: IUser) => {
         if (isChecked(user.id)) {
            handleRemove(user.id);
         } else {
            setChooseUsers(chooseUsers.concat(user));
         }
      },
      [isChecked, chooseUsers, handleRemove, setChooseUsers]
   );
   const renderUsers = useCallback(() => {
      if (loading) {
         return (
            <div className="h-full flex-1 flex items-center justify-center">
               <Spiner className="text-primary w-6 h-6" />
            </div>
         );
      }

      if (users.length === 0) {
         return <div className="p-4 text-center">No users.</div>;
      }

      return users.map((user) => (
         <li key={user.id}>
            <User
               handleChoose={handleChoose}
               isChecked={isChecked(user.id)}
               user={user}
            />
         </li>
      ));
   }, [loading, users, handleChoose, isChecked]);
   return (
      <div>
         <div className="p-4 flex items-start gap-2">
            <span className="font-semibold">To: </span>
            {chooseUsers.length > 0 ? (
               <ul className="flex gap-2 flex-wrap max-h-[108px] overflow-y-auto">
                  {chooseUsers.map((user) => (
                     <li key={user.id}>
                        <div className="flex items-center gap-2 bg-primary rounded text-white p-1">
                           <span>{user.username}</span>
                           <button
                              onClick={() => {
                                 handleRemove(user.id);
                              }}
                           >
                              <IoClose className="w-4 h-4" />
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>
            ) : (
               <span>{title}</span>
            )}
         </div>
         <div className="py-4 flex flex-col gap-4">
            <h5 className="px-4 font-semibold ">Suggested</h5>
            <ul className="max-h-[183px] min-h-[183px] overflow-y-auto flex flex-col">
               {renderUsers()}
            </ul>
         </div>
      </div>
   );
};

export default ChooseUser;
