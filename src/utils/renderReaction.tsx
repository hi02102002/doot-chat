import { EMOJI_OBJ } from '@/constants';
import { IReact } from '@/types';

export const renderReaction = (reaction: IReact) => {
   switch (reaction.icon) {
      case 'ANGRY':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.angry}
               alt=""
            />
         );
      case 'HAHA':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.haha}
               alt=""
            />
         );
      case 'HEART':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.heart}
               alt=""
            />
         );
      case 'LIKE':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.like}
               alt=""
            />
         );
      case 'SAD':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.sad}
               alt=""
            />
         );
      case 'WOW':
         return (
            <img
               className="w-full h-full object-cover"
               src={EMOJI_OBJ.wow}
               alt=""
            />
         );
      default:
         return null;
   }
};
