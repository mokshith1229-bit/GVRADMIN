
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { OrderStatus, PaymentStatus } from '../types';
import { BASE_URL } from '../api';
import OrderInvoice from './OrderInvoice';
import { selectOrders, fetchOrders, updateOrderStatusAsync, updateOrder } from '../store/slices/orderSlice';
import {
    Search,
    Download,
    ArrowUpDown,
    Filter,
    ChevronDown,
    Plus,
    HelpCircle,
    Bell,
    Menu,
    FileText,
    ChevronUp,
    X,
    FileSpreadsheet,
    Settings2,
    Clock,
    MoreVertical,
    SlidersHorizontal,
    ArrowUpFromLine,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const [activeTab, setActiveTab] = useState('All');
    const [search, setSearch] = useState('');
    const [showSortModal, setShowSortModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showLifetimeModal, setShowLifetimeModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [sortDateType, setSortDateType] = useState('Order (Created date)');
    const [sortOrder, setSortOrder] = useState('Date (Newest first)');
    const [selectedLifetime, setSelectedLifetime] = useState('Lifetime');
    const [openStatusId, setOpenStatusId] = useState(null); // Track which order's status dropdown is open
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [processingOrderIds, setProcessingOrderIds] = useState([]);


    // Filter State
    const [filterPayment, setFilterPayment] = useState({ paid: false, cod: false, unpaid: false, prepaid: false });
    const [filterAmount, setFilterAmount] = useState('Select');
    const [filterQuantity, setFilterQuantity] = useState('Select');
    const [filterChannel, setFilterChannel] = useState({ online: false, manual: false });
    const [filterOthers, setFilterOthers] = useState({ dukaan: false, self: false, returned: false });

    // Reset handler
    const handleResetFilters = () => {
        setFilterPayment({ paid: false, cod: false, unpaid: false, prepaid: false });
        setFilterAmount('Select');
        setFilterQuantity('Select');
        setFilterChannel({ online: false, manual: false });
        setFilterOthers({ dukaan: false, self: false, returned: false });
    };

    const handleApplyFilters = () => {
        setShowFilterModal(false);
        // Apply logic would go here
    };

    const sortRef = useRef(null);
    const filterRef = useRef(null);
    const lifetimeRef = useRef(null);

    const tabs = ['All', 'Pending', 'Accepted', 'Shipped', 'Delivered', 'Modified', 'Rejected', 'Failed', 'Returned', 'Cancelled'];

    // Fetch orders from Redux store
    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const renderStatus = (status) => {
        const baseStyle = "inline-flex items-center justify-center px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase";

        if (status === 'Delivered') { // OrderStatus.DELIVERED might not be available if types are TS
            return (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#146eb4] text-[#146eb4] text-[10px] font-bold tracking-widest uppercase bg-blue-50/50`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#146eb4]"></div>
                    {status}
                </span>
            );
        }

        if (status === 'Returned') {
            return (
                <span className="text-gray-800 font-bold uppercase text-[11px] tracking-wide">
                    {status}
                </span>
            );
        }

        let colorClass = "";
        switch (status) { // Using string literals as fallbacks
            case 'Pending': colorClass = "bg-[#fff8e1] text-[#f59e0b]"; break;
            case 'Accepted': colorClass = "bg-[#dcfce7] text-[#16a34a]"; break;
            case 'Shipped': colorClass = "bg-[#ecfeff] text-[#06b6d4]"; break;
            case 'Rejected':
            case 'Failed':
            case 'Cancelled':
            case 'Cancelled by Buyer': colorClass = "bg-[#fee2e2] text-[#ef4444]"; break;
            default: colorClass = "bg-gray-100 text-gray-600";
        }

        return (
            <span className={`${baseStyle} ${colorClass}`}>
                {status}
            </span>
        );
    };

    const statusOptions = [
        'Pending',
        'Accepted',
        'Shipped',
        'Delivered',
        'Modified',
        'Rejected',
        'Cancelled by Buyer',
        'Cancelled',
        'Failed',
        'Returned'
    ];

    const getPaymentStyle = (payment) => {
        const baseStyle = "px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase";
        // Handle case sensitivity just in case
        const p = payment?.toUpperCase();
        return p === "PAID"
            ? `${baseStyle} bg-[#dcfce7] text-[#16a34a]`
            : `${baseStyle} bg-[#fff8e1] text-[#f59e0b]`;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortRef.current && !sortRef.current.contains(event.target)) setShowSortModal(false);
            if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilterModal(false);
            if (lifetimeRef.current && !lifetimeRef.current.contains(event.target)) setShowLifetimeModal(false);
            if (openStatusId && !event.target.closest('.status-dropdown-container')) setOpenStatusId(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openStatusId]);

    const filteredOrders = orders.filter(order => {
        // Tab filtering
        const matchesTab = activeTab === 'All'
            ? true
            : activeTab === 'Cancelled'
                ? (order.status === 'Cancelled' || order.status === 'Cancelled by Buyer')
                : order.status === activeTab;

        // Search filtering
        const searchTerm = search.toLowerCase();
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            (order.phone && order.phone.toLowerCase().includes(searchTerm));

        return matchesTab && matchesSearch;
    });

    const handleProcessOrder = async (orderId) => {
        setProcessingOrderIds(prev => [...prev, orderId]);
        try {
            const response = await fetch(`${BASE_URL}/admin/process-order/${orderId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                dispatch(updateOrder(data.order));
                // Optional: show a better toast here
                alert('Order processed successfully!');
            } else {
                alert(`Error: ${data.message || 'Failed to process order'}`);
            }
        } catch (error) {
            console.error('Process order error:', error);
            alert('An unexpected error occurred while processing the order.');
        } finally {
            setProcessingOrderIds(prev => prev.filter(id => id !== orderId));
        }
    };


    const handleStatusChange = (orderId, newStatus) => {
        dispatch(updateOrderStatusAsync({ orderId, newStatus }));
        setOpenStatusId(null);
    };

    return (
        <div className="space-y-6 no-print">
            {/* Action Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                    ? 'bg-[#146eb4] text-white shadow-sm'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                            >
                                {tab} {tab === 'All' ? orders.length : tab === 'Delivered' ? orders.filter(o => o.status === 'Delivered').length : ''}
                            </motion.button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Removed Bulk ship and Create order buttons */}
                    </div>
                </div>

                {/* Table/Filter Area */}
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-visible">
                    {/* New Filter Bar matching screenshot */}
                    <div className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-white">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowExportModal(true)}
                                className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                <ArrowUpFromLine size={16} className="text-gray-500" />
                                Export
                            </motion.button>

                            <div className="relative" ref={sortRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowSortModal(!showSortModal)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium transition-colors ${showSortModal ? 'bg-blue-50 border-blue-200 text-[#146eb4]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <ArrowUpDown size={16} className={showSortModal ? 'text-[#146eb4]' : 'text-gray-500'} />
                                    Sort by
                                </motion.button>

                                <AnimatePresence>
                                    {showSortModal && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-2 origin-top-right"
                                        >
                                            <div className="pb-2 border-b border-gray-100">
                                                {['Order (Created date)', 'Order (Modified date)'].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setSortDateType(option)}
                                                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-sm text-gray-700"
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortDateType === option ? 'border-[#146eb4]' : 'border-gray-300'
                                                            }`}>
                                                            {sortDateType === option && (
                                                                <div className="w-2 h-2 rounded-full bg-[#146eb4]"></div>
                                                            )}
                                                        </div>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="pt-2">
                                                {['Date (Newest first)', 'Date (Oldest first)', 'Items (High to low)', 'Items (Low to high)', 'Amount (High to low)', 'Amount (Low to high)'].map((option) => (
                                                    <button
                                                        key={option}
                                                        onClick={() => setSortOrder(option)}
                                                        className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 text-sm text-gray-700"
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortOrder === option ? 'border-[#146eb4]' : 'border-gray-300'
                                                            }`}>
                                                            {sortOrder === option && (
                                                                <div className="w-2 h-2 rounded-full bg-[#146eb4]"></div>
                                                            )}
                                                        </div>
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative" ref={filterRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowFilterModal(!showFilterModal)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium transition-colors ${showFilterModal ? 'bg-blue-50 border-blue-200 text-[#146eb4]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Filter size={16} className={showFilterModal ? 'text-[#146eb4]' : 'text-gray-500'} />
                                    Filter
                                </motion.button>
                                <AnimatePresence>
                                    {showFilterModal && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden origin-top-right"
                                        >
                                            <div className="max-h-[600px] overflow-y-auto p-4 space-y-6">
                                                {/* Payment Section */}
                                                <div>
                                                    <h3 className="font-medium text-gray-800 mb-3">Payment</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {Object.entries(filterPayment).map(([key, value]) => (
                                                            <label key={key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={value}
                                                                    onChange={() => setFilterPayment(prev => ({ ...prev, [key]: !prev[key] }))}
                                                                    className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                                />
                                                                {key.charAt(0).toUpperCase() + key.slice(1) + (key === 'cod' ? ' (COD)' : '') + ' orders'}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Amount Section */}
                                                <div>
                                                    <h3 className="font-medium text-gray-800 mb-1">Amount</h3>
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-gray-500">Condition</div>
                                                        <div className="relative">
                                                            <select
                                                                value={filterAmount}
                                                                onChange={(e) => setFilterAmount(e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-[#146eb4] appearance-none"
                                                            >
                                                                <option>Select</option>
                                                                <option>Greater than</option>
                                                                <option>Less than</option>
                                                            </select>
                                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity Section */}
                                                <div>
                                                    <h3 className="font-medium text-gray-800 mb-1">Quantity</h3>
                                                    <div className="space-y-1">
                                                        <div className="text-xs text-gray-500">Condition</div>
                                                        <div className="relative">
                                                            <select
                                                                value={filterQuantity}
                                                                onChange={(e) => setFilterQuantity(e.target.value)}
                                                                className="w-full p-2 border border-gray-200 rounded text-sm text-gray-700 bg-white focus:outline-none focus:border-[#146eb4] appearance-none"
                                                            >
                                                                <option>Select</option>
                                                                <option>Greater than</option>
                                                                <option>Less than</option>
                                                            </select>
                                                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Channel Section */}
                                                <div>
                                                    <h3 className="font-medium text-gray-800 mb-3">Channel</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={filterChannel.online}
                                                                onChange={() => setFilterChannel(prev => ({ ...prev, online: !prev.online }))}
                                                                className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                            />
                                                            Online orders
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={filterChannel.manual}
                                                                onChange={() => setFilterChannel(prev => ({ ...prev, manual: !prev.manual }))}
                                                                className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                            />
                                                            Manual orders
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Others Section */}
                                                <div>
                                                    <h3 className="font-medium text-gray-800 mb-3">Others</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={filterOthers.dukaan}
                                                                onChange={() => setFilterOthers(prev => ({ ...prev, dukaan: !prev.dukaan }))}
                                                                className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                            />
                                                            Dukaan delivery orders
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={filterOthers.self}
                                                                onChange={() => setFilterOthers(prev => ({ ...prev, self: !prev.self }))}
                                                                className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                            />
                                                            Self shipped orders
                                                        </label>
                                                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={filterOthers.returned}
                                                                onChange={() => setFilterOthers(prev => ({ ...prev, returned: !prev.returned }))}
                                                                className="rounded border-gray-300 text-[#146eb4] focus:ring-[#146eb4]"
                                                            />
                                                            Returned orders
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50">
                                                <button
                                                    onClick={handleResetFilters}
                                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={handleApplyFilters}
                                                    className="px-6 py-2 bg-[#146eb4] text-white rounded text-sm font-medium hover:bg-[#115a95]"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="relative" ref={lifetimeRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowLifetimeModal(!showLifetimeModal)}
                                    className={`flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium transition-colors ${showLifetimeModal ? 'bg-blue-50 border-blue-200 text-[#146eb4]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Clock size={16} className={showLifetimeModal ? 'text-[#146eb4]' : 'text-gray-500'} />
                                    {selectedLifetime}
                                    {showLifetimeModal ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </motion.button>
                                <AnimatePresence>
                                    {showLifetimeModal && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 origin-top-right"
                                        >
                                            {[
                                                'Lifetime',
                                                'Today',
                                                'Yesterday',
                                                'This Week',
                                                'Last 7 days',
                                                'Last Week',
                                                'This Month',
                                                'Last 30 days',
                                                'Last Month',
                                                'Custom Range'
                                            ].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setSelectedLifetime(option);
                                                        setShowLifetimeModal(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedLifetime === option ? 'text-[#146eb4] font-medium' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-separate border-spacing-0">
                            <thead className="bg-[#f9fafb]">
                                <tr className="text-[#6b7280] uppercase text-[10px] tracking-wider font-bold border-b border-gray-100">
                                    <th className="px-4 py-4 w-10 border-b border-gray-100">
                                        <input type="checkbox" className="rounded border-gray-300 text-[#146eb4]" />
                                    </th>
                                    <th className="px-4 py-4 border-b border-gray-100">ORDER ID</th>
                                    <th className="px-4 py-4 border-b border-gray-100">DATE</th>
                                    <th className="px-4 py-4 border-b border-gray-100">CUSTOMER</th>
                                    <th className="px-4 py-4 border-b border-gray-100">ITEMS</th>
                                    <th className="px-4 py-4 border-b border-gray-100">PAYMENT</th>
                                    <th className="px-4 py-4 border-b border-gray-100">STATUS</th>
                                    <th className="px-4 py-4 border-b border-gray-100">ACTIONS</th>
                                    <th className="px-4 py-4 border-b border-gray-100 text-right">AMOUNT</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input type="checkbox" className="rounded border-gray-300 text-[#146eb4]" />
                                            </td>
                                            <td
                                                className="px-4 py-4 text-[#146eb4] font-medium cursor-pointer hover:underline"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                {order.id}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 text-xs">
                                                {order.date}
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-gray-800">
                                                {order.customer}
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">
                                                {order.itemsCount}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={getPaymentStyle(order.payment)}>
                                                    {order.payment}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 relative status-dropdown-container">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (openStatusId === order.id) {
                                                            setOpenStatusId(null);
                                                        } else {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setDropdownPos({
                                                                top: rect.bottom + 5,
                                                                left: rect.left
                                                            });
                                                            setOpenStatusId(order.id);
                                                        }
                                                    }}
                                                    className="focus:outline-none"
                                                >
                                                    {renderStatus(order.status)}
                                                </motion.button>

                                                {openStatusId === order.id && (
                                                    <div
                                                        className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[9999] py-2"
                                                        style={{
                                                            top: `${dropdownPos.top}px`,
                                                            left: `${dropdownPos.left}px`
                                                        }}
                                                    >
                                                        {statusOptions.map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => handleStatusChange(order.id, option)}
                                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${order.status === option
                                                                    ? 'bg-blue-50 text-[#146eb4] font-medium'
                                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#146eb4]'
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                {/* Process Order Button logic */}
                                                {order.status === 'Pending' &&
                                                    (order.paymentStatus === 'Paid' || order.paymentStatus === 'Accepted' ||
                                                        order.payment?.toUpperCase() === 'COD') ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProcessOrder(order.id);
                                                        }}
                                                        disabled={processingOrderIds.includes(order.id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${processingOrderIds.includes(order.id)
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                                            : 'bg-[#146eb4] text-white hover:bg-[#115a95] shadow-sm'
                                                            }`}
                                                    >
                                                        {processingOrderIds.includes(order.id) ? (
                                                            <>
                                                                <Loader2 size={12} className="animate-spin" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            'Process Order'
                                                        )}
                                                    </motion.button>
                                                ) : (
                                                    <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                                                        {order.status === 'Packed' ? 'Completed' : 'N/A'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right font-bold text-gray-900">

                                                ₹{order.amount ? order.amount.toLocaleString() : '0'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            No orders available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showExportModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 flex items-center justify-between">
                            <h2 className="text-xl font-medium text-gray-800">Choose report type</h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowExportModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        <div className="flex items-stretch border-t">
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.02)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowExportModal(false)}
                                className="flex-1 flex flex-col items-center justify-center py-16 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="mb-4 text-gray-400 group-hover:text-red-500 transition-colors">
                                    <FileText size={80} strokeWidth={1} />
                                </div>
                                <span className="text-sm font-semibold text-gray-600 tracking-widest uppercase">PDF</span>
                            </motion.button>
                            <div className="w-[1px] bg-gray-100"></div>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.02)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowExportModal(false)}
                                className="flex-1 flex flex-col items-center justify-center py-16 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="mb-4 text-gray-400 group-hover:text-green-600 transition-colors">
                                    <FileSpreadsheet size={80} strokeWidth={1} />
                                </div>
                                <span className="text-sm font-semibold text-gray-600 tracking-widest uppercase">XLSX</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50 rounded-t-xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
                                <p className="text-xs text-gray-500 mt-1">ID: {selectedOrder.id}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Customer & Address Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="font-bold text-gray-900">{selectedOrder.customer}</p>
                                        <p className="text-sm text-gray-600 mt-1">{selectedOrder.phone}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {selectedOrder.shippingAddress?.line1}<br />
                                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Billing Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        {selectedOrder.billingAddress?.line1 === selectedOrder.shippingAddress?.line1 ? (
                                            <p className="text-xs text-gray-500 italic">Same as shipping</p>
                                        ) : (
                                            <p className="text-sm text-gray-800 leading-relaxed">
                                                {selectedOrder.billingAddress?.line1}<br />
                                                {selectedOrder.billingAddress?.city}, {selectedOrder.billingAddress?.state} - {selectedOrder.billingAddress?.pincode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary (Items) */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Ordered</h3>
                                <div className="border rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 border-b">
                                            <tr className="text-gray-500">
                                                <th className="px-4 py-3 text-left font-medium">Product</th>
                                                <th className="px-4 py-3 text-center font-medium">Quantity</th>
                                                <th className="px-4 py-3 text-right font-medium">Price</th>
                                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {selectedOrder.products?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50">
                                                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                                                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">₹{item.price.toLocaleString()}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-50 font-bold border-t">
                                            <tr>
                                                <td colSpan="3" className="px-4 py-4 text-right text-gray-600 uppercase tracking-wider text-xs">Total Amount</td>
                                                <td className="px-4 py-4 text-right text-lg text-[#146eb4]">₹{selectedOrder.amount.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Payment & Status */}
                            <div className="flex flex-wrap gap-4 pt-4 border-t">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">Payment</span>
                                    <span className="text-sm font-bold text-[#146eb4]">{selectedOrder.payment}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                                    <div className="flex items-center gap-2">
                                        {renderStatus(selectedOrder.status)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2 border rounded-lg text-sm font-bold text-gray-600 hover:bg-white transition-colors"
                            >
                                Close
                            </button>
                            <button
                                className="px-6 py-2 bg-[#146eb4] text-white rounded-lg text-sm font-bold hover:bg-[#115a95] shadow-lg shadow-blue-200"
                                onClick={() => window.print()}
                            >
                                Print Invoice
                            </button>
                        </div>

                        {/* Hidden Invoice for Printing */}
                        <div className="absolute opacity-0 pointer-events-none print:relative print:opacity-100 print:pointer-events-auto">
                            <OrderInvoice order={selectedOrder} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
