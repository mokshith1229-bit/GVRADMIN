import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../api';

// Async thunk to fetch & map orders from backend
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/orders`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();

            // Map backend structure to UI shape
            const mappedOrders = data.map((order) => ({
                id: order._id,
                date: new Date(order.createdAt).toLocaleString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }),
                customer: order.customerName,
                itemsCount: order.totalItems || order.products?.length || 0,
                payment: order.paymentMethod,
                paymentStatus: order.status, // Original 'status' from backend is payment status
                status: order.fulfillment_status || 'Pending', // We use fulfillment_status for the UI 'Status'
                amount: order.totalAmount,
                shippingAddress: order.shippingAddress,
                billingAddress: order.billingAddress,
                phone: order.customerPhone,
                products: order.products || [],
            }));

            // Sort newest first by default
            mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
            return mappedOrders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update order status
export const updateOrderStatusAsync = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update order status');
            }

            const data = await response.json();
            return { orderId, newStatus: data.status };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Locally update an order's status (optimistic UI update)
        updateOrderStatus(state, action) {
            const { orderId, newStatus } = action.payload;
            const order = state.items.find((o) => o.id === orderId);
            if (order) {
                order.status = newStatus;
            }
        },
        // Update a specific order in the list with new data
        updateOrder(state, action) {
            const updatedOrder = action.payload;
            const index = state.items.findIndex(o => o.id === updatedOrder.id || o.id === updatedOrder._id);
            if (index !== -1) {
                // Map the updated order back to UI shape if needed, or just merge
                const mappedUpdated = {
                    ...state.items[index],
                    id: updatedOrder._id || updatedOrder.id,
                    customer: updatedOrder.customerName || state.items[index].customer,
                    paymentStatus: updatedOrder.status || state.items[index].paymentStatus,
                    status: updatedOrder.fulfillment_status || updatedOrder.status || state.items[index].status,
                    ...updatedOrder
                };
                // Ensure ID is consistent
                mappedUpdated.id = updatedOrder._id || updatedOrder.id;
                state.items[index] = mappedUpdated;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOrderStatusAsync.pending, (state, action) => {
                // Optimistic update
                const { orderId, newStatus } = action.meta.arg;
                const order = state.items.find((o) => o.id === orderId);
                if (order) {
                    order.status = newStatus;
                }
            })
            .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
                const { orderId, newStatus } = action.payload;
                const order = state.items.find((o) => o.id === orderId);
                if (order) {
                    order.status = newStatus;
                }
            })
            .addCase(updateOrderStatusAsync.rejected, (state, action) => {
                state.error = action.payload;
                // Revert optimistic update (optional but better)
                // In this case, we might need to fetch the order again or store the previous status
                // For simplicity, we'll just log the error for now
                console.error('Failed to update status:', action.payload);
            });
    },
});

export const { updateOrderStatus, updateOrder } = orderSlice.actions;


// Selectors
export const selectOrders = (state) => state.orders.items;
export const selectOrdersStatus = (state) => state.orders.status;
export const selectOrdersError = (state) => state.orders.error;

export default orderSlice.reducer;
