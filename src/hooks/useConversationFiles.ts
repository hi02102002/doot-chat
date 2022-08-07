import { chatServices } from '@/services';
import { IFile } from '@/types';
import { useEffect, useState } from 'react';
const cache: { [key: string]: Array<IFile> } = {};
export const useConversationFiles = (conversationId: string) => {
   const [files, setFiles] = useState<Array<IFile>>(
      cache[conversationId] || []
   );
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      setLoading(true);
      if (cache[conversationId]) {
         console.log(cache[conversationId]);
         setLoading(false);
         return;
      } else {
         chatServices
            .getConversationFiles(conversationId as string)
            .then((_files) => {
               setFiles(_files);
               setLoading(false);
            })
            .catch((error) => {
               console.log(error);
               setLoading(false);
            });
      }
   }, [conversationId]);
   return {
      loading,
      files,
   };
};
