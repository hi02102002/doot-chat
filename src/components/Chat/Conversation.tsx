import { useAuth, useChat, useUsersInfo } from '@/hooks';
import { IConversation } from '@/types';
import { convertNameConversation } from '@/utils';
import React, { useCallback, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';

interface Props {
   conversation: IConversation;
}
const Conversation: React.FC<Props> = ({ conversation }) => {
   const authCtx = useAuth();
   const chatCtx = useChat();
   const { users, loading } = useUsersInfo(conversation.members);
   const navigate = useNavigate();

   const usersFiltered = useMemo(() => {
      return users.filter((user) => (authCtx?.user?.uid as string) !== user.id);
   }, [authCtx?.user?.uid, users]);

   const handleChooseConversation = useCallback(() => {
      chatCtx?.selectConversation?.(conversation);
      navigate(`/${conversation.id}`);
   }, [chatCtx, conversation, navigate]);

   if (loading) {
      return <Skeleton className="h-[40px] !rounded-[0px]" />;
   }

   return (
      <div
         className={`py-1 px-4  transition-all cursor-pointer ${
            chatCtx?.currentConversation?.id === conversation.id
               ? 'bg-primary text-white'
               : ''
         } `}
         onClick={handleChooseConversation}
      >
         <div className="flex items-center gap-2">
            {usersFiltered.length > 1 ? (
               conversation.conversationAvatar ? (
                  <Avatar
                     style={{
                        width: 32,
                        height: 32,
                     }}
                     src={conversation.conversationAvatar.url}
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
            <h3 className="line-clamp-1 font-medium">
               {usersFiltered.length > 1
                  ? conversation.conversationName ||
                    convertNameConversation(usersFiltered)
                  : usersFiltered?.[0]?.username}
            </h3>
         </div>
      </div>
   );
};

export default React.memo(Conversation);
