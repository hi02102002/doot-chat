import { Button } from '@/components';
import { db, storage } from '@/firebase';
import { useAuth, useUserInfo } from '@/hooks';
import { IMessage } from '@/types';
import { renderTypeReply } from '@/utils';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { AiOutlineSend } from 'react-icons/ai';
import { BsEmojiSunglasses, BsFileEarmarkImage } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import styles from './chat.module.scss';

const cx = classNames.bind(styles);

const uploadImg = async (file: File, path: string) => {
   const imgPostsRef = ref(storage, path);
   const snapshot = await uploadBytes(imgPostsRef, file, {
      contentType: file.type,
   });
   const url = await getDownloadURL(snapshot.ref);
   return url;
};

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

   const handleSendMessage = useCallback(
      async (
         message: string,
         type: IMessage['type'],
         messageReply: IMessage | null = null,
         nameFile = ''
      ) => {
         if (message.length === 0) return;
         const idMessage = uuid();
         const newMessage: IMessage = {
            content: message,
            createdAt: new Date().toISOString(),
            id: idMessage,
            isUnsent: false,
            reply: messageReply,
            senderId: authCtx?.user?.uid as string,
            type: type,
            nameFile,
         };
         const messagesRef = doc(
            db,
            `conversations/${conversationId}/messages`,
            idMessage
         );
         const conversationRef = doc(
            db,
            `conversations`,
            conversationId as string
         );
         setDoc(messagesRef, newMessage);
         setTextMsgInput('');
         updateDoc(conversationRef, {
            lastMessage: newMessage,
         });
      },
      [authCtx?.user?.uid, conversationId]
   );

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

               handleSendMessage(url, type, null, file.name);
               setLoadingSendFile(false);
            }
         } catch (error) {
            setLoadingSendFile(false);
         }
      },
      [conversationId, handleSendMessage]
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
                        <BsFileEarmarkImage className="w-6 h-6 " />
                     </button>
                  </Tippy>
                  <Tippy content="Emoji" placement="top">
                     <button className="w-11 h-11 flex items-center justify-center">
                        <BsEmojiSunglasses className="w-6 h-6 " />
                     </button>
                  </Tippy>
               </div>
               <div className="w-full relative bg-body-bg">
                  <ContentEditable
                     html={textMsgInput}
                     onChange={(e) => {
                        setTextMsgInput(e.target.value);
                     }}
                     className="form-input !py-[11px]  relative z-[1]   max-h-[78px] overflow-y-auto whitespace-pre-wrap"
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.preventDefault();
                        }
                     }}
                     dangerouslySetInnerHTML={{ __html: textMsgInput }}
                  />
                  {textMsgInput.length === 0 && (
                     <span className="select-none absolute px-4 h-11 flex items-center top-0 left-0 z-0 ">
                        Aa...
                     </span>
                  )}
               </div>
               <Button
                  className="!p-0 !w-11 !h-11 !min-h-0 flex-shrink-0 !rounded-full"
                  onClick={() => {
                     handleSendMessage(textMsgInput, 'TEXT', messageReply);
                     onChooseMessage(null);
                  }}
                  disabled={textMsgInput.length === 0 || loadingSendFile}
                  typeBtn="primary"
                  isLoading={loadingSendFile}
               >
                  <AiOutlineSend className="w-6 h-6 " />
               </Button>
            </div>
         </div>
      </div>
   );
};

export default InputMessage;
