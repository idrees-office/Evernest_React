// import React, { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import DefaultLayout from '../components/Layouts/DefaultLayout';
// import BlankLayout from '../components/Layouts/BlankLayout';


// interface ProtectedRouteProps {
//     element: ReactNode;
//     layout: 'blank' | 'default';
//   }

//   const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, layout }) => {
//     const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

//     if (!isAuthenticated && layout !== 'blank') {
//       return <Navigate to="/auth/cover-login" replace />;
//     }
  
//     return layout === 'blank' ? <BlankLayout>{element}</BlankLayout> : <DefaultLayout>{element}</DefaultLayout>;
//   };
  
//   export default ProtectedRoute;


import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import BlankLayout from '../components/Layouts/BlankLayout';


interface ProtectedRouteProps {
  element: ReactNode;
  layout: 'blank' | 'default';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, layout }) => {

  console.log(element);

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);


  // Redirect to login if the user is not authenticated and the route is not in the "blank" layout
  if (!isAuthenticated && layout === 'default') {
    return <Navigate to="/auth/cover-login" replace />;
  }

  // Render the appropriate layout based on the layout prop
  if (layout === 'blank') {
    return <BlankLayout>{element}</BlankLayout>;
  }
  return <DefaultLayout>{element}</DefaultLayout>;
};

export default ProtectedRoute;

