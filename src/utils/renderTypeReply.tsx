import { IMessage } from '@/types';

export const renderTypeReply = (
   type: IMessage['type'],
   isUnsent: boolean,
   messageContent?: string
) => {
   if (isUnsent) {
      return <p>Message is unsent</p>;
   } else {
      switch (type) {
         case 'AUDIO':
            return <p>A Audio</p>;
         case 'FILE':
            return <p>A File</p>;
         case 'IMAGE':
            return <p>A Image</p>;
         case 'VIDEO':
            return <p>A Video</p>;
         case 'TEXT':
            return <p>{messageContent}</p>;
         default:
            return null;
      }
   }
};
