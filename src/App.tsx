import { PrivateRoute } from '@/components';
import { routes } from '@/routes';
import { Route, Routes } from 'react-router-dom';

const App = () => {
   return (
      <div>
         <Routes>
            {routes.map((route) => {
               if (route.isPrivate) {
                  return (
                     <Route
                        path={route.link}
                        element={
                           <PrivateRoute>
                              <route.component />
                           </PrivateRoute>
                        }
                        key={route.id}
                     />
                  );
               }

               return (
                  <Route
                     key={route.id}
                     path={route.link}
                     element={<route.component />}
                  />
               );
            })}
         </Routes>
      </div>
   );
};

export default App;
