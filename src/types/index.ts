import { User } from 'firebase/auth';
import { FieldValue, Timestamp } from 'firebase/firestore';
import React from 'react';
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
}

export type TMessage = 'FILE' | 'IMAGE' | 'AUDIO' | 'GIF' | 'TEXT';

export type TTab = 'PROFILE' | 'CHATS' | 'SETTING';

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

export interface IMessageInput {
   content: string;
   id: string;
   type: TMessage;
   createdAt: Timestamp;
   isUnsent: boolean;
   senderId: string;
}

export interface IMessage extends IMessageInput {
   user: IUser;
}

export interface IConversation {
   lastMessage: IMessage | null;
   members: Array<string>; // array id member
   id: string;
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

export interface ITab {
   type: TTab;
   component: () => JSX.Element;
   id: string;
}
