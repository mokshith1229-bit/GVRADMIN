import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_CATEGORIES = ['Dry Fruits & Nuts', 'Spices', 'Dates', 'Seeds'];

const appSlice = createSlice({
    name: 'app',
    initialState: {
        activeTab: 'dashboard',
        manualCategories: DEFAULT_CATEGORIES,
    },
    reducers: {
        setActiveTab(state, action) {
            state.activeTab = action.payload;
        },
        addCategory(state, action) {
            const newCat = action.payload;
            if (!state.manualCategories.includes(newCat)) {
                state.manualCategories.push(newCat);
            }
        },
        deleteCategory(state, action) {
            state.manualCategories = state.manualCategories.filter(
                (cat) => cat !== action.payload
            );
        },
    },
});

export const { setActiveTab, addCategory, deleteCategory } = appSlice.actions;

// Selectors
export const selectActiveTab = (state) => state.app.activeTab;
export const selectManualCategories = (state) => state.app.manualCategories;

export default appSlice.reducer;
