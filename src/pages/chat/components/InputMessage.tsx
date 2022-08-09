import { Button } from '@/components';
import { BREAK_POINT } from '@/constants';
import { db } from '@/firebase';
import { useAuth, useClickOutside, useUserInfo, useView } from '@/hooks';
import { chatServices } from '@/services';
import { IFile, IMessage } from '@/types';
import { renderTypeReply, uploadImg } from '@/utils';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { doc, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BsEmojiSunglasses, BsFileEarmarkImage } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import styles from '../chat.module.scss';
const cx = classNames.bind(styles);

interface Props {
   messageReply: IMessage | null;
   onChooseMessage: (message: IMessage | null) => void;
}

const InputMessage: React.FC<Props> = ({ messageReply, onChooseMessage }) => {
   const authCtx = useAuth();
   const { id: conversationId } = useParams();
   const [textMsgInput, setTextMsgInput] = useState<string>('');
   const [loadingSendFile, setLoadingSendFile] = useState<boolean>(false);
   const inputFileRef = useRef<HTMLInputElement | null>(null);
   const { user } = useUserInfo(messageReply?.senderId as string);
   const [showEmoji, setShowEmoji] = useState<boolean>(false);
   const inputMessageRef = useRef<HTMLInputElement | null>(null);
   const { width } = useView();
   const emojiWrapRef = useRef<HTMLDivElement | null>(null);
   useClickOutside(emojiWrapRef, (e) => {
      e.stopPropagation();
      setShowEmoji(false);
   });

   const handleSendMessage = useCallback(() => {
      if (textMsgInput.length === 0) return;
      chatServices.addMessage(
         textMsgInput,
         messageReply,
         authCtx?.user?.uid as string,
         conversationId as string,
         'TEXT',
         () => {
            setTextMsgInput('');
         }
      );
   }, [authCtx?.user?.uid, conversationId, textMsgInput, messageReply]);

   const handleChooseEmoji = useCallback((emoji: any) => {
      const valInput = inputMessageRef.current?.value as string;
      const postionOfPointerInput = valInput.slice(
         0,
         inputMessageRef.current?.selectionStart as number
      ).length;
      setTextMsgInput((text) => {
         return (
            text.slice(0, postionOfPointerInput) +
            emoji.native +
            text.slice(postionOfPointerInput)
         );
      });
   }, []);

   const handleSendFile = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
         //here
         try {
            const file = e.target.files?.[0];

            if (file) {
               setLoadingSendFile(true);
               const url = await uploadImg(
                  file,
                  `conversations/${conversationId}/messages/${file.name}`
               );

               const type: IMessage['type'] = file.type.includes('image')
                  ? 'IMAGE'
                  : file.type.includes('audio')
                  ? 'AUDIO'
                  : file.type.includes('video')
                  ? 'VIDEO'
                  : 'FILE';
               chatServices.addMessage(
                  url,
                  null,
                  authCtx?.user?.uid as string,
                  conversationId as string,
                  type
               );
               const fileRef = doc(
                  db,
                  `conversations/${conversationId}/files`,
                  file.name
               );
               const fileToAdd: IFile = {
                  id: file.name,
                  name: file.name,
                  url,
                  type,
               };
               await setDoc(fileRef, fileToAdd);
               setLoadingSendFile(false);
            }
         } catch (error) {
            setLoadingSendFile(false);
         }
      },
      [conversationId, authCtx?.user?.uid]
   );

   useEffect(() => {
      setTextMsgInput('');
   }, [conversationId]);

   return (
      <div className="relative">
         <input
            type="file"
            className="hidden"
            onChange={handleSendFile}
            ref={inputFileRef}
         />
         {messageReply && (
            <div className="p-4 bg-white">
               <div className={cx('msg-reply')}>
                  <div>
                     <h4>
                        {messageReply.senderId === authCtx?.user?.uid
                           ? 'You'
                           : user?.username}
                     </h4>
                     {renderTypeReply(
                        messageReply.type,
                        messageReply.isUnsent,
                        messageReply.content
                     )}
                  </div>
                  <button
                     onClick={() => {
                        onChooseMessage(null);
                     }}
                  >
                     <IoMdClose className="w-5 h-5" />
                  </button>
               </div>
            </div>
         )}
         <div className="p-4 bg-[hsla(0,0%,100%,.05)]  border-b border-[#eaeaf1] backdrop-blur-md ">
            <div className="flex items-center gap-2 ">
               <div className="flex items-center gap-2">
                  <Tippy content="File" placement="top">
                     <button
                        className="w-11 h-11 flex items-center justify-center"
                        onClick={() => {
                           inputFileRef.current?.click();
                        }}
                     >
                        <BsFileEarmarkImage
                           className="w-6 h-6 "
                           style={{
                              color: 'var(--theme-conversation-hex)',
                           }}
                        />
                     </button>
                  </Tippy>
                  <div className="relative" ref={emojiWrapRef}>
                     {showEmoji && (
                        <div className="absolute bottom-[50px] left-[-50px] translate-x-0 lg:left-[50%] lg:translate-x-[-50%] z-[100] shadow ">
                           <Picker
                              data={data}
                              onEmojiSelect={handleChooseEmoji}
                              theme="light"
                              perLine={width >= BREAK_POINT.Desktops ? 9 : 6}
                              previewPosition="none"
                           />
                        </div>
                     )}
                     <Tippy placement="top" content="Emoji">
                        <button
                           className="w-11 h-11 flex items-center justify-center"
                           onClick={() => {
                              setShowEmoji(!showEmoji);
                           }}
                        >
                           <BsEmojiSunglasses
                              className="w-6 h-6 "
                              style={{
                                 color: 'var(--theme-conversation-hex)',
                              }}
                           />
                        </button>
                     </Tippy>
                  </div>
               </div>
               <div className="w-full relative bg-body-bg">
                  <input
                     type="text"
                     className="form-input !py-[11px]  relative z-[1]   max-h-[78px] overflow-y-auto whitespace-pre-wrap placeholder:text-[var(--them-conversation-hex)]"
                     placeholder="Aa.."
                     onChange={(e) => {
                        setTextMsgInput(e.target.value);
                     }}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.preventDefault();
                           handleSendMessage();
                        }
                     }}
                     value={textMsgInput}
                     ref={inputMessageRef}
                  />
               </div>
               <Button
                  className="!p-0 !w-11 !h-11 !min-h-0 flex-shrink-0 !rounded-full"
                  onClick={() => {
                     handleSendMessage();
                     onChooseMessage(null);
                  }}
                  disabled={textMsgInput.length === 0 || loadingSendFile}
                  typeBtn="primary"
                  isLoading={loadingSendFile}
                  style={{
                     backgroundColor: 'var(--theme-conversation-hex)',
                     borderColor: 'var(--theme-conversation-hex)',
                  }}
               >
                  <AiOutlineSend className="w-6 h-6 " />
               </Button>
            </div>
         </div>
      </div>
   );
};

export default InputMessage;
