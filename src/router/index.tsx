import { createBrowserRouter } from 'react-router-dom';
// import { createHashRouter } from 'react-router-dom';
import BlankLayout from '../components/Layouts/BlankLayout';
import DefaultLayout from '../components/Layouts/DefaultLayout';
import Header from '../components/Layouts/Header';
import { routes } from './routes';
import ProtectedRoute from '../components/ProtectedRoute';

const finalRoutes = routes.map((route) => {
    let element;
    if (route.layout === 'blank') {
        element = <BlankLayout>{route.element}</BlankLayout>;
    } else {
        element = <DefaultLayout>{route.element}</DefaultLayout>;
    }
    if (route.type === 'protected') {
        element = <ProtectedRoute>{element}</ProtectedRoute>;
    }
    return {
        ...route,
        element,
    };
});
const router = createBrowserRouter(finalRoutes);
export default router;