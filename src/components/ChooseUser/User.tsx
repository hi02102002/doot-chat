import { IUser } from '@/types';
import React from 'react';
import Avatar from '../Avatar';

interface Props {
   handleChoose: (user: IUser) => void;
   user: IUser;
   isChecked: boolean;
}

const User: React.FC<Props> = ({ handleChoose, user, isChecked }) => {
   return (
      <div
         className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-bs-gray-400 transition-all select-none"
         onClick={() => {
            handleChoose(user);
         }}
      >
         <div className="flex items-center gap-2">
            <Avatar
               src={user.avatar}
               style={{
                  width: 44,
                  height: 44,
               }}
            />
            <div>
               <h4>{user.username}</h4>
               <span>{user.email}</span>
            </div>
         </div>
         <button>
            {isChecked ? (
               <svg
                  aria-label="Toggle selection"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                  className="text-primary fill-primary"
               >
                  <path d="M12.001.504a11.5 11.5 0 1011.5 11.5 11.513 11.513 0 00-11.5-11.5zm5.706 9.21l-6.5 6.495a1 1 0 01-1.414-.001l-3.5-3.503a1 1 0 111.414-1.414l2.794 2.796L16.293 8.3a1 1 0 011.414 1.415z"></path>
               </svg>
            ) : (
               <svg
                  aria-label="Toggle selection"
                  height="24"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24"
                  className="fill-bs-gray-500 text-bs-gray-500"
               >
                  <circle
                     cx="12.008"
                     cy="12"
                     fill="none"
                     r="11.25"
                     stroke="currentColor"
                     strokeLinejoin="round"
                     strokeWidth="1.5"
                  ></circle>
               </svg>
            )}
         </button>
      </div>
   );
};

export default User;
