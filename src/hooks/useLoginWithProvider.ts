import { avatarUrl, bgCover } from '@/constants';
import { db } from '@/firebase';
import { IUser } from '@/types';
import { generateKeywords } from '@/utils';
import { Auth, AuthError, AuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useToast } from './useToast';

export const useLoginWithProvider = (auth: Auth, provider: AuthProvider) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<AuthError>();
   const toastCtx = useToast();

   const loginWithProvider = useCallback(async () => {
      try {
         setLoading(true);
         const { user } = await signInWithPopup(auth, provider);
         toastCtx?.addToast({
            id: uuid(),
            content: 'Login successfully.',
            type: 'success',
         });
         const userRef = doc(db, 'users', user.uid);
         const docSnap = await getDoc(userRef);

         if (!docSnap.exists()) {
            const newUser: IUser = {
               address: '',
               bio: 'We live in society',
               email: user.email as string,
               id: user.uid,
               username: user.displayName as string,
               avatar: user.photoURL || avatarUrl,
               bgCover: bgCover,
               createdAt: serverTimestamp(),
               keywords: generateKeywords(
                  (user.displayName as string).toLocaleLowerCase()
               ),
            };

            await setDoc(doc(db, 'users', user.uid), newUser);
         }

         setLoading(false);
      } catch (error: any) {
         setError(error as AuthError);
         setLoading(false);
         toastCtx?.addToast({
            id: uuid(),
            content: error.message,
            type: 'error',
         });
      } finally {
         setLoading(false);
      }
   }, [auth, provider, toastCtx]);

   return {
      loading,
      error,
      loginWithProvider,
   };
};
