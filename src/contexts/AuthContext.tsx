import { LoadingFullpage } from '@/components';
import { ROUTES } from '@/constants';
import { IAuthContext } from '@/types';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from 'src/firebase';

interface Props {
   children: React.ReactNode;
}
export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<Props> = ({ children }) => {
   const [currentUser, setCurrentUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const navigate = useNavigate();

   useEffect(() => {
      const subscribe = onAuthStateChanged(auth, async (_user) => {
         try {
            if (_user) {
               setCurrentUser(_user);
               setLoading(false);
            } else {
               setCurrentUser(null);
               setLoading(false);
               signOut(auth);
               navigate(ROUTES.LOGIN);
            }
         } catch (error) {
            setLoading(false);
            signOut(auth);
            setCurrentUser(null);
            navigate(ROUTES.LOGIN);
         }
      });
      return () => {
         subscribe();
      };
   }, []);

   return (
      <AuthContext.Provider
         value={{
            user: currentUser,
         }}
      >
         {loading ? <LoadingFullpage /> : children}
      </AuthContext.Provider>
   );
};
