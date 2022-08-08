import { Button } from '@/components';
import { useChat, useTab, useView } from '@/hooks';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
   const chatCtx = useChat();
   const tabCtx = useTab();
   const { width } = useView();

   useEffect(() => {
      chatCtx?.selectConversation?.(null);
   }, [chatCtx]);

   useEffect(() => {
      document.title = 'Doot Chat | Home';
   }, []);

   return (tabCtx?.currentTab || chatCtx?.currentConversation) &&
      width < 1024 ? null : (
      <div className="h-screen flex-1 flex flex-col justify-center items-center text-center gap-4">
         <Button
            typeBtn="sort-primary"
            style={{
               width: 96,
               height: 96,
            }}
            className="pointer-events-none !rounded-full"
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="30"
               height="30"
               viewBox="0 0 24 24"
               fill="var(--bs-primary)"
               className="w-14 h-14"
            >
               <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z"></path>
            </svg>
         </Button>
         <h4 className="font-semibold text-xl">Welcome to Doot Chat</h4>
         <p className="max-w-md">Start chat now!</p>
      </div>
   );
};

export default Home;
