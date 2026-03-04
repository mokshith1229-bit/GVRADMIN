import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import dashboardReducer from './slices/dashboardSlice';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';

export const store = configureStore({
    reducer: {
        products: productReducer,
        orders: orderReducer,
        dashboard: dashboardReducer,
        users: userReducer,
        app: appReducer,
    },
});

export default store;
