import { useView } from '@/hooks';
import { ITabContext, TTab } from '@/types';
import React, { createContext, useState } from 'react';

interface Props {
   children: React.ReactNode;
}
export const TabContext = createContext<ITabContext | null>(null);

export const TabProvider: React.FC<Props> = ({ children }) => {
   const { width } = useView();
   const [currentTab, setCurrentTab] = useState<TTab>(
      width > 1024 ? 'CHATS' : ''
   );

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
