import { ITabContext, TTab } from '@/types';
import React, { createContext, useState } from 'react';

interface Props {
   children: React.ReactNode;
}
export const TabContext = createContext<ITabContext | null>(null);

export const TabProvider: React.FC<Props> = ({ children }) => {
   const [currentTab, setCurrentTab] = useState<TTab>('CHATS');

   const handleChooseTab = (type: TTab) => {
      setCurrentTab(type);
   };

   return (
      <TabContext.Provider
         value={{
            chooseTab: handleChooseTab,
            currentTab,
         }}
      >
         {children}
      </TabContext.Provider>
   );
};
