
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Products from './components/Products';
import Delivery from './components/Delivery';
import Categories from './components/Categories';
import Discounts from './components/Discounts';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    BarChart3,
    Percent,
    Users,
    Palette,
    Settings,
    HelpCircle,
    Eye,
    Share2,
    MoreVertical,
    Truck
} from 'lucide-react';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [products, setProducts] = useState([]);

    // Fetch products from backend
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Load products on mount
    React.useEffect(() => {
        fetchProducts();
    }, []);

    const [categories, setCategories] = useState([
        'Dry fruits & nuts, Mixes & nuts',
        'Spices',
        'Dates',
        'Seeds'
    ]);

    const handleAddCategory = (newCategory) => {
        if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        setCategories(categories.filter(cat => cat !== categoryToDelete));
    };

    const handleToggleStatus = (productId) => {
        setProducts(products.map(product =>
            (product._id || product.id) === productId
                ? { ...product, status: product.status === 'Active' ? 'Inactive' : 'Active' }
                : product
        ));
    };

    // Called when a product is added successfully
    const handleRefreshProducts = () => {
        fetchProducts();
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
        { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
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
                // Pass handleRefreshProducts as onRefresh
                return <Products products={products} onRefresh={handleRefreshProducts} categories={categories} onToggleStatus={handleToggleStatus} />;

            case 'categories':
                return <Categories categories={categories} onAddCategory={handleAddCategory} onDeleteCategory={handleDeleteCategory} onBack={() => setActiveTab('products')} />;
            case 'discounts':
                return <Discounts />;
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
                onSelect={setActiveTab}
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
