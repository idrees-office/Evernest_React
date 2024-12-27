import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './slices/themeConfigSlice';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';
import newsSlice from './slices/newsSlice';
import DeveloperSlice from './slices/developerSlice';
import AmenitiesSlice from './slices/amenitiesSlice';
import DashboardSlice from './slices/dashboardSlice';
import LeadSlice from './slices/leadsSlice';



const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice, // Combine auth directly here
    blogs: blogSlice,
    news: newsSlice,
    developers: DeveloperSlice,
    amenitiesdata: AmenitiesSlice,
    dashboardslice :  DashboardSlice,
    leadslices :  LeadSlice,

});

const store = configureStore({
    reducer: rootReducer, // Use rootReducer here without nesting
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
