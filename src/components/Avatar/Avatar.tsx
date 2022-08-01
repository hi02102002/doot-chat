import React, { HTMLProps } from 'react';

const Avatar: React.FC<HTMLProps<HTMLImageElement>> = ({
   className = '',
   ...props
}) => {
   return (
      <img
         src={props.src}
         alt={props.alt}
         className={`rounded-full w-8 h-8 ${className}`}
      />
   );
};

export default Avatar;
