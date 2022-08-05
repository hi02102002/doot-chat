import { Button } from '@/components';
import { avatarUrl, bgCover, ROUTES } from '@/constants';
import { auth, db } from '@/firebase';
import { useToast } from '@/hooks';
import { userServices } from '@/services';
import { IUser } from '@/types';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import styles from './Auth.module.scss';
import AuthWrap from './AuthWrap';

const cx = classNames.bind(styles);
interface IFormInputs {
   email: string;
   username: string;
   password: string;
   confirmPassword: string;
}

const schema = yup.object().shape({
   email: yup
      .string()
      .email('Invalid email.')
      .required('You must enter your email.'),
   username: yup
      .string()
      .required('You must enter username.')
      .min(6, 'Username at least 6 letter.'),
   password: yup
      .string()
      .required('You must enter your password.')
      .min(8, 'Password at least 8 letter.'),
   confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match.')
      .required('Your must enter confirm password.'),
});

const Register: React.FC = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<IFormInputs>({
      resolver: yupResolver(schema),
   });
   const [loading, setLoading] = useState<boolean>(false);
   const toast = useToast();

   const styleErrorInput = useCallback(
      (isError: boolean): React.CSSProperties => {
         return {
            borderColor: isError ? 'var(--bs-red)' : undefined,
         };
      },
      []
   );

   const onSubmit = useCallback(
      async ({ email, password, username }: IFormInputs) => {
         try {
            setLoading(true);

            const userExist = await userServices.getUserByUsername(username);

            if (userExist) {
               setLoading(false);
               toast?.addToast({
                  id: uuid(),
                  content: 'Username already had used by other user.',
                  type: 'error',
               });
               return;
            }

            const { user } = await createUserWithEmailAndPassword(
               auth,
               email,
               password
            );

            const newUser: IUser = {
               address: '',
               bio: 'We live in society',
               email,
               username,
               id: user.uid,
               avatar: avatarUrl,
               bgCover,
               createdAt: serverTimestamp(),
            };

            await updateProfile(user, {
               displayName: username,
               photoURL: avatarUrl,
            });

            await setDoc(doc(db, 'users', user.uid), newUser);
            setLoading(false);
            toast?.addToast({
               id: uuid(),
               content: 'Register successfully.',
               type: 'success',
            });
         } catch (error: any) {
            setLoading(false);
            console.log(error);
         }
      },
      [toast]
   );

   useEffect(() => {
      document.title = 'Doot Chat | Register';
   }, []);

   return (
      <AuthWrap
         title="Register"
         contentNavigate={
            <div>
               <p className="text-center font-medium ">
                  {'Already had an account? '}
                  <Link to={ROUTES.LOGIN} className="text-primary">
                     Login
                  </Link>
               </p>
            </div>
         }
      >
         <div>
            <form
               className={cx('auth-form ')}
               onSubmit={handleSubmit(onSubmit)}
            >
               <div>
                  <label className="form-label     mb-2 block     ">
                     Email
                  </label>
                  <input
                     type="email"
                     placeholder="Your Email"
                     className="form-input"
                     style={styleErrorInput(!!errors.email?.message)}
                     {...register('email')}
                  />
                  {errors.email?.message && (
                     <p className={cx('error-msg')}>{errors.email?.message}</p>
                  )}
               </div>
               <div>
                  <label className="form-label     mb-2 block     ">
                     Username
                  </label>
                  <input
                     type="text"
                     placeholder="Username"
                     className="form-input"
                     style={styleErrorInput(!!errors.username?.message)}
                     {...register('username')}
                  />
                  {errors.username?.message && (
                     <p className={cx('error-msg')}>
                        {errors.username?.message}
                     </p>
                  )}
               </div>
               <div>
                  <label className="form-label    mb-2 block">Password</label>
                  <input
                     type="password"
                     placeholder="Your password"
                     className="form-input"
                     style={styleErrorInput(!!errors.password?.message)}
                     {...register('password')}
                  />
                  {errors.password?.message && (
                     <p className={cx('error-msg')}>
                        {errors.password?.message}
                     </p>
                  )}
               </div>
               <div>
                  <label className="form-label   mb-2 block">
                     Confirm password
                  </label>
                  <input
                     type="password"
                     placeholder="Confirm password"
                     className="form-input"
                     style={styleErrorInput(!!errors.confirmPassword?.message)}
                     {...register('confirmPassword')}
                  />
                  {errors.confirmPassword?.message && (
                     <p className={cx('error-msg')}>
                        {errors.confirmPassword?.message}
                     </p>
                  )}
               </div>
               <Button
                  typeBtn="primary"
                  className="w-full"
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
               >
                  Register
               </Button>
            </form>
         </div>
      </AuthWrap>
   );
};

export default Register;
