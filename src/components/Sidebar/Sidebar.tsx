import { ROUTES, SIDEBAR } from '@/constants';
import { auth } from '@/firebase';
import { useChat, useTab, useView } from '@/hooks';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import { signOut } from 'firebase/auth';
import { AiOutlineLogout } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
   const tabCtx = useTab();
   const chatCtx = useChat();
   const { width } = useView();
   const navigate = useNavigate();

   return (
      <aside className={cx('sidebar')}>
         <div className={cx('sidebar-logo')}>
            <Link to={ROUTES.HOME} className="block">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
               >
                  <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z"></path>
               </svg>
            </Link>
         </div>
         <ul className="flex items-center gap-4 lg:flex-col  lg:gap-0">
            {SIDEBAR.map((item) => {
               return (
                  <li key={item.id} className="my-2 w-full">
                     <Tippy
                        content={item.name}
                        placement={width < 1024 ? 'top' : 'right'}
                     >
                        <button
                           className={cx('sidebar-item', {
                              active: item.type === tabCtx?.currentTab,
                           })}
                           onClick={() => {
                              tabCtx?.chooseTab(item.type);
                              if (width < 1024) {
                                 chatCtx?.selectConversation?.(null);
                                 navigate(ROUTES.HOME);
                              }
                           }}
                        >
                           <item.icon />
                        </button>
                     </Tippy>
                  </li>
               );
            })}
         </ul>
         <div className="mt-auto flex items-center justify-center ">
            <div className="my-2">
               <Tippy
                  content="Log out"
                  placement={width < 1024 ? 'top' : 'right'}
               >
                  <button
                     className={cx('sidebar-item')}
                     onClick={async () => {
                        await signOut(auth);
                     }}
                  >
                     <AiOutlineLogout />
                  </button>
               </Tippy>
            </div>
         </div>
      </aside>
   );
};

export default Sidebar;
