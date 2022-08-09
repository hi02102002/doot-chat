import { Avatar, Button, Modal, Spiner } from '@/components';
import { ROUTES, THEMES } from '@/constants';
import { db, storage } from '@/firebase';
import { useAuth, useChat, useConversationFiles, useUsersInfo } from '@/hooks';
import { chatServices } from '@/services';
import { IConversation, ITheme } from '@/types';
import { convertNameConversation, uploadImg } from '@/utils';
import classNames from 'classnames/bind';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
   AiOutlineEdit,
   AiOutlineLogout,
   AiOutlineRest,
   AiOutlineUsergroupAdd,
} from 'react-icons/ai';
import {
   BsCheck2,
   BsFileEarmarkMusic,
   BsFileEarmarkPlay,
   BsFileEarmarkZip,
   BsFileImage,
} from 'react-icons/bs';
import { HiOutlineColorSwatch } from 'react-icons/hi';
import { IoIosArrowDown, IoMdClose } from 'react-icons/io';
import { RiNotificationBadgeLine } from 'react-icons/ri';
import { TbMessageCircleOff } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../chat.module.scss';
import ModalAddMembers from './ModalAddMembers';
import ModalChangeNameConversation from './ModalChangeNameConversation';
const cx = classNames.bind(styles);

interface Props {
   onClose: () => void;
}

const InfoSidebar: React.FC<Props> = ({ onClose }) => {
   const chatCtx = useChat();
   const authCtx = useAuth();
   const { users } = useUsersInfo(
      chatCtx?.currentConversation?.members as Array<string>
   );
   const [activeAccordion, setActiveAccordion] = useState<string>('');
   const { id: conversationId } = useParams();
   const { files, loading } = useConversationFiles(conversationId as string);
   const [showModalChangeNameConversation, setShowModalChangeNameConversation] =
      useState<boolean>(false);
   const [showModalAddMembers, setShowModalAddMembers] =
      useState<boolean>(false);
   const inputFileImgRef = useRef<HTMLInputElement | null>(null);
   const [loadingChangeAvatarConversation, setLoadingChangeAvatarConversation] =
      useState<boolean>(false);

   const conversationRef = useMemo(
      () => doc(db, 'conversations', conversationId as string),
      [conversationId]
   );
   const navigate = useNavigate();

   const handelChooseAccordion = (id: string) => {
      if (activeAccordion === id) {
         setActiveAccordion('');
      } else {
         setActiveAccordion(id);
      }
   };

   const usersFiltered = useMemo(() => {
      return users.filter((user) => (authCtx?.user?.uid as string) !== user.id);
   }, [authCtx?.user?.uid, users]);

   const handelChangeAvatar = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (file) {
            setLoadingChangeAvatarConversation(true);
            if (chatCtx?.currentConversation?.conversationAvatar) {
               const path = `conversations/${conversationId}/avatar/${chatCtx?.currentConversation?.conversationAvatar?.nameFile}`;
               const fileRef = ref(storage, path);

               deleteObject(fileRef)
                  .then(() => {
                     console.log('remove thanh cong');
                  })
                  .catch((error) => {
                     console.log(`Remove that bai ${JSON.stringify(error)}`);
                  });
            }

            const path = `conversations/${conversationId}/avatar/${file.name}`;
            const url = await uploadImg(file, path);

            await updateDoc(conversationRef, {
               conversationAvatar: {
                  url,
                  nameFile: file.name,
               },
            });
            chatCtx?.selectConversation?.({
               ...(chatCtx.currentConversation as IConversation),
               conversationAvatar: {
                  url,
                  nameFile: file.name,
               },
            });

            chatServices.addMessage(
               `${authCtx?.user?.displayName} has changed avatar conversation.`,
               null,
               authCtx?.user?.uid as string,
               conversationId as string,
               'SYSTEM'
            );

            setLoadingChangeAvatarConversation(false);
         }
      },
      [conversationId, chatCtx, conversationRef, authCtx]
   );

   const handleChangeThemeConversation = useCallback(
      async (theme: ITheme) => {
         if (theme.name === chatCtx?.currentConversation?.theme.name) {
            return;
         }
         chatCtx?.selectConversation?.({
            ...(chatCtx.currentConversation as IConversation),
            theme,
         });
         updateDoc(conversationRef, {
            theme,
         });
         chatServices.addMessage(
            `${authCtx?.user?.displayName} has changed theme conversation to ${theme.name}.`,
            null,
            authCtx?.user?.uid as string,
            conversationId as string,
            'SYSTEM'
         );
      },
      [chatCtx, conversationRef, authCtx, conversationId]
   );

   const renderListFiles = useCallback(() => {
      return loading ? (
         <Spiner />
      ) : files.length > 0 ? (
         <ul className="grid grid-cols-3 gap-4">
            {files.map((file) => {
               return (
                  <li key={file.id} className="h-28">
                     {file.type === 'AUDIO' ? (
                        <a
                           href={file.url}
                           download
                           target="_blank"
                           rel="noreferrer"
                        >
                           <div
                              className="h-full w-full flex items-center justify-center"
                              title={file.name}
                           >
                              <BsFileEarmarkMusic className="w-16 h-16 " />
                           </div>
                        </a>
                     ) : file.type === 'IMAGE' ? (
                        <a
                           href={file.url}
                           download
                           target="_blank"
                           rel="noreferrer"
                        >
                           <div
                              className="h-full w-full flex items-center justify-center"
                              title={file.name}
                           >
                              <img
                                 src={file.url}
                                 alt={file.name}
                                 className="h-full w-full object-cover"
                              />
                           </div>
                        </a>
                     ) : file.type === 'VIDEO' ? (
                        <a
                           href={file.url}
                           download
                           target="_blank"
                           rel="noreferrer"
                        >
                           <div
                              className="h-full w-full flex items-center justify-center"
                              title={file.name}
                           >
                              <BsFileEarmarkPlay className="w-16 h-16 " />
                           </div>
                        </a>
                     ) : file.type === 'FILE' ? (
                        <a
                           href={file.url}
                           download
                           target="_blank"
                           rel="noreferrer"
                        >
                           <div
                              className="h-full w-full flex items-center justify-center"
                              title={file.name}
                           >
                              <BsFileEarmarkZip className="w-16 h-16 " />
                           </div>
                        </a>
                     ) : null}
                  </li>
               );
            })}
         </ul>
      ) : (
         <p className="p-4 text-center font-semibold">No files.</p>
      );
   }, [files, loading]);

   const handleLeaveGroup = useCallback(() => {
      updateDoc(conversationRef, {
         members: arrayRemove(authCtx?.user?.uid as string),
      });
      chatServices.addMessage(
         `${authCtx?.user?.displayName} has left the group.`,
         null,
         authCtx?.user?.uid as string,
         conversationId as string,
         'SYSTEM'
      );
      navigate(ROUTES.HOME, {
         replace: true,
      });
   }, [authCtx, conversationRef, navigate, conversationId]);

   const handleRemoveConversation = useCallback(() => {
      updateDoc(conversationRef, {
         usersRemoveConversation: arrayUnion(authCtx?.user?.uid as string),
      });
      navigate(ROUTES.HOME, {
         replace: true,
      });
   }, [authCtx, conversationRef, navigate]);

   return (
      <>
         {loadingChangeAvatarConversation && (
            <div className="bg-black/50 fixed z-[1001] w-full h-full inset-0 flex items-center justify-center">
               <Spiner className="w-10 h-10 text-primary" />
            </div>
         )}
         <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputFileImgRef}
            onChange={handelChangeAvatar}
         />
         <Modal onClose={onClose}>
            <div className="w-full flex justify-end min-h-screen overflow-y-auto overflow-x-hidden">
               <motion.div
                  initial={{
                     x: '100%',
                     opacity: 0,
                  }}
                  animate={{
                     x: '0%',
                     opacity: 1,
                  }}
                  exit={{
                     x: '100%',
                     opacity: 0,
                  }}
                  transition={{
                     ease: 'linear',
                     duration: 0.15,
                  }}
                  className="w-full    overflow-x-hidden   bg-white shadow p-6 md:min-w-[400px] md:max-w-[400px]"
               >
                  <button onClick={onClose}>
                     <IoMdClose className="w-6 h-6" />
                  </button>
                  <div className="flex flex-col items-center justify-center  gap-4 mb-6">
                     {usersFiltered.length > 1 ? (
                        chatCtx?.currentConversation?.conversationAvatar ? (
                           <Avatar
                              style={{
                                 width: 56,
                                 height: 56,
                              }}
                              src={
                                 chatCtx?.currentConversation
                                    ?.conversationAvatar.url
                              }
                              alt=""
                              className="flex-shrink-0"
                           />
                        ) : (
                           <div className="h-14 w-14 flex items-center justify-center font-semibold bg-bs-gray-400 rounded-full flex-shrink-0 !text-body-color">
                              #
                           </div>
                        )
                     ) : (
                        <Avatar
                           style={{
                              width: 56,
                              height: 56,
                           }}
                           src={usersFiltered?.[0]?.avatar}
                           alt={usersFiltered?.[0]?.username}
                           className="flex-shrink-0"
                        />
                     )}
                     <h3 className="font-semibold text-lg">
                        {usersFiltered.length > 1
                           ? chatCtx?.currentConversation?.conversationName ||
                             convertNameConversation(usersFiltered)
                           : usersFiltered?.[0]?.username}
                     </h3>
                  </div>
                  <div className={cx('accordion')}>
                     <div className={cx('accordion-item')}>
                        <button
                           className={cx('accordion-btn', {
                              active: activeAccordion === '1',
                           })}
                           onClick={() => {
                              handelChooseAccordion('1');
                           }}
                        >
                           <span>Customise chat</span>
                           <IoIosArrowDown />
                        </button>
                        <div
                           className={cx('accordion-content', {
                              active: activeAccordion === '1',
                           })}
                        >
                           <ul>
                              {usersFiltered.length > 1 ? (
                                 <>
                                    <li>
                                       <button
                                          className={cx('accordion-btn')}
                                          onClick={() => {
                                             setShowModalChangeNameConversation(
                                                true
                                             );
                                          }}
                                       >
                                          <span>Change name conversation</span>
                                          <AiOutlineEdit />
                                       </button>
                                    </li>
                                    <li>
                                       <button
                                          className={cx('accordion-btn')}
                                          onClick={() => {
                                             inputFileImgRef.current?.click();
                                          }}
                                       >
                                          <span>
                                             Change avatar conversation
                                          </span>
                                          <BsFileImage />
                                       </button>
                                    </li>
                                 </>
                              ) : null}
                              <li>
                                 <div>
                                    <button className={cx('accordion-btn')}>
                                       <span>Change theme</span>
                                       <HiOutlineColorSwatch />
                                    </button>
                                    <ul className="flex items-center gap-4 p-4">
                                       {THEMES.map((theme) => {
                                          return (
                                             <li
                                                key={theme.id}
                                                className="w-full flex items-center justify-center"
                                             >
                                                <div
                                                   className="w-6 h-6 rounded-full cursor-pointer flex items-center justify-center "
                                                   style={{
                                                      backgroundColor:
                                                         theme.colorHex,
                                                   }}
                                                   onClick={() => {
                                                      handleChangeThemeConversation(
                                                         theme
                                                      );
                                                   }}
                                                >
                                                   {chatCtx?.currentConversation
                                                      ?.theme.name ===
                                                      theme.name && (
                                                      <BsCheck2 className="text-white w-4 h-4 flex-shrink-0" />
                                                   )}
                                                </div>
                                             </li>
                                          );
                                       })}
                                    </ul>
                                 </div>
                              </li>
                           </ul>
                        </div>
                     </div>
                     <div>
                        <button
                           className={cx('accordion-btn', {
                              active: activeAccordion === '2',
                           })}
                           onClick={() => {
                              handelChooseAccordion('2');
                           }}
                        >
                           <span>Conversation members</span>
                           <IoIosArrowDown />
                        </button>
                        <div
                           className={cx('accordion-content', {
                              active: activeAccordion === '2',
                           })}
                        >
                           <ul>
                              {users.map((user) => {
                                 return (
                                    <li key={user.id}>
                                       <button className={cx('accordion-btn')}>
                                          <div className="flex items-center gap-4">
                                             <Avatar
                                                src={user.avatar}
                                                style={{
                                                   width: 36,
                                                   height: 36,
                                                }}
                                             />
                                             <h4>{user.username}</h4>
                                          </div>
                                       </button>
                                    </li>
                                 );
                              })}
                           </ul>
                           {usersFiltered.length > 1 && (
                              <Button
                                 className={cx('accordion-btn', 'my-4')}
                                 typeBtn="primary"
                                 style={{
                                    backgroundColor:
                                       'var(--theme-conversation-hex)',
                                    borderColor:
                                       'var(--theme-conversation-hex)',
                                 }}
                                 onClick={() => {
                                    setShowModalAddMembers(true);
                                 }}
                              >
                                 <span>Add members</span>
                                 <AiOutlineUsergroupAdd />
                              </Button>
                           )}
                        </div>
                     </div>
                     <div>
                        <button
                           className={cx('accordion-btn', {
                              active: activeAccordion === '3',
                           })}
                           onClick={() => {
                              handelChooseAccordion('3');
                           }}
                        >
                           <span>Files</span>
                           <IoIosArrowDown />
                        </button>
                        <div
                           className={cx('accordion-content', {
                              active: activeAccordion === '3',
                           })}
                        >
                           {renderListFiles()}
                        </div>
                     </div>
                     <div>
                        <button
                           className={cx('accordion-btn', {
                              active: activeAccordion === '4',
                           })}
                           onClick={() => {
                              handelChooseAccordion('4');
                           }}
                        >
                           <span>Privacy and support</span>
                           <IoIosArrowDown />
                        </button>
                        <div
                           className={cx('accordion-content', {
                              active: activeAccordion === '4',
                           })}
                        >
                           <ul>
                              <li>
                                 <button className={cx('accordion-btn')}>
                                    <span>Mute notifications</span>
                                    <RiNotificationBadgeLine />
                                 </button>
                              </li>
                              <li>
                                 <button className={cx('accordion-btn')}>
                                    <span>Ignore messages</span>
                                    <TbMessageCircleOff />
                                 </button>
                              </li>
                              <li>
                                 {usersFiltered.length > 1 ? (
                                    <>
                                       <button
                                          className={cx('accordion-btn')}
                                          onClick={handleLeaveGroup}
                                       >
                                          <span>Leave group</span>
                                          <AiOutlineLogout />
                                       </button>
                                       <button
                                          className={cx('accordion-btn')}
                                          onClick={handleRemoveConversation}
                                       >
                                          <span>Remove conversation</span>
                                          <AiOutlineRest />
                                       </button>
                                    </>
                                 ) : (
                                    <button
                                       className={cx('accordion-btn')}
                                       onClick={handleRemoveConversation}
                                    >
                                       <span>Remove conversation</span>
                                       <AiOutlineRest />
                                    </button>
                                 )}
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
                  <AnimatePresence>
                     {showModalChangeNameConversation && (
                        <ModalChangeNameConversation
                           onClose={() => {
                              setShowModalChangeNameConversation(false);
                           }}
                        />
                     )}
                     {showModalAddMembers && (
                        <ModalAddMembers
                           onClose={() => {
                              setShowModalAddMembers(false);
                           }}
                        />
                     )}
                  </AnimatePresence>
               </motion.div>
            </div>
         </Modal>
      </>
   );
};

export default InfoSidebar;
