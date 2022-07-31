import classNames from 'classnames/bind';
import React, { ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   isLoading?: boolean;
   typeBtn?: '' | 'primary' | 'secondary';
}

const Button = forwardRef<HTMLButtonElement, Props>(
   (
      { children, isLoading, typeBtn, onClick, className = '', ...rest },
      ref
   ) => {
      const handleClick = useCallback(
         (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (rest.disabled) {
               return;
            }
            onClick && onClick(e);
         },
         []
      );

      return (
         <button
            className={`${cx('btn', typeBtn, className)}`}
            ref={ref}
            onClick={handleClick}
            {...rest}
         >
            {children}
         </button>
      );
   }
);

export default Button;
