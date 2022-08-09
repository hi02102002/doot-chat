import { Avatar, Modal, ModalContent, ModalHeader } from '@/components';
import { useUserInfo } from '@/hooks';
import { IMessage, IReact } from '@/types';
import { renderReaction } from '@/utils';
import React from 'react';

interface Props {
   reactions: IMessage['reactions'];
   onClose: () => void;
}

const ModalSeeUserReaction: React.FC<Props> = ({ onClose, reactions }) => {
   return (
      <Modal>
         <ModalContent onClose={onClose}>
            <ModalHeader onClose={onClose} title="Message reactions" />
            <div className="p-4">
               <ul className="flex flex-col gap-4">
                  {reactions.map((reaction) => (
                     <li key={reaction.id}>
                        <UserReaction reaction={reaction} />
                     </li>
                  ))}
               </ul>
            </div>
         </ModalContent>
      </Modal>
   );
};

interface PropsUserReaction {
   reaction: IReact;
}
const UserReaction: React.FC<PropsUserReaction> = ({ reaction }) => {
   const { user } = useUserInfo(reaction.userId);
   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Avatar
               src={user?.avatar as string}
               alt={user?.username as string}
            />
            <h4 className="text-base font-semibold">{user?.username}</h4>
         </div>
         <div className="h-8 w-8">{renderReaction(reaction)}</div>
      </div>
   );
};

export default ModalSeeUserReaction;
