import { ROUTES } from '@/constants';
import { Home, Login, Register } from '@/pages';
import { IRoute } from '@/types';
import { v4 as id } from 'uuid';
export const routes: Array<IRoute> = [
   {
      component: Home,
      link: ROUTES.HOME,
      isPrivate: true,
      id: id(),
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
