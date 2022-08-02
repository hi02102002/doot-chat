import { useTab } from '@/hooks';
import { ITab } from '@/types';
import React from 'react';
import { v4 as uuid } from 'uuid';
import Chat from '../Chat';
import Profile from '../Profile';
import Setting from '../Setting';
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
   {
      component: Setting,
      id: uuid(),
      type: 'SETTING',
   },
];

const Layout: React.FC<Props> = ({ children }) => {
   const tabCtx = useTab();

   return (
      <div className="flex min-h-screen">
         <Sidebar />
         <div className="min-w-[300px] max-w-[300px]">
            {TABS.map((tab) => {
               return tab.type === tabCtx?.currentTab ? (
                  <tab.component key={tab.id} />
               ) : null;
            })}
         </div>
         <>{children}</>
      </div>
   );
};

export default Layout;
