import { Button } from '@/components';
import { ROUTES } from '@/constants';
import { auth } from '@/firebase';
import { useToast } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames/bind';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import * as yup from 'yup';
import styles from './Auth.module.scss';
import AuthWrap from './AuthWrap';

const cx = classNames.bind(styles);

interface IFormInputs {
   email: string;
   password: string;
}

const schema = yup.object().shape({
   email: yup
      .string()
      .email('Invalid email.')
      .required('You must enter your email.'),
   password: yup
      .string()
      .required('You must enter your password.')
      .min(6, 'Password at least 6 letter.'),
});

const Login: React.FC = () => {
   const [loading, setLoading] = useState<boolean>(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<IFormInputs>({
      resolver: yupResolver(schema),
   });
   const toastCtx = useToast();
   const navigate = useNavigate();

   const onSubmit = useCallback(
      async ({ email, password }: IFormInputs) => {
         try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            navigate(ROUTES.HOME, {
               replace: true,
            });
            toastCtx?.addToast({
               id: uuid(),
               content: 'Register successfully.',
               type: 'success',
            });
         } catch (error: any) {
            setLoading(false);
         } finally {
            setLoading(false);
         }
      },
      [toastCtx, navigate]
   );

   return (
      <AuthWrap
         title="Login"
         contentNavigate={
            <div>
               <p className="text-center font-medium ">
                  {"Don't have an account? "}
                  <Link to={ROUTES.SIGN_UP} className="text-primary">
                     Sign up
                  </Link>
               </p>
            </div>
         }
      >
         <div>
            <form className={cx('auth-form')} onSubmit={handleSubmit(onSubmit)}>
               <div>
                  <label className="form-label     mb-2 block     ">
                     Email
                  </label>
                  <input
                     type="email"
                     placeholder="Your Email"
                     className="form-input"
                     {...register('email')}
                     style={{
                        borderColor: errors.email?.message
                           ? 'var(--bs-red)'
                           : undefined,
                     }}
                  />
                  {errors.email?.message && (
                     <p className={cx('error-msg')}>{errors.email?.message}</p>
                  )}
               </div>
               <div>
                  <label className="form-label    mb-2 block">Password</label>
                  <input
                     type="password"
                     placeholder="Your password"
                     className="form-input"
                     {...register('password')}
                     style={{
                        borderColor: errors.password?.message
                           ? 'var(--bs-red)'
                           : undefined,
                     }}
                  />
                  {errors.password?.message && (
                     <p className={cx('error-msg')}>
                        {errors.password?.message}
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
                  Log in
               </Button>
            </form>
            <Link
               to={ROUTES.FORGOT_PASSWORD}
               className="mt-2 hover:text-primary hover:underline transition-all inline-block"
            >
               Forgot your password?
            </Link>
         </div>
      </AuthWrap>
   );
};

export default Login;
