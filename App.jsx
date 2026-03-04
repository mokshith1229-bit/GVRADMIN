
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Products from './components/Products';
import Delivery from './components/Delivery';
import Categories from './components/Categories';
import Discounts from './components/Discounts';
import Analytics from './components/Analytics';
import Audience from './components/Audience';
import Appearance from './components/Appearance';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    BarChart3,
    Percent,
    Users,
    Palette,
    Truck
} from 'lucide-react';

// Redux imports
import { selectActiveTab, setActiveTab, addCategory, deleteCategory, selectManualCategories } from './store/slices/appSlice';
import { selectProducts, selectCategories, fetchProducts, toggleProductStatus } from './store/slices/productSlice';
import { fetchOrders } from './store/slices/orderSlice';
import { fetchDashboard } from './store/slices/dashboardSlice';
import { fetchUsers } from './store/slices/userSlice';

const App = () => {
    const dispatch = useDispatch();

    // Global state from Redux
    const activeTab = useSelector(selectActiveTab);
    const products = useSelector(selectProducts);
    const productCategories = useSelector(selectCategories);
    const manualCategories = useSelector(selectManualCategories);

    // Merge: product-derived categories take priority, manual ones fill the gap
    const categories = products.length > 0 ? productCategories : manualCategories;

    // Fetch all data on mount
    React.useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchOrders());
        dispatch(fetchDashboard());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddCategory = (newCategory) => {
        dispatch(addCategory(newCategory));
    };

    const handleDeleteCategory = (categoryToDelete) => {
        dispatch(deleteCategory(categoryToDelete));
    };

    const handleToggleStatus = (productId) => {
        dispatch(toggleProductStatus(productId));
    };

    const handleRefreshProducts = () => {
        dispatch(fetchProducts());
    };

    const navigation = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
        { id: 'delivery', label: 'Delivery', icon: <Truck size={20} /> },
        { id: 'products', label: 'Products', icon: <Package size={20} /> },
        { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
        { id: 'discounts', label: 'Discount', icon: <Percent size={20} /> },
        { id: 'audience', label: 'Audience', icon: <Users size={20} /> },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={20} /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'orders':
                return <Orders />;
            case 'delivery':
                return <Delivery />;
            case 'products':
                return (
                    <Products
                        onRefresh={handleRefreshProducts}
                        categories={categories}
                        onToggleStatus={handleToggleStatus}
                    />
                );
            case 'categories':
                return (
                    <Categories
                        categories={categories}
                        onAddCategory={handleAddCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onBack={() => dispatch(setActiveTab('products'))}
                    />
                );
            case 'discounts':
                return <Discounts />;
            case 'analytics':
                return <Analytics />;
            case 'audience':
                return <Audience />;
            case 'appearance':
                return <Appearance />;
            default:
                return (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold mb-2">{navigation.find(n => n.id === activeTab)?.label}</h2>
                            <p>This module is currently under development.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar
                items={navigation}
                activeTab={activeTab}
                onSelect={(tab) => dispatch(setActiveTab(tab))}
            />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-[1400px] mx-auto p-6 md:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;
