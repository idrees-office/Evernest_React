import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './slices/themeConfigSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    auth: authReducer // Combine auth directly here
});

const store = configureStore({
    reducer: rootReducer, // Use rootReducer here without nesting
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;