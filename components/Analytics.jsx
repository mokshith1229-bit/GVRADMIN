import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    CreditCard,
    MapPin,
    Truck,
    Tag,
    PieChart as PieIcon,
    BarChart as BarIcon,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../store/slices/appSlice';
import { BASE_URL } from '../api';

const Analytics = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const url = `${BASE_URL}/admin/analytics`;
                console.log("Fetching analytics from:", url);

                const response = await fetch(url);

                if (!response.ok) {
                    const text = await response.text();
                    console.error("API Error Response:", text);
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                if (result.success && result.data) {
                    setData(result.data);
                } else if (!result.success && result.message) {
                    throw new Error(result.message);
                } else {
                    setData(result); // Fallback for unwrapped data
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#146eb4]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl m-6">
                <p className="text-xl font-bold mb-2">Failed to load analytics</p>
                <p>{error}</p>
            </div>
        );
    }

    const {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        repeatCustomers,
        newCustomers,
        paymentMethods,
        orderStatus,
        topProducts,
        categoryRevenue,
        shippingAnalytics,
        couponAnalytics,
        geographicSales
    } = data;

    const handleNavigateToAudience = () => {
        dispatch(setActiveTab('audience'));
    };

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                    <p className="text-xs md:text-gray-500 mt-1">Real-time business performance and customer insights.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Live Updates</span>
                </div>
            </div>

            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Revenue"
                    value={`₹${totalRevenue?.toLocaleString()}`}
                    icon={<DollarSign className="text-blue-600" />}
                    trend="+12.5%"
                    trendUp={true}
                />
                <SummaryCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={<ShoppingBag className="text-purple-600" />}
                    trend="+8.2%"
                    trendUp={true}
                />
                <SummaryCard
                    title="Avg Order Value"
                    value={`₹${Math.round(averageOrderValue)?.toLocaleString()}`}
                    icon={<TrendingUp className="text-indigo-600" />}
                    trend="-2.1%"
                    trendUp={false}
                />
                <SummaryCard
                    title="Total Customers"
                    value={totalCustomers}
                    icon={<Users className="text-orange-600" />}
                    trend="+15.3%"
                    trendUp={true}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Selling Products Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800">Top Selling Products</h2>
                        <Package className="text-gray-400" size={20} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Product Name</th>
                                    <th className="px-6 py-4 text-center">Orders</th>
                                    <th className="px-6 py-4 text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {topProducts?.map((product, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold font-mono">
                                                {product.orders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-gray-900">₹{product.revenue?.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Analytics Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-gray-800">Customer Segments</h2>
                        <Users className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-4 flex-1">
                        <CustomerStatRow
                            label="Total Customers"
                            value={totalCustomers}
                            color="bg-blue-600"
                            onClick={handleNavigateToAudience}
                            subtext="Combined registered & guests"
                        />
                        <CustomerStatRow
                            label="Repeat Customers"
                            value={repeatCustomers}
                            color="bg-green-500"
                            onClick={handleNavigateToAudience}
                            subtext="Customers with multiple orders"
                        />
                        <CustomerStatRow
                            label="New Customers"
                            value={newCustomers}
                            color="bg-orange-500"
                            subtext="First-time customers"
                        />

                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <div className="flex justify-between items-center text-sm font-medium text-gray-500 mb-2">
                                <span>Retention Rate</span>
                                <span className="text-blue-600 font-bold">
                                    {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-600 h-full transition-all duration-1000"
                                    style={{ width: `${totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Status Analytics (Pie-like list) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Order Status Distribution</h2>
                        <PieIcon className="text-gray-400" size={20} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <StatusPill label="Pending" count={orderStatus.pending} color="bg-yellow-100 text-yellow-700" />
                        <StatusPill label="Accepted" count={orderStatus.accepted} color="bg-blue-100 text-blue-700" />
                        <StatusPill label="Shipped" count={orderStatus.shipped} color="bg-indigo-100 text-indigo-700" />
                        <StatusPill label="Delivered" count={orderStatus.delivered} color="bg-green-100 text-green-700" />
                        <StatusPill label="Cancelled" count={orderStatus.cancelled} color="bg-red-100 text-red-700" />
                        <StatusPill label="Returned" count={orderStatus.returned} color="bg-gray-100 text-gray-700" />
                    </div>
                </div>

                {/* Payment Method Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Payment Methods</h2>
                        <CreditCard className="text-gray-400" size={20} />
                    </div>
                    <div className="flex gap-6 h-40">
                        <div className="flex-1 bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100/50 flex flex-col justify-center items-center text-center">
                            <span className="text-xs font-bold text-indigo-600 uppercase mb-2">Online Payments</span>
                            <span className="text-3xl font-black text-indigo-900">{paymentMethods.online}</span>
                            <span className="text-xs text-indigo-400 mt-1">Total Orders</span>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-orange-50 to-white p-5 rounded-2xl border border-orange-100/50 flex flex-col justify-center items-center text-center">
                            <span className="text-xs font-bold text-orange-600 uppercase mb-2">Cash on Delivery</span>
                            <span className="text-3xl font-black text-orange-900">{paymentMethods.cod}</span>
                            <span className="text-xs text-orange-400 mt-1">Total Orders</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue by Category (Horizontal Bar list) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Revenue by Category</h2>
                        <BarIcon className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-5">
                        {categoryRevenue?.map((cat, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-semibold text-gray-700">{cat.category}</span>
                                    <span className="font-bold text-gray-900">₹{cat.revenue?.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-50 h-2 rounded-full">
                                    <div
                                        className="bg-indigo-500 h-full rounded-full opacity-80"
                                        style={{ width: `${(cat.revenue / totalRevenue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Analytics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-gray-800">Shipping Analytics</h2>
                        <Truck className="text-gray-400" size={20} />
                    </div>
                    <div className="grid grid-cols-2 gap-y-8">
                        <ShippingMetric label="Orders Shipped" value={shippingAnalytics.shipped} icon={<Package size={16} />} color="text-blue-600" />
                        <ShippingMetric label="Delivered" value={shippingAnalytics.delivered} icon={<Truck size={16} />} color="text-green-600" />
                        <ShippingMetric label="RTO Orders" value={shippingAnalytics.rto} icon={<ArrowDownRight size={16} />} color="text-red-500" />
                        <ShippingMetric label="Avg Delivery" value={shippingAnalytics.averageDeliveryTime} icon={<TrendingUp size={16} />} color="text-indigo-600" />
                    </div>
                </div>

                {/* Coupon Analytics */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-gray-800">Offers & Coupons</h2>
                        <Tag className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-8">
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-200">
                            <span className="text-xs font-bold uppercase opacity-80 decoration-white/20">Coupons Used</span>
                            <div className="text-4xl font-black mt-1">{couponAnalytics.totalCouponsUsed}</div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-purple-100 flex flex-col items-center">
                            <span className="text-sm font-bold text-purple-600 mb-1">Total Discount Given</span>
                            <div className="text-3xl font-black text-gray-900">₹{couponAnalytics.totalDiscountGiven?.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geographic Sales Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800">Geographic Sales</h2>
                    <MapPin className="text-gray-400" size={20} />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">City</th>
                                <th className="px-6 py-4 text-right">Orders</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {geographicSales?.map((geo, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{geo.city || 'Other'}</td>
                                    <td className="px-6 py-4 text-right font-bold text-blue-600">{geo.orders} Orders</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

/* Helper Components */
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon, trend, trendUp }) => (
    <motion.div
        whileHover={{
            y: -5,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.2 }}
        className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 cursor-default transition-shadow"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-50 rounded-xl">
                {React.cloneElement(icon, { size: 18 })}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trend}
                </div>
            )}
        </div>
        <div className="text-xs font-medium text-gray-500 mb-1">{title}</div>
        <div className="text-xl md:text-2xl font-black text-gray-900">{value}</div>
    </motion.div>
);

const CustomerStatRow = ({ label, value, color, onClick, subtext }) => (
    <motion.div
        onClick={onClick}
        whileHover={onClick ? {
            scale: 1.02,
            borderColor: "#146eb4",
            boxShadow: "0 10px 20px rgba(20,110,180,0.1)"
        } : {}}
        whileTap={onClick ? { scale: 0.98 } : {}}
        className={`flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 ${onClick ? 'cursor-pointer bg-white border border-gray-100 group' : 'bg-gray-50/50 border border-transparent'}`}
    >
        <div className={`w-3.5 h-3.5 rounded-full ${color}`}></div>
        <div className="flex-1">
            <div className="text-sm font-bold text-gray-700 group-hover:text-[#146eb4] transition-colors">{label}</div>
            {subtext && <div className="text-[10px] font-medium text-gray-400 mt-0.5">{subtext}</div>}
        </div>
        <div className="flex items-center gap-3">
            <div className="text-lg font-black text-gray-900 font-mono">{value}</div>
            {onClick && <ChevronRight size={18} className="text-gray-300 group-hover:text-[#146eb4] group-hover:translate-x-1 transition-all" />}
        </div>
    </motion.div>
);

const StatusPill = ({ label, count, color }) => (
    <motion.div
        whileHover={{ scale: 1.05, filter: "brightness(1.05)" }}
        className={`${color} p-4 rounded-xl flex flex-col items-center justify-center border border-current opacity-90 cursor-default`}
    >
        <span className="text-xl font-black">{count}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </motion.div>
);

const ShippingMetric = ({ label, value, icon, color }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="flex items-start gap-3 cursor-default"
    >
        <div className={`p-2 rounded-lg bg-gray-50 ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{label}</div>
            <div className="text-lg font-black text-gray-900 tracking-tight">{value}</div>
        </div>
    </motion.div>
);

export default Analytics;
