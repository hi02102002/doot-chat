import { ToastContext } from '@/contexts';
import { useContext } from 'react';
export const useToast = () => useContext(ToastContext);
