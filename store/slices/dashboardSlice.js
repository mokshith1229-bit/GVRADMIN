import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../api';

// Async thunk to fetch dashboard data
export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/dashboard`);
            if (!response.ok) throw new Error('Failed to fetch dashboard');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        data: null,
        chartData: [],        // processed sales chart data
        ordersChartData: [],  // processed orders chart data
        status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;

                // Process sales chart data
                if (action.payload.salesData && Array.isArray(action.payload.salesData)) {
                    state.chartData = action.payload.salesData.map((item) => {
                        const date = new Date(item._id);
                        return {
                            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                            sales: item.totalSales || 0,
                        };
                    });
                }

                // Process orders chart data
                if (action.payload.ordersData && Array.isArray(action.payload.ordersData)) {
                    state.ordersChartData = action.payload.ordersData.map((item) => {
                        const date = new Date(item._id);
                        return {
                            name: date.toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                            }),
                            orders: item.orderCount || 0,
                        };
                    });
                }
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectDashboardData = (state) => state.dashboard.data;
export const selectChartData = (state) => state.dashboard.chartData;
export const selectOrdersChartData = (state) => state.dashboard.ordersChartData;
export const selectDashboardStatus = (state) => state.dashboard.status;

export default dashboardSlice.reducer;
