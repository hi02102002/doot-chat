import { useAuth } from '@/hooks';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
   const auth = useAuth();
   const location = useLocation();

   if (!auth?.user) {
      return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
   }

   return children;
};

export default PrivateRoute;
