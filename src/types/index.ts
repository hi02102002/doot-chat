import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import React from 'react';

export interface IRoute {
   link: string;
   component: React.FC;
   isPrivate: boolean;
   id: string;
}

export type TMessage = 'FILE' | 'IMAGE' | 'AUDIO' | 'GIF' | 'TEXT';

export interface IUser {
   username: string;
   id: string;
   email: string;
   address: string;
   avatar?: string;
   bgCover?: string;
   bio: string;
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
