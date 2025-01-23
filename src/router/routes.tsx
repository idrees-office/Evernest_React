import { lazy } from 'react';
const Analytics = lazy(() => import('../pages/Analytics'));
const LoginBoxed = lazy(() => import('../pages/Authentication/LoginBoxed'));
const RegisterBoxed = lazy(() => import('../pages/Authentication/RegisterBoxed'));
const UnlockBoxed = lazy(() => import('../pages/Authentication/UnlockBox'));
const RecoverIdBoxed = lazy(() => import('../pages/Authentication/RecoverIdBox'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const UnlockCover = lazy(() => import('../pages/Authentication/UnlockCover'));
const Error = lazy(() => import('../components/Error'));
const BlogCreate = lazy(() => import('../pages/Blogs/Create'));
const BlogList = lazy(() => import('../pages/Blogs/list'));
const NewsCreate = lazy(() => import('../pages/news/create'));
const NewsList = lazy(() => import('../pages/news/list'));
const CreateDevelopers = lazy(() => import('../pages/developers/create'));
const ListDevelopers = lazy(() => import('../pages/developers/list'));
const ListAmenities = lazy(() => import('../pages/amenities/list'));
const DashboardBox = lazy(() => import('../pages/dashboard/dashboard'));
const Users = lazy(() => import('../pages/Users/Users'));
import ProtectedRoute from '../components/ProtectedRoute';
const Assign = lazy(() => import('../pages/leads/assign'));

const routes = [
    {
        path: '/',
        type: 'protected',
        // element: <Index />,
        element: <DashboardBox />,

    },
    {
        path: 'pages/leads/assign',
        type: 'protected',
        element : <Assign/>,
        layout: 'default',
    },
    {
        path: '/auth/cover-login',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: 'pages/blogs/create/:id?',
        type: 'protected',
        element : <BlogCreate/>,
        layout: 'default',
    },
    {
        path: 'pages/blogs/list',
        type: 'protected',
        element : <BlogList/>,
        layout: 'default',
    },
    {
        path: 'pages/news/create/:id?',
        type: 'protected',
        element : <NewsCreate/>,
        layout: 'default',
    },
    {
        path: 'pages/news/list',
        type: 'protected',
        element : <NewsList/>,
        layout: 'default',
    },

    {
        path: 'pages/developers/create/:id?',
        type: 'protected',
        element : <CreateDevelopers/>,
        layout: 'default',
    },
    {
        path: 'pages/developers/list',
        type: 'protected',
        element : <ListDevelopers/>,
        layout: 'default',
    },
    {
        path: 'pages/amenities/list',
        type: 'protected',
        element : <ListAmenities/>,
        layout: 'default',
    },

    {
        path: 'users',
        type: 'protected',
        element : <Users/>,
        layout: 'default',
    },
    

    {
        path: '*',
        element:  ( <ProtectedRoute> <Error /> </ProtectedRoute> ),
        layout: 'blank',
    },
];

export { routes };
