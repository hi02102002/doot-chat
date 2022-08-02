import { ChatContext } from '@/contexts';
import { useContext } from 'react';

export const useChat = () => useContext(ChatContext);
