import { Avatar, Dropdown, DropdownItem } from '@/components';
import { db, storage } from '@/firebase';
import { useAuth, useToast, useUserInfo } from '@/hooks';
import { IMessage } from '@/types';
import { renderTypeReply } from '@/utils';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useCallback, useMemo, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { BiCopy, BiDotsVerticalRounded, BiHide } from 'react-icons/bi';
import { BsFileEarmarkZip, BsFillReplyFill } from 'react-icons/bs';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import styles from './chat.module.scss';

const cx = classNames.bind(styles);

interface Props {
   message: IMessage;
   onChooseMessage: (message: IMessage) => void;
}

const Message: React.FC<Props> = ({ message, onChooseMessage }) => {
   const authCtx = useAuth();
   const { user, loading } = useUserInfo(message.senderId);
   const [showMore, setShowMore] = useState<boolean>(false);
   const { id: conversationId } = useParams();
   const toast = useToast();

   const itMe = useMemo(() => {
      return authCtx?.user?.uid === message.senderId;
   }, [authCtx?.user?.uid, message.senderId]);

   const handleCopyMessage = useCallback(() => {
      if (!message.isUnsent && message.type === 'TEXT') {
         navigator.clipboard.writeText(message.content);
         setShowMore(false);
         toast?.addToast({
            content: 'Copied message to clipboard',
            type: 'success',
            id: v4(),
         });
      }
   }, [message, toast]);

   const renderContentMessage = useCallback(() => {
      if (message.isUnsent) {
         return <div className={cx('content')}>Message is unsent</div>;
      } else {
         switch (message.type) {
            case 'AUDIO':
               return (
                  <div className={cx('content')}>
                     <audio src={message.content} controls />
                  </div>
               );
            case 'FILE':
               return (
                  <div className={cx('content')}>
                     <div className="p-3 border-primary rounded border ">
                        <div className="flex items-center gap-4 justify-between">
                           <BsFileEarmarkZip className="w-6 h-6 text-primary flex-shrink-0" />
                           <span className="font-semibold text-sm line-clamp-1 flex-1">
                              {message.nameFile}
                           </span>
                           <a
                              href={message.content}
                              download={'hi'}
                              target="_blank"
                              rel="noreferrer"
                           >
                              <AiOutlineDownload className="w-6 h-6 text-primary flex-shrink-0" />
                           </a>
                        </div>
                     </div>
                  </div>
               );
            case 'IMAGE':
               return (
                  <div className="min-w-[270px] max-w-[26rem] outline-hidden mb-[10px] ">
                     <img
                        src={message.content}
                        alt=""
                        className="w-full h-full object-contain rounded"
                     />
                  </div>
               );
            case 'TEXT':
               return <div className={cx('content')}>{message.content}</div>;
            case 'VIDEO':
               return (
                  <div className={cx('content')}>
                     <video src={message.content} controls />
                  </div>
               );
            default:
               return null;
         }
      }
   }, [message]);

   const handelUnsent = useCallback(async () => {
      const messageRef = doc(
         db,
         `conversations/${conversationId}/messages/${message.id}`
      );

      await updateDoc(messageRef, {
         isUnsent: true,
         content: 'Message is unsent',
         reply: message.reply && null, // neu co mess reply thi thanh null k co luc nay nos da la null r
      });
      setShowMore(false);

      if (message.nameFile) {
         const fileRef = ref(
            storage,
            `conversations/${conversationId}/messages/${message.nameFile}`
         );

         deleteObject(fileRef)
            .then(() => {
               console.log('remove thanh cong');
            })
            .catch((error) => {
               console.log(`Remove that bai ${JSON.stringify(error)}`);
            });
      }
   }, [message, conversationId]);

   const handleScrollMessageReply = useCallback(() => {
      const messageIsReplied = document.querySelector(
         `.message-${message.reply?.id}`
      ) as Element;

      if (messageIsReplied) {
         messageIsReplied.scrollIntoView({
            behavior: 'smooth',
         });
      }
   }, [message.reply?.id]);

   const renderReplyMessage = useCallback(() => {
      if (message.reply) {
         return (
            <div className={cx('content')} onClick={handleScrollMessageReply}>
               <div className="flex-col gap-2 flex">
                  <div className={cx('msg-reply')}>
                     <div className="flex-col flex ">
                        <h4>
                           {message.reply.senderId === authCtx?.user?.uid
                              ? 'You'
                              : user?.username}
                        </h4>
                        {renderTypeReply(
                           message.reply.type,
                           message.reply.isUnsent,
                           message.reply.content
                        )}
                     </div>
                  </div>
                  <span>{message.content}</span>
               </div>
            </div>
         );
      }
      return renderContentMessage();
   }, [
      message,
      authCtx?.user?.uid,
      user?.username,
      renderContentMessage,
      handleScrollMessageReply,
   ]);

   return (
      <div
         className={`${cx('message', {
            right: itMe,
         })} group message-${message.id}`}
      >
         {loading ? (
            <Skeleton className={cx('avatar')} circle />
         ) : (
            <Avatar
               className={cx('avatar')}
               src={user?.avatar as string}
               alt={user?.username as string}
            />
         )}
         <div className="flex flex-col ">
            {renderReplyMessage()}
            <div className={cx('info')}>
               <span className="font-base font-semibold text-black">
                  {user?.username}
               </span>
               <span>
                  {new Date(message.createdAt).toLocaleString('en-US', {
                     hour: 'numeric',
                     minute: 'numeric',
                     hour12: true,
                     day: '2-digit',
                     month: '2-digit',
                     year: 'numeric',
                  })}
               </span>
            </div>
         </div>
         <div className="self-start opacity-0 group-hover:opacity-100 transition-all">
            <Tippy
               onClickOutside={() => {
                  setShowMore(false);
               }}
               interactive={true}
               visible={showMore}
               render={(attrs) => (
                  <div className="box" tabIndex={-1} {...attrs}>
                     <Dropdown>
                        <DropdownItem
                           onClick={() => {
                              onChooseMessage(message);
                              setShowMore(false);
                           }}
                        >
                           <span>Reply</span>
                           <BsFillReplyFill className="w-4 h-4 flex-shrink-0 text-[#797c8c]" />
                        </DropdownItem>
                        {!message.isUnsent && message.type === 'TEXT' && (
                           <DropdownItem onClick={handleCopyMessage}>
                              <span>Copy</span>
                              <BiCopy className="w-4 h-4 flex-shrink-0 text-[#797c8c]" />
                           </DropdownItem>
                        )}

                        {!message.isUnsent &&
                           authCtx?.user?.uid === message.senderId && (
                              <DropdownItem onClick={handelUnsent}>
                                 <span>Unsent</span>
                                 <BiHide className="w-4 h-4 flex-shrink-0 text-[#797c8c]" />
                              </DropdownItem>
                           )}
                     </Dropdown>
                  </div>
               )}
            >
               <button
                  className="w-8 h-8 flex items-center justify-center"
                  onClick={() => {
                     setShowMore(!showMore);
                  }}
               >
                  <BiDotsVerticalRounded className="w-5 h-5" />
               </button>
            </Tippy>
         </div>
      </div>
   );
};

export default Message;
