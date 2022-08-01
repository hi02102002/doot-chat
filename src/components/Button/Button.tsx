import classNames from 'classnames/bind';
import React, { ButtonHTMLAttributes, forwardRef, useCallback } from 'react';
import Spiner from '../Spiner';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: React.ReactNode;
   isLoading?: boolean;
   typeBtn?: '' | 'primary' | 'secondary';
   classNameSpiner?: string;
}

const Button = forwardRef<HTMLButtonElement, Props>(
   (
      {
         children,
         isLoading,
         typeBtn,
         onClick,
         classNameSpiner,
         className = '',
         ...rest
      },
      ref
   ) => {
      const handleClick = useCallback(
         (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (rest.disabled) {
               return;
            }
            onClick && onClick(e);
         },
         [onClick, rest.disabled]
      );

      return (
         <button
            className={`${cx('btn', typeBtn, className)}`}
            ref={ref}
            onClick={handleClick}
            {...rest}
         >
            {isLoading ? <Spiner className={classNameSpiner} /> : children}
         </button>
      );
   }
);

Button.displayName = 'Button';

export default Button;
