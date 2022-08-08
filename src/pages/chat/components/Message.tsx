import { Avatar, Dropdown, DropdownItem } from '@/components';
import { EMOJIS, EMOJI_OBJ } from '@/constants';
import { db, storage } from '@/firebase';
import { useAuth, useToast, useUserInfo } from '@/hooks';
import { IMessage, IReact, TICon } from '@/types';
import { renderTypeReply } from '@/utils';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { useCallback, useMemo, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { BiCopy, BiDotsVerticalRounded, BiHide } from 'react-icons/bi';
import { BsFileEarmarkZip, BsFillReplyFill } from 'react-icons/bs';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import styles from '../chat.module.scss';

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
   const [showEmojis, setShowEmojis] = useState<boolean>(false);
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
                     <div
                        className="p-3  rounded border "
                        style={{
                           borderColor: 'var(--theme-conversation-hex)',
                        }}
                     >
                        <div className="flex items-center gap-4 justify-between">
                           <BsFileEarmarkZip
                              className="w-6 h-6 text-primary flex-shrink-0"
                              style={{
                                 color: 'var(--theme-conversation-hex)',
                              }}
                           />
                           <span className="font-semibold text-sm line-clamp-1 flex-1">
                              {message.nameFile}
                           </span>
                           <a
                              href={message.content}
                              download={'hi'}
                              target="_blank"
                              rel="noreferrer"
                           >
                              <AiOutlineDownload
                                 className="w-6 h-6 text-primary flex-shrink-0"
                                 style={{
                                    color: 'var(--theme-conversation-hex)',
                                 }}
                              />
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
         const fileDocRef = doc(
            db,
            `conversations/${conversationId}/files/${message.nameFile}`
         );

         await deleteDoc(fileDocRef);

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

   const handleReactionMessage = useCallback(
      async (icon: TICon) => {
         const messageRef = doc(
            db,
            `conversations/${conversationId}/messages/${message.id}`
         );

         const iconAlreadyExistWithUser = message.reactions.some(
            (reaction) =>
               reaction.icon === icon && reaction.userId === authCtx?.user?.uid
         );
         const diffIconWithUser = message.reactions.some(
            (reaction) =>
               reaction.userId === authCtx?.user?.uid && reaction.icon !== icon
         );

         if (iconAlreadyExistWithUser) {
            console.log('iconAlreadyExistWithUser');
            const newReactions: IMessage['reactions'] = [];

            for (const reaction of message.reactions) {
               if (
                  reaction.icon === icon &&
                  reaction.userId === authCtx?.user?.uid
               ) {
                  newReactions.push(reaction);
               }
            }

            await updateDoc(messageRef, {
               reactions: newReactions,
            });
            return;
         }
         if (diffIconWithUser) {
            console.log('iconAlreadyExistWithUser');
            await updateDoc(messageRef, {
               reactions: message.reactions.map((reaction) => {
                  if (reaction.userId === authCtx?.user?.uid) {
                     return {
                        ...reaction,
                        icon,
                     };
                  }
                  return reaction;
               }),
            });
            return;
         }

         await updateDoc(messageRef, {
            reactions: message.reactions.concat({
               userId: authCtx?.user?.uid as string,
               icon,
               id: v4(),
            }),
         });
      },
      [conversationId, message, authCtx?.user?.uid]
   );

   const renderEmojisReacted = useCallback(() => {
      const renderReaction = (reaction: IReact) => {
         switch (reaction.icon) {
            case 'ANGRY':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.angry}
                     alt=""
                  />
               );
            case 'HAHA':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.haha}
                     alt=""
                  />
               );
            case 'HEART':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.heart}
                     alt=""
                  />
               );
            case 'LIKE':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.like}
                     alt=""
                  />
               );
            case 'SAD':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.sad}
                     alt=""
                  />
               );
            case 'WOW':
               return (
                  <img
                     className="w-full h-full object-cover"
                     src={EMOJI_OBJ.wow}
                     alt=""
                  />
               );
            default:
               return null;
         }
      };

      return (
         message.reactions.length > 0 && (
            <div className="absolute right-0 bottom-0 flex items-center gap-1 bg-white shadow px-2 py-1 rounded">
               <span className="h-4 w-4 flex items-center justify-center">
                  {message.reactions.length}
               </span>
               <ul className=" flex items-center gap-1">
                  {message.reactions.slice(0, 3).map((item) => {
                     return (
                        <li key={item.id} className="w-4 h-4">
                           {renderReaction(item)}
                        </li>
                     );
                  })}
               </ul>
            </div>
         )
      );
   }, [message]);

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

   if (message.type === 'SYSTEM') {
      return <p className="w-full text-center mb-4">{message.content}</p>;
   }

   return (
      <div
         className={`${cx('message', {
            right: itMe,
         })} group message-${message.id} select-none`}
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
            <Tippy
               placement="top-end"
               onClickOutside={() => {
                  setShowEmojis(false);
               }}
               interactive={true}
               visible={showEmojis}
               render={(attrs) => {
                  return (
                     <ul
                        tabIndex={-1}
                        {...attrs}
                        className="flex items-center gap-2 bg-white shadow p-2 rounded"
                     >
                        {EMOJIS.map((emoji) => (
                           <li
                              key={emoji.id}
                              className="w-8 h-8 cursor-pointer"
                              onClick={() => {
                                 handleReactionMessage(emoji.name);
                                 setShowEmojis(false);
                              }}
                           >
                              <img
                                 src={emoji.icon}
                                 alt={emoji.name}
                                 className="w-full h-full object-cover"
                              />
                           </li>
                        ))}
                     </ul>
                  );
               }}
            >
               <div className="relative">
                  {renderEmojisReacted()}
                  {renderReplyMessage()}
               </div>
            </Tippy>
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
            <div className="flex items-center gap-2">
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
               <button
                  className="w-8 h-8 flex items-center justify-center"
                  onClick={() => {
                     setShowEmojis(!showEmojis);
                  }}
               >
                  <HiOutlineEmojiHappy className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
   );
};

export default Message;
