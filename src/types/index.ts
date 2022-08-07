import { User } from 'firebase/auth';
import { FieldValue, Timestamp } from 'firebase/firestore';
import React, { ButtonHTMLAttributes } from 'react';
import { IconType } from 'react-icons';

export interface IToast {
   id: string;
   type: 'success' | 'error' | 'warning';
   content: string;
}

export interface IRoute {
   link: string;
   component: React.FC;
   isPrivate: boolean;
   id: string;
   children?: Array<IRoute>;
   layout?: boolean;
}

export type TMessage = 'FILE' | 'IMAGE' | 'AUDIO' | 'TEXT' | 'VIDEO';

export type TTab = 'PROFILE' | 'CHATS' | 'SETTING';

export type TConversation = 'GROUP' | '1-1';

export interface IUser {
   username: string;
   id: string;
   email: string;
   address: string;
   avatar?: string;
   bgCover?: string;
   bio: string;
   createdAt: Timestamp | FieldValue;
}

export interface IMessage {
   content: string;
   id: string;
   type: TMessage;
   createdAt: string;
   isUnsent: boolean;
   senderId: string;
   reply: IMessage | null;
   nameFile?: string;
}

export interface IConversation {
   lastMessage: IMessage | null;
   members: Array<string>; // array id member
   id: string;
   type: TConversation;
   createdAt: string;
   conversationName: string;
   conversationAvatar: {
      url: string;
      nameFile: string;
   } | null;
   theme: ITheme;
   usersRemoveConversation: Array<string>;
}
export interface ITheme {
   id: string;
   colorHex: string;
   name: string;
   colorRgb: string;
}

export interface IAuthContext {
   user: User | null;
}

export interface IToastContext {
   toasts: Array<IToast>;
   addToast: (toast: IToast) => void;
   removeToast: (toastId: string) => void;
}

export interface ISidebar {
   id: string;
   name: string;
   icon: IconType;
   type: TTab;
}

export interface ITabContext {
   currentTab: TTab;
   chooseTab: (type: TTab) => void;
}

export interface IChatContext {
   conversations: Array<IConversation>;
   currentConversation: IConversation | null | undefined;
   selectConversation?: (conversation: IConversation | null) => void;
   loading: boolean;
}

export interface ITab {
   type: TTab;
   component: () => JSX.Element | null;
   id: string;
}

export interface PropsButton extends ButtonHTMLAttributes<HTMLButtonElement> {
   children?: React.ReactNode;
   isLoading?: boolean;
   typeBtn?: '' | 'primary' | 'secondary' | 'sort-primary';
   classNameSpiner?: string;
}

export interface IFile {
   name: string;
   type: TMessage;
   id: string;
   url: string;
}
