import { ROUTES, SIDEBAR } from '@/constants';
import { useAuth, useTab } from '@/hooks';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const Sidebar = () => {
   const tabCtx = useTab();
   const authCtx = useAuth();

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
         <ul>
            {SIDEBAR.map((item) => {
               return (
                  <li key={item.id} className="my-2">
                     <button
                        className={cx('sidebar-item', {
                           active: item.type === tabCtx?.currentTab,
                        })}
                        onClick={() => {
                           tabCtx?.chooseTab(item.type);
                        }}
                     >
                        <item.icon />
                     </button>
                  </li>
               );
            })}
         </ul>
         <div className="mt-auto flex items-center justify-center ">
            <div className="my-2">
               <Avatar
                  src={authCtx?.user?.photoURL as string}
                  alt={authCtx?.user?.displayName as string}
                  className="!w-9 !h-9"
               />
            </div>
         </div>
      </aside>
   );
};

export default Sidebar;
