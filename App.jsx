import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
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
    Truck,
    Menu,
    X
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
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const products = useSelector(selectProducts);
    const productCategories = useSelector(selectCategories);
    const manualCategories = useSelector(selectManualCategories);

    // Merge product-derived categories with manually added ones (deduplicated)
    const categories = [...new Set([...productCategories, ...manualCategories])];

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
                onSelect={(tab) => {
                    dispatch(setActiveTab(tab));
                    setIsMobileSidebarOpen(false); // Close sidebar on selection (mobile)
                }}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
            <main className="flex-1 overflow-y-auto relative">
                {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-[#1e2640] text-white px-4 py-3 shadow-md">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-sm font-bold tracking-wide uppercase">
                            {navigation.find(n => n.id === activeTab)?.label || 'Omni Admin'}
                        </h1>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">G</span>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto p-4 md:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default App;
