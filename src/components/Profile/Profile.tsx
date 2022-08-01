import { useAuth, useUserInfo } from '@/hooks';
import { AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import { BiCurrentLocation } from 'react-icons/bi';
import Avatar from '../Avatar';

const Profile = () => {
   const authCtx = useAuth();
   const { user, loading } = useUserInfo(authCtx?.user?.uid as string);

   console.log(loading);

   return (
      <div>
         <div className="relative">
            <div
               className="absolute h-full w-full p-4"
               style={{
                  backgroundImage:
                     'linear-gradient(180deg,rgba(0,0,0,.5) 10%,transparent 60%,rgba(0,0,0,.5))',
               }}
            >
               <span className="relative z-[1] text-white text-lg font-medium">
                  My profile
               </span>
            </div>
            <img
               src={user?.bgCover as string}
               alt=""
               className="h-40 w-full object-cover"
            />
         </div>
         <div className="p-6 -mt-12 relative z-[2] pt-2">
            <div className="mb-2 flex items-center justify-center">
               <Avatar
                  src={user?.avatar as string}
                  alt={user?.username as string}
                  className="p-1 bg-[#fafafa] border border-solid border-[#f6f6f9] !w-20 !h-20"
               />
            </div>
            <h5 className="mb-1 text-center text-base font-semibold">
               {user?.username}
            </h5>
            <p className="text-center text-sm text-bs-gray-600">{user?.bio}</p>
         </div>
         <ul className="px-6">
            <li className="flex items-center  gap-2 py-2">
               <AiOutlineUser className="w-4 h-4 " />
               <span>{user?.username}</span>
            </li>
            <li className="flex items-center  gap-2 py-2">
               <AiOutlineMail className="w-4 h-4 " />
               <span>{user?.email}</span>
            </li>
            <li className="flex items-center  gap-2 py-2">
               <BiCurrentLocation className="w-4 h-4 " />
               <span>{user?.address || 'Unknown'}</span>
            </li>
         </ul>
      </div>
   );
};

export default Profile;
