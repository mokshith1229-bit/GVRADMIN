
import React, { useState, useEffect } from 'react';
import {
    Plus,
    X,
    ChevronLeft,
    ChevronRight,
    Percent,
    Banknote,
    Users,
    Truck,
    Gift,
    Award,
    Info,
    Calendar,
    Clock,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

const Discounts = () => {
    const [step, setStep] = useState('empty'); // 'empty', 'select_type', 'create_form'
    const [couponType, setCouponType] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        couponCode: '',
        usageLimit: 'Only once',
        maxUsage: 'Unlimited',
        description: '',
        discountValue: '',
        minOrderCondition: 'Order value',
        minOrderValue: '',
        maxDiscount: '',
        applyOn: 'All products',
        specificItems: [],
        buyX: '',
        getY: '',
        limitFreeItems: false,
        freebieType: 'On every purchase',
        freebieItem: '',
        functionality: {
            showToCustomer: true,
            onlinePayments: false,
            newCustomers: false,
            autoApply: false,
            applicableWithOthers: false
        },
        startDate: '',
        startTime: '',
        hasEndDate: false,
        endDate: '',
        endTime: ''
    });

    const [editingId, setEditingId] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:5000/coupons');
            const data = await response.json();
            setCoupons(data);
            if (data.length > 0) {
                setStep('list');
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCoupon = async () => {
        try {
            const dataToSave = {
                ...formData,
                couponType,
                validity: {
                    startDate: formData.startDate,
                    startTime: formData.startTime,
                    hasEndDate: formData.hasEndDate,
                    endDate: formData.endDate,
                    endTime: formData.endTime
                }
            };

            const url = editingId
                ? `http://localhost:5000/coupons/${editingId}`
                : 'http://localhost:5000/coupons';

            const response = await fetch(url, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            if (response.ok) {
                alert(`Coupon "${formData.couponCode}" ${editingId ? 'updated' : 'created'} successfully!`);
                fetchCoupons();
                setStep('list');
                setEditingId(null);
                // Reset form
                setFormData({
                    couponCode: '',
                    usageLimit: 'Only once',
                    maxUsage: 'Unlimited',
                    description: '',
                    discountValue: '',
                    minOrderCondition: 'Order value',
                    minOrderValue: '',
                    maxDiscount: '',
                    applyOn: 'All products',
                    specificItems: [],
                    buyX: '',
                    getY: '',
                    limitFreeItems: false,
                    freebieType: 'On every purchase',
                    freebieItem: '',
                    functionality: {
                        showToCustomer: true,
                        onlinePayments: false,
                        newCustomers: false,
                        autoApply: false,
                        applicableWithOthers: false
                    },
                    startDate: '',
                    startTime: '',
                    hasEndDate: false,
                    endDate: '',
                    endTime: ''
                });
            } else {
                const err = await response.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            alert('Failed to connect to backend');
        }
    };

    const handleEditClick = (coupon) => {
        setEditingId(coupon._id);
        setCouponType(coupon.couponType);
        setFormData({
            couponCode: coupon.couponCode,
            usageLimit: coupon.usageLimit,
            maxUsage: coupon.maxUsage,
            description: coupon.description || '',
            discountValue: coupon.discountValue,
            minOrderCondition: coupon.minOrderCondition || 'Order value',
            minOrderValue: coupon.minOrderValue,
            maxDiscount: coupon.maxDiscount,
            applyOn: coupon.applyOn,
            specificItems: coupon.specificItems || [],
            buyX: coupon.buyX,
            getY: coupon.getY,
            limitFreeItems: false, // Assuming default as it might not be in model
            freebieType: 'On every purchase', // Default
            freebieItem: coupon.freebieItem,
            functionality: coupon.functionality,
            startDate: coupon.validity?.startDate ? new Date(coupon.validity.startDate).toISOString().split('T')[0] : '',
            startTime: coupon.validity?.startTime || '',
            hasEndDate: coupon.validity?.hasEndDate,
            endDate: coupon.validity?.endDate ? new Date(coupon.validity.endDate).toISOString().split('T')[0] : '',
            endTime: coupon.validity?.endTime || ''
        });
        setStep('create_form');
    };

    const [isFunctionalityOpen, setIsFunctionalityOpen] = useState(true); // Open by default for better visibility
    const [isValidityOpen, setIsValidityOpen] = useState(true);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleFunctionality = (field) => {
        setFormData(prev => ({
            ...prev,
            functionality: {
                ...prev.functionality,
                [field]: !prev.functionality[field]
            }
        }));
    };

    const isFormValid = () => {
        if (!formData.couponCode || formData.couponCode.length < 3) return false;

        switch (couponType) {
            case 'percentage':
            case 'flat':
                return !!formData.discountValue && !!formData.minOrderValue;
            case 'buy_x_get_y':
                return !!formData.buyX && !!formData.getY;
            case 'freebie':
                return !!formData.freebieItem;
            case 'free_shipping':
                return true;
            default:
                return false;
        }
    };

    const couponTypes = [
        { id: 'percentage', title: 'Percentage discount', description: 'Offer a percentage discount to your customers.', icon: <Percent className="text-orange-500" />, bgColor: 'bg-orange-50' },
        { id: 'flat', title: 'Flat discount', description: 'Offer a fixed discount to your customers.', icon: <Banknote className="text-green-500" />, bgColor: 'bg-green-50' },
        { id: 'buy_x_get_y', title: 'Buy X Get Y Free', description: 'Offer FREE products on purchase of certain number of items.', icon: <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">+1</div>, bgColor: 'bg-indigo-50' },
        { id: 'freebie', title: 'Freebie', description: 'Offer Free item on every purchase or above a certain amount.', icon: <Gift className="text-pink-500" />, bgColor: 'bg-pink-50' },
        { id: 'free_shipping', title: 'Free shipping', description: 'Offer free shipping to your customers.', icon: <Truck className="text-amber-500" />, bgColor: 'bg-amber-50' },
        { id: 'loyalty', title: 'Loyalty points', description: 'Offer loyalty on every purchase or above a certain amount.', icon: <Award className="text-magenta-500" />, bgColor: 'bg-fuchsia-50' },
    ];

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                <div className="bg-blue-500 w-24 h-16 rounded-lg flex items-center justify-center transform -rotate-12 shadow-lg">
                    <Percent className="text-white w-10 h-10" />
                </div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Get more sales with coupons</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
                Now you can create and share coupons for your store to get more and more orders on your store.
            </p>
            <button
                onClick={() => setStep('select_type')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
                Create coupon
            </button>
            <button className="mt-4 text-blue-600 font-medium hover:underline text-sm">
                Learn more about coupons
            </button>
        </div>
    );

    const renderTypeSelection = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Select coupon type</h3>
                    <button onClick={() => setStep('empty')} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-2">
                    {couponTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => {
                                setCouponType(type.id);
                                setStep('create_form');
                            }}
                            className="w-full flex items-center p-4 hover:bg-gray-50 transition-colors rounded-lg group"
                        >
                            <div className={`w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                                {type.icon}
                            </div>
                            <div className="flex-1 text-left">
                                <h4 className="font-bold text-gray-800">{type.title}</h4>
                                <p className="text-sm text-gray-500 leading-tight">{type.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const AccordionItem = ({ title, children, isOpen, onToggle }) => (
        <div className="bg-white border rounded-lg overflow-hidden mb-4 shadow-sm">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center">
                    <span className="font-bold text-gray-800 italic text-sm">{title}</span>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
            </button>
            {isOpen && <div className="p-6 border-t">{children}</div>}
        </div>
    );

    const renderCreateForm = () => {
        const typeInfo = couponTypes.find(t => t.id === couponType);
        const isValid = isFormValid();

        return (
            <div className="min-h-screen pb-20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 -mx-6 -mt-6 border-b sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center">
                        <button onClick={() => setStep('select_type')} className="mr-4 text-gray-600 hover:text-gray-900">
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Create coupon</h2>
                            <div className="flex items-center text-xs text-blue-600 cursor-pointer">
                                <span>{typeInfo?.title}</span>
                                <ChevronDown size={14} className="ml-1" />
                            </div>
                        </div>
                    </div>
                    <button
                        disabled={!isValid}
                        className={`font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                            }`}
                        onClick={handleCreateCoupon}
                    >
                        {editingId ? 'Save Changes' : 'Create coupon'}
                    </button>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Coupon Details Section */}
                    <div className="bg-white border rounded-lg shadow-sm">
                        <div className="p-4 border-b text-sm italic font-bold text-gray-800">
                            Coupon Details
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.couponCode}
                                            onChange={(e) => handleInputChange('couponCode', e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code (min 3 characters)"
                                            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            Max Count of Coupon Usage <Info size={14} className="ml-1 text-gray-400" />
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.maxUsage}
                                                onChange={(e) => handleInputChange('maxUsage', e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option>Unlimited</option>
                                                <option>Limited</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Coupon description (helps sellers understand the offer)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Enter coupon description"
                                            className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    {/* Conditional Field based on Type */}
                                    {couponType === 'percentage' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount percent <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.discountValue}
                                                    onChange={(e) => handleInputChange('discountValue', e.target.value)}
                                                    placeholder="Enter percentage"
                                                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                        </div>
                                    )}

                                    {couponType === 'flat' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Discount amount <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    value={formData.discountValue}
                                                    onChange={(e) => handleInputChange('discountValue', e.target.value)}
                                                    placeholder="Enter value"
                                                    className="w-full border rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {couponType === 'buy_x_get_y' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Buy <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.buyX}
                                                        onChange={(e) => handleInputChange('buyX', e.target.value)}
                                                        placeholder="Eg. 2"
                                                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-12"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">item</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Get <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.getY}
                                                        onChange={(e) => handleInputChange('getY', e.target.value)}
                                                        placeholder="Eg. 1"
                                                        className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none pr-16"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">item FREE</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {couponType === 'freebie' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Provide Freebie <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex space-x-6">
                                                    <label className="flex items-center cursor-pointer group" onClick={() => handleInputChange('freebieType', 'On every purchase')}>
                                                        <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 mr-2 transition-colors ${formData.freebieType === 'On every purchase' ? 'border-blue-600 bg-white' : 'border-gray-300'}`}>
                                                            {formData.freebieType === 'On every purchase' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                                        </div>
                                                        <span className={`text-sm font-medium ${formData.freebieType === 'On every purchase' ? 'text-gray-800' : 'text-gray-500'}`}>On every purchase</span>
                                                    </label>
                                                    <label className="flex items-center cursor-pointer group" onClick={() => handleInputChange('freebieType', 'Above certain amount')}>
                                                        <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 mr-2 transition-colors ${formData.freebieType === 'Above certain amount' ? 'border-blue-600 bg-white' : 'border-gray-300'}`}>
                                                            {formData.freebieType === 'Above certain amount' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                                        </div>
                                                        <span className={`text-sm font-medium ${formData.freebieType === 'Above certain amount' ? 'text-gray-800' : 'text-gray-500'}`}>Above certain amount</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Freebie <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.freebieItem}
                                                    onChange={(e) => handleInputChange('freebieItem', e.target.value)}
                                                    placeholder="Add freebie"
                                                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {couponType !== 'freebie' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Order Condition
                                            </label>
                                            <div className="flex space-x-6">
                                                <label className="flex items-center cursor-pointer group" onClick={() => handleInputChange('minOrderCondition', 'Order value')}>
                                                    <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 mr-2 transition-colors ${formData.minOrderCondition === 'Order value' ? 'border-blue-600 bg-white' : 'border-gray-300'}`}>
                                                        {formData.minOrderCondition === 'Order value' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                                    </div>
                                                    <span className={`text-sm font-medium ${formData.minOrderCondition === 'Order value' ? 'text-gray-800' : 'text-gray-500'}`}>Order value</span>
                                                </label>
                                                <label className="flex items-center cursor-pointer group" onClick={() => handleInputChange('minOrderCondition', 'Order quantity')}>
                                                    <div className={`w-5 h-5 flex items-center justify-center rounded-full border-2 mr-2 transition-colors ${formData.minOrderCondition === 'Order quantity' ? 'border-blue-600 bg-white' : 'border-gray-300'}`}>
                                                        {formData.minOrderCondition === 'Order quantity' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                                                    </div>
                                                    <span className={`text-sm font-medium ${formData.minOrderCondition === 'Order quantity' ? 'text-gray-800' : 'text-gray-500'}`}>Order quantity</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {couponType !== 'freebie' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Minimum {formData.minOrderCondition === 'Order value' ? 'order value' : 'order quantity'} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                {formData.minOrderCondition === 'Order value' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>}
                                                <input
                                                    type="number"
                                                    value={formData.minOrderValue}
                                                    onChange={(e) => handleInputChange('minOrderValue', e.target.value)}
                                                    placeholder="Enter amount"
                                                    className={`w-full border rounded-lg p-2.5 ${formData.minOrderCondition === 'Order value' ? 'pl-8' : ''} text-sm focus:ring-2 focus:ring-blue-500 outline-none`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            Usage limit per customer <span className="text-red-500">*</span> <Info size={14} className="ml-1 text-gray-400" />
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.usageLimit}
                                                onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option>Only once</option>
                                                <option>Multiple times</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {couponType === 'percentage' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Maximum discount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                                <input
                                                    type="number"
                                                    value={formData.maxDiscount}
                                                    onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                                                    placeholder="Enter amount"
                                                    className="w-full border rounded-lg p-2.5 pl-8 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Apply coupon on
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.applyOn}
                                                onChange={(e) => handleInputChange('applyOn', e.target.value)}
                                                className="w-full border rounded-lg p-2.5 text-sm appearance-none bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option>All products</option>
                                                <option>Specific products</option>
                                                <option>Specific collections</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {(formData.applyOn === 'Specific products' || formData.applyOn === 'Specific collections') && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Search & Select {formData.applyOn.replace('Specific ', '')}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`Type to add ${formData.applyOn.toLowerCase()}...`}
                                                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                                        const newItem = e.target.value.trim();
                                                        if (!formData.specificItems.includes(newItem)) {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                specificItems: [...prev.specificItems, newItem]
                                                            }));
                                                        }
                                                        e.target.value = '';
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.specificItems.map((item, index) => (
                                                    <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                                                        {item}
                                                        <button
                                                            onClick={() => setFormData(prev => ({ ...prev, specificItems: prev.specificItems.filter((_, i) => i !== index) }))}
                                                            className="ml-1 hover:text-blue-900"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Press Enter to add items.</p>
                                        </div>
                                    )}

                                    {couponType === 'buy_x_get_y' && (
                                        <div className="flex items-start pt-4">
                                            <input
                                                type="checkbox"
                                                checked={formData.limitFreeItems}
                                                onChange={(e) => handleInputChange('limitFreeItems', e.target.checked)}
                                                className="mt-1 mr-2 rounded border-gray-300 text-blue-600 h-4 w-4"
                                            />
                                            <span className="text-sm text-gray-600 leading-tight">Limit the number of times a user will get FREE items in a single order.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    <AccordionItem
                        title="Coupon functionality"
                        isOpen={isFunctionalityOpen}
                        onToggle={() => setIsFunctionalityOpen(!isFunctionalityOpen)}
                    >
                        <div className="space-y-4">
                            {[
                                { id: 'showToCustomer', label: 'Show coupon to customer', tooltip: true },
                                { id: 'onlinePayments', label: 'Valid only for online payments', tooltip: true },
                                { id: 'newCustomers', label: 'Valid only for new customers', tooltip: true },
                                { id: 'autoApply', label: 'Auto apply coupon', tooltip: true },
                                { id: 'applicableWithOthers', label: 'Applicable with other coupons', tooltip: true }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 mr-1">{item.label}</span>
                                        {item.tooltip && <Info size={14} className="text-gray-400" />}
                                    </div>
                                    <div
                                        onClick={() => handleToggleFunctionality(item.id)}
                                        className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${formData.functionality[item.id] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${formData.functionality[item.id] ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionItem>

                    <AccordionItem
                        title="Coupon validity"
                        isOpen={isValidityOpen}
                        onToggle={() => setIsValidityOpen(!isValidityOpen)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold italic">From</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        className="w-full border rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 font-bold italic">Time</label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                                        className="w-full border rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.hasEndDate}
                                onChange={(e) => handleInputChange('hasEndDate', e.target.checked)}
                                className="mr-2 rounded border-gray-300 text-blue-600 h-4 w-4"
                            />
                            <span className="text-sm text-gray-600">Set an end date</span>
                        </div>

                        {formData.hasEndDate && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 animate-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bold italic">To</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                                            className="w-full border rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bold italic">Time</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                                            className="w-full border rounded-lg p-2.5 pl-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </AccordionItem>

                    {/* Footer Create Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            disabled={!isValid}
                            className={`font-semibold py-2.5 px-8 rounded-lg transition-colors ${isValid ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-400 cursor-not-allowed'
                                }`}
                            onClick={handleCreateCoupon}
                        >
                            {editingId ? 'Save Changes' : 'Create coupon'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderCouponList = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">Coupons</h2>
                    <p className="text-sm text-gray-500">You have {coupons.length} active coupons</p>
                </div>
                <button
                    onClick={() => {
                        setStep('select_type');
                        setEditingId(null);
                        setFormData({
                            couponCode: '',
                            usageLimit: 'Only once',
                            maxUsage: 'Unlimited',
                            description: '',
                            discountValue: '',
                            minOrderCondition: 'Order value',
                            minOrderValue: '',
                            maxDiscount: '',
                            applyOn: 'All products',
                            specificItems: [],
                            buyX: '',
                            getY: '',
                            limitFreeItems: false,
                            freebieType: 'On every purchase',
                            freebieItem: '',
                            functionality: {
                                showToCustomer: true,
                                onlinePayments: false,
                                newCustomers: false,
                                autoApply: false,
                                applicableWithOthers: false
                            },
                            startDate: '',
                            startTime: '',
                            hasEndDate: false,
                            endDate: '',
                            endTime: ''
                        });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                    <Plus size={18} />
                    Create coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${coupon.couponType === 'percentage' ? 'bg-orange-50 text-orange-500' :
                                    coupon.couponType === 'flat' ? 'bg-green-50 text-green-500' :
                                        'bg-blue-50 text-blue-500'
                                    }`}>
                                    {coupon.couponType === 'percentage' ? <Percent size={20} /> : <Banknote size={20} />}
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${coupon.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                    {coupon.status}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{coupon.couponCode}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-1">{coupon.description || 'No description provided'}</p>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-400">Discount</span>
                                <span className="font-bold text-gray-800">
                                    {coupon.couponType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} Off
                                </span>
                            </div>
                            <div className="pt-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-400">Min Order</span>
                                <span className="text-sm font-semibold text-gray-600">₹{coupon.minOrderValue || 0}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                <Calendar size={12} />
                                {coupon.validity?.startDate ? new Date(coupon.validity.startDate).toLocaleDateString() : 'N/A'}
                            </span>
                            <button
                                className="text-blue-600 text-xs font-bold hover:underline"
                                onClick={() => handleEditClick(coupon)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            {isLoading ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {(step === 'empty' && coupons.length === 0) && renderEmptyState()}
                    {step === 'select_type' && (
                        <>
                            {coupons.length === 0 ? renderEmptyState() : renderCouponList()}
                            {renderTypeSelection()}
                        </>
                    )}
                    {step === 'create_form' && renderCreateForm()}
                    {step === 'list' && renderCouponList()}
                </>
            )}
        </div>
    );
};

export default Discounts;
