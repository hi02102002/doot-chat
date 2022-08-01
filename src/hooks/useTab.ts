import { TabContext } from '@/contexts';
import { useContext } from 'react';

export const useTab = () => useContext(TabContext);
