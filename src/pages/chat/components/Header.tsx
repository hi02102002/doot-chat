import { Avatar } from '@/components';
import { ROUTES } from '@/constants';
import {
   useAuth,
   useBodyOverflow,
   useChat,
   useTab,
   useUsersInfo,
} from '@/hooks';
import { convertNameConversation } from '@/utils';
import { AnimatePresence } from 'framer-motion';
import React, { useMemo, useState } from 'react';
import { AiOutlineInfoCircle, AiOutlineVideoCamera } from 'react-icons/ai';
import { HiDotsVertical } from 'react-icons/hi';
import { MdArrowBackIos } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import InfoSidebar from './InfoSidebar';
const Header: React.FC = () => {
   const chatCtx = useChat();
   const authCtx = useAuth();
   const tabCtx = useTab();
   const { users, loading } = useUsersInfo(
      chatCtx?.currentConversation?.members || ['asdf', 'asd']
   );
   const navigate = useNavigate();
   const [showInfoSidebar, setShowInfoSidebar] = useState<boolean>(false);

   useBodyOverflow(showInfoSidebar);

   const usersFiltered = useMemo(() => {
      return users.filter((user) => (authCtx?.user?.uid as string) !== user.id);
   }, [authCtx?.user?.uid, users]);

   return (
      <>
         <div className="p-4 bg-[hsla(0,0%,100%,.05)]  border-b border-[#eaeaf1] backdrop-blur-md">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <button
                     className="w-10 h-10  flex items-center justify-center  flex-shrink-0 md:hidden"
                     onClick={() => {
                        chatCtx?.selectConversation?.(null);
                        navigate(ROUTES.HOME);
                        tabCtx?.chooseTab('CHATS');
                     }}
                  >
                     <MdArrowBackIos className="w-6 h-6" />
                  </button>
                  <div className="flex items-center gap-2">
                     {loading ? (
                        <Skeleton circle className="!w-8 !h-8" />
                     ) : (
                        <>
                           {usersFiltered.length > 1 ? (
                              chatCtx?.currentConversation
                                 ?.conversationAvatar ? (
                                 <Avatar
                                    style={{
                                       width: 32,
                                       height: 32,
                                    }}
                                    src={
                                       chatCtx?.currentConversation
                                          ?.conversationAvatar.url
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
                              ? chatCtx?.currentConversation
                                   ?.conversationName ||
                                convertNameConversation(usersFiltered)
                              : usersFiltered?.[0]?.username}
                        </h3>
                     )}
                  </div>
               </div>
               <div className="flex items-center justify-center gap-2">
                  <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                     <AiOutlineVideoCamera className="w-6 h-6 " />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 text-[#797c8c]">
                     <AiOutlineInfoCircle className="w-6 h-6 " />
                  </button>
                  <button
                     className="flex items-center justify-center w-10 h-10 text-[#797c8c]"
                     onClick={() => {
                        setShowInfoSidebar(true);
                     }}
                  >
                     <HiDotsVertical className="w-6 h-6 " />
                  </button>
               </div>
            </div>
         </div>
         <AnimatePresence>
            {showInfoSidebar && (
               <InfoSidebar
                  onClose={() => {
                     setShowInfoSidebar(false);
                  }}
               />
            )}
         </AnimatePresence>
      </>
   );
};

export default React.memo(Header);
