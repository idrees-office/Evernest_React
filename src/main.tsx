import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import 'react-perfect-scrollbar/dist/css/styles.css';
import './tailwind.css';
import './i18n';
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
         <Suspense>
             <Provider store={store}>
                <RouterProvider router={router} />
            </Provider> 
        </Suspense> 
    </React.StrictMode>
);

