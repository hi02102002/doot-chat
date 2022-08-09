import { ISidebar, ITheme, TICon } from '@/types';
import { AiOutlineMessage, AiOutlineUser } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';
import angry from '../assets/angry.png';
import haha from '../assets/haha.png';
import heart from '../assets/heart.png';
import like from '../assets/like.png';
import sad from '../assets/sad.png';
import wow from '../assets/wow.png';

export const ROUTES = {
   HOME: '/',
   LOGIN: '/login',
   SIGN_UP: '/sign-up',
   FORGOT_PASSWORD: '/forgot-password',
   CHAT: '/:id',
};

export const avatarUrl =
   'https://firebasestorage.googleapis.com/v0/b/chat-app-9b1d1.appspot.com/o/avatar.png?alt=media&token=23eba4ff-40bc-409a-8241-0131500885bf';
export const bgCover =
   'https://firebasestorage.googleapis.com/v0/b/chat-app-9b1d1.appspot.com/o/cover.avif?alt=media&token=f66742e3-ab7a-473b-b9f0-4fa05cf53623';

export const SIDEBAR: Array<ISidebar> = [
   {
      icon: AiOutlineUser,
      id: uuid(),
      name: 'Profile',
      type: 'PROFILE',
   },
   {
      icon: AiOutlineMessage,
      id: uuid(),
      name: 'Chats',
      type: 'CHATS',
   },
   // {
   //    icon: AiOutlineSetting,
   //    id: uuid(),
   //    name: 'Setting',
   //    type: 'SETTING',
   // },
];

export const THEMES: Array<ITheme> = [
   {
      id: uuid(),
      colorHex: 'var(--bs-green)',
      name: 'Green',
      colorRgb: 'var(--bs-green-rgb)',
   },
   {
      id: uuid(),
      colorHex: 'var(--bs-red)',
      name: 'Red',
      colorRgb: 'var(--bs-red-rgb)',
   },
   {
      id: uuid(),
      colorHex: 'var(--bs-orange)',
      name: 'Orange',
      colorRgb: 'var(--bs-orange-rgb)',
   },
   {
      id: uuid(),
      name: 'Yellow',
      colorHex: 'var(--bs-yellow)',
      colorRgb: 'var(--bs-yellow-rgb)',
   },
   {
      id: uuid(),
      name: 'Cyan',
      colorHex: 'var(--bs-cyan)',
      colorRgb: 'var(--bs-cyan-rgb)',
   },
];

export const EMOJI_OBJ = {
   haha,
   heart,
   like,
   wow,
   angry,
   sad,
};

export const EMOJIS: Array<{
   name: TICon;
   id: string;
   icon: string;
}> = [
   {
      name: 'HEART',
      id: uuid(),
      icon: EMOJI_OBJ.heart,
   },
   {
      name: 'WOW',
      id: uuid(),
      icon: EMOJI_OBJ.wow,
   },
   {
      name: 'HAHA',
      id: uuid(),
      icon: EMOJI_OBJ.haha,
   },
   {
      name: 'SAD',
      id: uuid(),
      icon: EMOJI_OBJ.sad,
   },
   {
      name: 'ANGRY',
      id: uuid(),
      icon: EMOJI_OBJ.angry,
   },
   {
      name: 'LIKE',
      id: uuid(),
      icon: EMOJI_OBJ.like,
   },
];

export const BREAK_POINT = {
   Desktops: 1024,
};
