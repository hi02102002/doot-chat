import { IUser } from '@/types';
import { Auth, AuthError, AuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import { db } from 'src/firebase';

export const useLoginWithProvider = (auth: Auth, provider: AuthProvider) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<AuthError>();

   const loginWithProvider = useCallback(async () => {
      try {
         setLoading(true);
         const { user } = await signInWithPopup(auth, provider);

         const userRef = doc(db, 'users', user.uid);
         const docSnap = await getDoc(userRef);

         if (!docSnap.exists()) {
            const newUser: IUser = {
               address: '',
               bio: '',
               email: user.email as string,
               id: user.uid,
               username: user.displayName as string,
               avatar: '',
               bgCover: '',
            };

            await setDoc(doc(db, 'users', user.uid), newUser);
         }

         setLoading(false);
      } catch (error: any) {
         console.log(error);
         setError(error as AuthError);
         setLoading(false);
      } finally {
         setLoading(false);
      }
   }, [auth, provider]);

   return {
      loading,
      error,
      loginWithProvider,
   };
};
