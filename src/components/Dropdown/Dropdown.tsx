import React, { HTMLProps } from 'react';

const Dropdown: React.FC<HTMLProps<HTMLDivElement>> = ({
   className = '',
   children,
   ...rest
}) => {
   return (
      <div
         className={`py-2 rounded border border-[#f6f6f9] bg-white min-w-[10rem] ${className} shadow`}
         {...rest}
      >
         {children}
      </div>
   );
};

const DropdownItem: React.FC<HTMLProps<HTMLDivElement>> = ({
   className = '',
   children,
   ...rest
}) => {
   return (
      <div
         className={` px-6 py-[0.35rem] flex items-center justify-between text-[#212529] whitespace-nowrap hover:bg-[#f8f9fa] hover:text-[#1f2327] transition-all ${className}cursor-pointer select-none`}
         {...rest}
      >
         {children}
      </div>
   );
};

export { Dropdown, DropdownItem };
