import { Sidebar } from '@/components';
import { TABS } from '@/constants';
import { useTab } from '@/hooks';
import React from 'react';

const Home: React.FC = () => {
   const tabCtx = useTab();

   return (
      <div className="flex">
         <Sidebar />
         <div className="min-w-[300px] max-w-[300px]">
            {TABS.map((tab) => {
               return tab.type === tabCtx?.currentTab ? (
                  <tab.component key={tab.id} />
               ) : null;
            })}
         </div>
      </div>
   );
};

export default Home;
