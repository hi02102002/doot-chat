import { BREAK_POINT } from '@/constants';
import { useChat, useTab, useView } from '@/hooks';
import { ITab } from '@/types';
import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import Chat from '../Chat';
import Profile from '../Profile';
import Sidebar from '../Sidebar';

interface Props {
   children: React.ReactNode;
}

const TABS: Array<ITab> = [
   {
      component: Profile,
      id: uuid(),
      type: 'PROFILE',
   },
   {
      component: Chat,
      id: uuid(),
      type: 'CHATS',
   },
   // {
   //    component: Setting,
   //    id: uuid(),
   //    type: 'SETTING',
   // },
];

const Layout: React.FC<Props> = ({ children }) => {
   const tabCtx = useTab();
   const chatCtx = useChat();
   const { width } = useView();

   useEffect(() => {
      if (chatCtx?.currentConversation && width < BREAK_POINT.Desktops) {
         tabCtx?.chooseTab('');
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [chatCtx, width]);

   useEffect(() => {
      if (width >= BREAK_POINT.Desktops) {
         tabCtx?.chooseTab('CHATS');
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [width]);

   return (
      <div className="flex min-h-screen lg:flex-row flex-col">
         <Sidebar />
         {tabCtx?.currentTab && (
            <div className=" shadow  h-[calc(100vh_-_75px)] lg:min-w-[300px] lg:max-w-[300px] lg:h-[unset]">
               {TABS.map((tab) => {
                  return tab.type === tabCtx?.currentTab ? (
                     <tab.component key={tab.id} />
                  ) : null;
               })}
            </div>
         )}
         <>{children}</>
      </div>
   );
};

export default Layout;
