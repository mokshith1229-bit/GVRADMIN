import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from '../../api';

// Async thunk to fetch products from backend
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Locally toggle a product's Active/Inactive status (optimistic UI update)
        toggleProductStatus(state, action) {
            const productId = action.payload;
            const product = state.items.find(
                (p) => (p._id || p.id) === productId
            );
            if (product) {
                product.status =
                    product.status === 'Active' ? 'Inactive' : 'Active';
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { toggleProductStatus } = productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

// Derive categories from product list
export const selectCategories = (state) =>
    [...new Set(state.products.items.map((p) => p.category).filter(Boolean))];

export default productSlice.reducer;
