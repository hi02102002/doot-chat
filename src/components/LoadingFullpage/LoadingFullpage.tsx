import { AiOutlineMessage } from 'react-icons/ai';

const LoadingFullpage = () => {
   return (
      <div className="min-h-screen flex items-center justify-center bg-primary px-4">
         <div className="flex flex-col items-center  text-white text-center gap-2 ">
            <AiOutlineMessage className="w-12 h-12 drop-shadow" />
            <div className='text-xl font-semibold drop-shadow after:content-["_."] after:animate-dots w-32 flex items-center justify-center'>
               Loading
            </div>
         </div>
      </div>
   );
};

export default LoadingFullpage;
