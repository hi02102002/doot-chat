import React from 'react';

const Avatar: React.FC<
   React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
   >
> = ({ className = '', ...props }) => {
   return (
      <img
         src={props.src}
         alt={props.alt}
         className={`rounded-full w-8 h-8 ${className}`}
         {...props}
      />
   );
};

export default Avatar;
