import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './slices/themeConfigSlice';
import authSlice from './slices/authSlice';
import blogSlice from './slices/blogSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authSlice, // Combine auth directly here
    blogs: blogSlice,
});

const store = configureStore({
    reducer: rootReducer, // Use rootReducer here without nesting
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
