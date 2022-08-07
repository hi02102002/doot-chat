import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const uploadImg = async (file: File, path: string) => {
   const imgPostsRef = ref(storage, path);
   const snapshot = await uploadBytes(imgPostsRef, file, {
      contentType: file.type,
   });
   const url = await getDownloadURL(snapshot.ref);
   return url;
};
