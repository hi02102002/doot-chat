import { Avatar } from '@/components';
import { useAuth, useChat, useUsersInfo } from '@/hooks';
import { convertNameConversation } from '@/utils';
import React, { useMemo } from 'react';
import {
   AiOutlineInfoCircle,
   AiOutlinePhone,
   AiOutlineVideoCamera,
} from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { HiDotsVertical } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';

const Header: React.FC = () => {
   const chatCtx = useChat();
   const authCtx = useAuth();
   const { users, loading } = useUsersInfo(
      chatCtx?.currentConversation?.members || ['asdf', 'asd']
   );

   const usersFiltered = useMemo(() => {
      return users.filter((user) => (authCtx?.user?.uid as string) !== user.id);
   }, [authCtx?.user?.uid, users]);

   return (
      <div className="p-4 bg-[hsla(0,0%,100%,.05)]  border-b border-[#eaeaf1] backdrop-blur-md">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               {loading ? (
                  <Skeleton circle className="!w-8 !h-8" />
               ) : (
                  <>
                     {usersFiltered.length > 1 ? (
                        chatCtx?.currentConversation?.conversationAvatar ? (
                           <Avatar
                              style={{
                                 width: 32,
                                 height: 32,
                              }}
                              src={
                                 chatCtx?.currentConversation
                                    ?.conversationAvatar
                              }
                              alt=""
                              className="flex-shrink-0"
                           />
                        ) : (
                           <div className="h-8 w-8 flex items-center justify-center font-semibold bg-bs-gray-400 rounded-full flex-shrink-0 !text-body-color">
                              #
                           </div>
                        )
                     ) : (
                        <Avatar
                           style={{
                              width: 32,
                              height: 32,
                           }}
                           src={usersFiltered?.[0]?.avatar}
                           alt={usersFiltered?.[0]?.username}
                           className="flex-shrink-0"
                        />
                     )}
                  </>
               )}
               {loading ? (
                  <Skeleton className="!w-56  !h-8" />
               ) : (
                  <h3 className="line-clamp-1 font-semibold text-lg">
                     {usersFiltered.length > 1
                        ? chatCtx?.currentConversation?.conversationName ||
                          convertNameConversation(usersFiltered)
                        : usersFiltered?.[0]?.username}
                  </h3>
               )}
            </div>
            <div className="flex items-center justify-center gap-2">
               <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                  <BiSearch className="w-6 h-6 " />
               </button>
               <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                  <AiOutlinePhone className="w-6 h-6 " />
               </button>
               <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                  <AiOutlineVideoCamera className="w-6 h-6 " />
               </button>
               <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                  <AiOutlineInfoCircle className="w-6 h-6 " />
               </button>
               <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                  <HiDotsVertical className="w-6 h-6 " />
               </button>
            </div>
         </div>
      </div>
   );
};

export default React.memo(Header);
