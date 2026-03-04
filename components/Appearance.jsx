import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Palette,
    Image as ImageIcon,
    Layout,
    Type,
    Monitor,
    Plus,
    Trash2,
    Save,
    RefreshCcw,
    Upload,
    Check,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
    GripVertical,
    Search,
    X,
    Star
} from 'lucide-react';
import { selectProducts } from '../store/slices/productSlice';

const Appearance = () => {
    const products = useSelector(selectProducts);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('branding');

    const [settings, setSettings] = useState({
        logo: '',
        favicon: '',
        primaryColor: '#146eb4',
        secondaryColor: '#0e4f82',
        heroBanner: {
            title: '',
            image: '',
            buttonText: '',
            buttonLink: '',
            active: true
        },
        promotionalBanners: [],
        homepageSections: {
            featuredProducts: true,
            bestSellers: true,
            discounts: true,
            categories: true
        },
        featuredProducts: [],
        trendingProducts: [],
        bestSellerProducts: [],
        categorySettings: {
            showIcons: true,
            categoryOrder: [],
            hiddenCategories: []
        },
        themeMode: 'light',
        typography: {
            headingFont: 'Inter',
            bodyFont: 'Inter'
        }
    });

    const [showProductModal, setShowProductModal] = useState(false);
    const [modalTarget, setModalTarget] = useState(''); // 'featuredProducts', 'trendingProducts', etc.
    const [productSearch, setProductSearch] = useState('');

    useEffect(() => {
        fetchAppearance();
    }, []);

    const fetchAppearance = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/admin/appearance');
            const result = await response.json();
            if (result.success && result.data) {
                // Ensure IDs are extracted if populated
                const data = result.data;
                const normalizeIds = (arr) => arr.map(p => typeof p === 'object' ? p._id : p);

                setSettings({
                    ...data,
                    featuredProducts: normalizeIds(data.featuredProducts || []),
                    trendingProducts: normalizeIds(data.trendingProducts || []),
                    bestSellerProducts: normalizeIds(data.bestSellerProducts || []),
                });
            }
        } catch (error) {
            console.error('Error fetching appearance:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch('http://localhost:5000/admin/appearance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            const result = await response.json();
            if (result.success) {
                alert('Appearance settings saved successfully!');
            }
        } catch (error) {
            console.error('Error saving appearance:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const uploadImage = async (file, path) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.url) {
                // Update nested path
                const newSettings = { ...settings };
                const keys = path.split('.');
                let current = newSettings;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = result.url;
                setSettings(newSettings);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        }
    };

    const handleBannerChange = (index, field, value) => {
        const newBanners = [...settings.promotionalBanners];
        newBanners[index] = { ...newBanners[index], [field]: value };
        setSettings({ ...settings, promotionalBanners: newBanners });
    };

    const addBanner = () => {
        setSettings({
            ...settings,
            promotionalBanners: [
                ...settings.promotionalBanners,
                { title: '', image: '', buttonLink: '', active: true }
            ]
        });
    };

    const removeBanner = (index) => {
        const newBanners = settings.promotionalBanners.filter((_, i) => i !== index);
        setSettings({ ...settings, promotionalBanners: newBanners });
    };

    const toggleProductSelection = (productId) => {
        const currentList = settings[modalTarget];
        if (currentList.includes(productId)) {
            setSettings({ ...settings, [modalTarget]: currentList.filter(id => id !== productId) });
        } else {
            setSettings({ ...settings, [modalTarget]: [...currentList, productId] });
        }
    };

    const sections = [
        { id: 'branding', label: 'Branding', icon: <Palette size={18} /> },
        { id: 'hero', label: 'Hero Banner', icon: <ImageIcon size={18} /> },
        { id: 'banners', label: 'Promotional Banners', icon: <ImageIcon size={18} /> },
        { id: 'homepage', label: 'Home Sections', icon: <Layout size={18} /> },
        { id: 'products', label: 'Featured Products', icon: <Star size={18} /> },
        { id: 'theme', label: 'Theme & Font', icon: <Type size={18} /> },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <RefreshCcw className="animate-spin mb-4" size={32} />
                <p>Loading Appearance Settings...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full -m-6 md:-m-8">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Palette className="text-[#146eb4]" size={24} />
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">Appearance</h1>
                        <p className="text-xs text-gray-500">Customize how your store looks to customers</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchAppearance}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Discard Changes"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-[#146eb4] text-white text-sm font-semibold rounded hover:bg-[#115a95] transition-all shadow-sm disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Navigation Sidebar */}
                <aside className="w-64 border-r bg-gray-50/50 p-6 hidden lg:block">
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeSection === section.id
                                    ? 'bg-white text-[#146eb4] shadow-sm border border-gray-100'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {section.icon}
                                {section.label}
                                {activeSection === section.id && <ChevronRight className="ml-auto" size={14} />}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 bg-white">
                    <div className="max-w-3xl space-y-12">

                        {/* Branding Section */}
                        {activeSection === 'branding' && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Store Branding</h2>
                                    <p className="text-sm text-gray-500">Manage your logo, favicon and brand identity.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Logo Upload */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700">Store Logo</label>
                                        <div
                                            onClick={() => document.getElementById('logo-upload').click()}
                                            className="aspect-[3/1] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#146eb4] hover:bg-blue-50/30 transition-all bg-gray-50/50 relative overflow-hidden group"
                                        >
                                            {settings.logo ? (
                                                <>
                                                    <img src={settings.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Upload className="text-white" size={24} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                                        <ImageIcon className="text-gray-400" size={24} />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">Click to upload logo</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id="logo-upload"
                                            className="hidden"
                                            onChange={(e) => uploadImage(e.target.files[0], 'logo')}
                                        />
                                        <p className="text-[10px] text-gray-400 text-center">Recommended size: 200x60px. PNG or SVG preferred.</p>
                                    </div>

                                    {/* Favicon Upload */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700">Store Favicon</label>
                                        <div
                                            onClick={() => document.getElementById('favicon-upload').click()}
                                            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#146eb4] hover:bg-blue-50/30 transition-all bg-gray-50/50 relative overflow-hidden group mx-auto"
                                        >
                                            {settings.favicon ? (
                                                <>
                                                    <img src={settings.favicon} alt="Favicon" className="w-12 h-12 object-contain" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <Upload className="text-white" size={20} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                                        <ImageIcon className="text-gray-400" size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-medium text-gray-500">Upload Icon</span>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            id="favicon-upload"
                                            className="hidden"
                                            onChange={(e) => uploadImage(e.target.files[0], 'favicon')}
                                        />
                                        <p className="text-[10px] text-gray-400 text-center">Recommended size: 32x32px .ico or .png</p>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Primary Color */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700">Primary Color</label>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                                            <input
                                                type="color"
                                                className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                                value={settings.primaryColor}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-transparent border-none text-sm font-mono focus:ring-0"
                                                value={settings.primaryColor.toUpperCase()}
                                                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400">Used for buttons, links, and highlights.</p>
                                    </div>

                                    {/* Secondary Color */}
                                    <div className="space-y-3">
                                        <label className="text-sm font-semibold text-gray-700">Secondary Color</label>
                                        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                                            <input
                                                type="color"
                                                className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                                                value={settings.secondaryColor}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                className="flex-1 bg-transparent border-none text-sm font-mono focus:ring-0"
                                                value={settings.secondaryColor.toUpperCase()}
                                                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                                            />
                                        </div>
                                        <p className="text-[11px] text-gray-400">Used for secondary accents and gradients.</p>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Hero Banner Section */}
                        {activeSection === 'hero' && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
                                        <button
                                            onClick={() => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, active: !settings.heroBanner.active } })}
                                            className={`p-1 rounded-full transition-colors ${settings.heroBanner.active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}
                                        >
                                            {settings.heroBanner.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500">The main banner displayed at the top of your homepage.</p>
                                </div>

                                <div className="space-y-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <div
                                        onClick={() => document.getElementById('hero-upload').click()}
                                        className="aspect-[21/9] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#146eb4] hover:bg-blue-50/30 transition-all bg-white relative overflow-hidden group shadow-sm"
                                    >
                                        {settings.heroBanner.image ? (
                                            <>
                                                <img src={settings.heroBanner.image} alt="Hero" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Upload className="text-white" size={32} />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="p-4 bg-gray-100 rounded-full">
                                                    <ImageIcon className="text-gray-400" size={32} />
                                                </div>
                                                <span className="text-sm font-medium text-gray-500">Upload Hero Image</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        id="hero-upload"
                                        className="hidden"
                                        onChange={(e) => uploadImage(e.target.files[0], 'heroBanner.image')}
                                    />

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Banner Title</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#146eb4]/10 focus:border-[#146eb4] outline-none"
                                                placeholder="e.g. Summer Collection 2024"
                                                value={settings.heroBanner.title}
                                                onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, title: e.target.value } })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Button Text</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#146eb4]/10 focus:border-[#146eb4] outline-none"
                                                    placeholder="e.g. Shop Now"
                                                    value={settings.heroBanner.buttonText}
                                                    onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, buttonText: e.target.value } })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Button Link</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#146eb4]/10 focus:border-[#146eb4] outline-none font-mono"
                                                    placeholder="e.g. /category/electronics"
                                                    value={settings.heroBanner.buttonLink}
                                                    onChange={(e) => setSettings({ ...settings, heroBanner: { ...settings.heroBanner, buttonLink: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Promotional Banners Section */}
                        {activeSection === 'banners' && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">Promotional Banners</h2>
                                        <p className="text-sm text-gray-500">Secondary banners for discounts, seasons, or categories.</p>
                                    </div>
                                    <button
                                        onClick={addBanner}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 transition-all border"
                                    >
                                        <Plus size={18} />
                                        Add Banner
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {settings.promotionalBanners.map((banner, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 relative group">
                                            <button
                                                onClick={() => removeBanner(index)}
                                                className="absolute -top-3 -right-3 p-2 bg-white border text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div
                                                onClick={() => document.getElementById(`promo-upload-${index}`).click()}
                                                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#146eb4] hover:bg-blue-50/30 transition-all bg-white relative overflow-hidden shadow-sm"
                                            >
                                                {banner.image ? (
                                                    <img src={banner.image} alt="Promo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-gray-300" size={24} />
                                                )}
                                                <input
                                                    type="file"
                                                    id={`promo-upload-${index}`}
                                                    className="hidden"
                                                    onChange={(e) => uploadImage(e.target.files[0], `promotionalBanners.${index}.image`)}
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <input
                                                        type="text"
                                                        className="flex-1 bg-transparent border-none text-md font-bold text-gray-800 placeholder:text-gray-300 focus:ring-0 p-0"
                                                        placeholder="Banner Title"
                                                        value={banner.title}
                                                        onChange={(e) => handleBannerChange(index, 'title', e.target.value)}
                                                    />
                                                    <button
                                                        onClick={() => handleBannerChange(index, 'active', !banner.active)}
                                                        className={`p-1 rounded-full transition-colors ${banner.active ? 'text-green-600' : 'text-gray-400'}`}
                                                    >
                                                        {banner.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                                    </button>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Link / URL</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-[#146eb4]"
                                                        placeholder="e.g. /discounts"
                                                        value={banner.buttonLink}
                                                        onChange={(e) => handleBannerChange(index, 'buttonLink', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {settings.promotionalBanners.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed rounded-2xl text-gray-400 text-sm">
                                            No promotional banners added yet.
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Home Sections Section */}
                        {activeSection === 'homepage' && (
                            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Homepage Sections</h2>
                                    <p className="text-sm text-gray-500">Toggle visibility and reorder your homepage content.</p>
                                </div>

                                <div className="space-y-2">
                                    {Object.entries(settings.homepageSections).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                                            <div className="p-2 cursor-grab text-gray-300 group-hover:text-gray-400">
                                                <GripVertical size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-gray-800 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                            </div>
                                            <button
                                                onClick={() => setSettings({
                                                    ...settings,
                                                    homepageSections: { ...settings.homepageSections, [key]: !value }
                                                })}
                                                className={`p-1 rounded-full transition-colors ${value ? 'text-[#146eb4]' : 'text-gray-300'}`}
                                            >
                                                {value ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] text-gray-400 italic font-medium flex items-center gap-2">
                                    <Monitor size={12} />
                                    Note: Drag to reorder functionality coming soon. Currently only visibility is supported.
                                </p>
                            </section>
                        )}

                        {/* Featured Products Section */}
                        {activeSection === 'products' && (
                            <section className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">Featured Products Settings</h2>
                                    <p className="text-sm text-gray-500">Curate the products showcased on your homepage.</p>
                                </div>

                                {[
                                    { id: 'featuredProducts', label: 'Featured Products', desc: 'Display at the top of homepage' },
                                    { id: 'trendingProducts', label: 'Trending Products', desc: 'Small grid items' },
                                    { id: 'bestSellerProducts', label: 'Best Sellers', desc: 'Most popular items' }
                                ].map((group) => (
                                    <div key={group.id} className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-md font-bold text-gray-800">{group.label}</h3>
                                                <p className="text-xs text-gray-400">{group.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setModalTarget(group.id);
                                                    setShowProductModal(true);
                                                }}
                                                className="text-xs font-bold text-[#146eb4] hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={14} />
                                                Manage List
                                            </button>
                                        </div>

                                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-100">
                                            {settings[group.id].length > 0 ? (
                                                settings[group.id].map(productId => {
                                                    const product = products.find(p => (p._id || p.id) === productId);
                                                    return (
                                                        <div key={productId} className="w-24 shrink-0 space-y-2">
                                                            <div className="aspect-square rounded-lg border bg-gray-50 overflow-hidden relative group">
                                                                <img src={product?.image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                                                                <button
                                                                    onClick={() => toggleProductSelection(productId)}
                                                                    className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                                >
                                                                    <Trash2 className="text-white" size={16} />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] text-gray-700 font-medium truncate">{product?.name || 'Unknown'}</p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="w-full h-24 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-300">
                                                    No products selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Theme & Typography Section */}
                        {activeSection === 'theme' && (
                            <section className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Default Theme Mode</h2>
                                        <p className="text-sm text-gray-500">Choose the initial theme for new visitors.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setSettings({ ...settings, themeMode: 'light' })}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${settings.themeMode === 'light'
                                                ? 'border-[#146eb4] bg-blue-50/50'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="w-16 h-10 bg-white rounded border flex items-center justify-center shadow-sm">
                                                <div className="w-8 h-1 bg-[#146eb4] rounded-full mr-2"></div>
                                                <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">Light Mode</span>
                                            {settings.themeMode === 'light' && <Check className="text-[#146eb4]" size={16} />}
                                        </button>

                                        <button
                                            onClick={() => setSettings({ ...settings, themeMode: 'dark' })}
                                            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${settings.themeMode === 'dark'
                                                ? 'border-[#146eb4] bg-blue-50/50'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="w-16 h-10 bg-gray-900 rounded border border-gray-800 flex items-center justify-center shadow-sm">
                                                <div className="w-8 h-1 bg-white/20 rounded-full mr-2"></div>
                                                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">Dark Mode</span>
                                            {settings.themeMode === 'dark' && <Check className="text-[#146eb4]" size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">Typography</h2>
                                        <p className="text-sm text-gray-500">Set the fonts used throughout your store.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heading Font</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#146eb4] focus:bg-white transition-all appearance-none"
                                                value={settings.typography.headingFont}
                                                onChange={(e) => setSettings({ ...settings, typography: { ...settings.typography, headingFont: e.target.value } })}
                                            >
                                                <option value="Inter">Inter (Modern & Clean)</option>
                                                <option value="Poppins">Poppins (Friendly & Round)</option>
                                                <option value="Roboto">Roboto (Classic & Balanced)</option>
                                                <option value="Outfit">Outfit (Premium & Bold)</option>
                                            </select>
                                            <p className="text-[12px] font-bold mt-2" style={{ fontFamily: settings.typography.headingFont }}>
                                                The Quick Brown Fox Jumps Over The Lazy Dog
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Body Font</label>
                                            <select
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-[#146eb4] focus:bg-white transition-all appearance-none"
                                                value={settings.typography.bodyFont}
                                                onChange={(e) => setSettings({ ...settings, typography: { ...settings.typography, bodyFont: e.target.value } })}
                                            >
                                                <option value="Inter">Inter</option>
                                                <option value="Poppins">Poppins</option>
                                                <option value="Roboto">Roboto</option>
                                                <option value="Open Sans">Open Sans</option>
                                            </select>
                                            <p className="text-[11px] text-gray-500 leading-relaxed" style={{ fontFamily: settings.typography.bodyFont }}>
                                                This is how your standard body text and descriptions will appear on the storefront. It should be easy to read for long periods.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                    </div>
                </main>
            </div>

            {/* Product Selection Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Select Products</h2>
                                <p className="text-xs text-gray-400 mt-1">Select items to display in the section</p>
                            </div>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 border-b bg-gray-50/50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or category..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] transition-all"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {products
                                .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()))
                                .map(product => {
                                    const isSelected = settings[modalTarget].includes(product._id || product.id);
                                    return (
                                        <div
                                            key={product._id || product.id}
                                            onClick={() => toggleProductSelection(product._id || product.id)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                                                ? 'bg-blue-50 border-[#146eb4]'
                                                : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl border bg-white overflow-hidden shrink-0">
                                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-800 truncate">{product.name}</h4>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{product.category}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#146eb4] border-[#146eb4]' : 'border-gray-200'
                                                }`}>
                                                {isSelected && <Check className="text-white" size={14} />}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <div className="px-8 py-6 border-t bg-gray-50/50 flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">
                                {settings[modalTarget].length} products selected
                            </p>
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="px-8 py-2.5 bg-[#146eb4] text-white text-sm font-bold rounded-xl hover:bg-[#115a95] shadow-lg shadow-blue-500/20"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appearance;
