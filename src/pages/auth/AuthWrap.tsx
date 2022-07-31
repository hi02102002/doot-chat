import { Button } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import classNames from 'classnames/bind';
import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { BsFacebook } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { Link, Navigate } from 'react-router-dom';
import authStyles from './Auth.module.scss';

const cx = classNames.bind(authStyles);

interface Props {
   children: React.ReactNode;
   title: string;
   contentNavigate: React.ReactNode;
}

const AuthWrap = ({ children, title, contentNavigate }: Props) => {
   const auth = useAuth();

   if (auth?.user) return <Navigate to={ROUTES.HOME} replace />;

   return (
      <div className={`${cx('auth')} pb-6`}>
         <header className={`${cx('header')} h-header `}>
            <div className="w-full">
               <Link to={ROUTES.HOME}>
                  <h3 className={cx('auth-logo')}>Doot</h3>
               </Link>
            </div>
         </header>
         <div className={`${cx('auth-main')} `}>
            <div className={cx('auth-main-wrap')}>
               <h2 className={cx('auth-title')}>{title}</h2>
               <div className={cx('auth-content')}>
                  <div className={cx('btn-providers-group')}>
                     <Button className={cx('btn-provider')}>
                        <FcGoogle />
                     </Button>
                     <Button className={cx('btn-provider')}>
                        <BsFacebook className="text-[#046ce4]" />
                     </Button>
                     <Button className={cx('btn-provider')}>
                        <AiFillGithub className="text-[#42526e]" />
                     </Button>
                  </div>
                  <div className="mt-6">{children}</div>
               </div>
               <div className={`${cx('auth-content')} mt-5 `}>
                  {contentNavigate}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthWrap;
