import { ROUTES } from '@/constants';
import { Chat, Home, Login, Register } from '@/pages';
import { IRoute } from '@/types';
import { v4 as id } from 'uuid';
export const routes: Array<IRoute> = [
   {
      component: Home,
      link: ROUTES.HOME,
      isPrivate: true,
      id: id(),
      layout: true,
   },
   {
      component: Chat,
      id: id(),
      isPrivate: true,
      link: ROUTES.CHAT,
      layout: true,
   },
   {
      component: Login,
      link: ROUTES.LOGIN,
      isPrivate: false,
      id: id(),
   },
   {
      component: Register,
      link: ROUTES.SIGN_UP,
      isPrivate: false,
      id: id(),
   },
];
