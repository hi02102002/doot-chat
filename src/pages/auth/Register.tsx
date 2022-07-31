import { Button } from '@/components';
import { ROUTES } from '@/constants';
import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.scss';
import AuthWrap from './AuthWrap';
const cx = classNames.bind(styles);
const Register: React.FC = () => {
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
            <form className={cx('auth-form')}>
               <div>
                  <label className="form-label     mb-2 block     ">
                     Email
                  </label>
                  <input
                     type="email"
                     placeholder="Your Email"
                     className="form-input"
                  />
               </div>
               <div>
                  <label className="form-label     mb-2 block     ">
                     Username
                  </label>
                  <input
                     type="text"
                     placeholder="Username"
                     className="form-input"
                  />
               </div>
               <div>
                  <label className="form-label    mb-2 block">Password</label>
                  <input
                     type="password"
                     placeholder="Your password"
                     className="form-input"
                  />
               </div>
               <div>
                  <label className="form-label   mb-2 block">
                     Confirm password
                  </label>
                  <input
                     type="password"
                     placeholder="Confirm password"
                     className="form-input"
                  />
               </div>
               <Button typeBtn="primary" className="w-full" type="submit">
                  Register
               </Button>
            </form>
         </div>
      </AuthWrap>
   );
};

export default Register;
