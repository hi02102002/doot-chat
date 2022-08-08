import { PrivateRoute, routes } from '@/routes';
import { Route, Routes } from 'react-router-dom';
import { Layout, ToastContainer } from './components';
import { generateKeywords } from './utils';

const App = () => {
   generateKeywords('asfasdf');
   generateKeywords('Vo Hoang Huy');

   return (
      <div>
         <ToastContainer />
         <Routes>
            {routes.map((route) => {
               if (route.isPrivate && route.layout) {
                  return (
                     <Route
                        path={route.link}
                        element={
                           <PrivateRoute>
                              <Layout>
                                 <route.component />
                              </Layout>
                           </PrivateRoute>
                        }
                        key={route.id}
                     />
                  );
               } else if (route.isPrivate && !route.layout) {
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
               } else if (!route.isPrivate && route.layout) {
                  return (
                     <Route
                        path={route.link}
                        element={
                           <Layout>
                              <route.component />
                           </Layout>
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
