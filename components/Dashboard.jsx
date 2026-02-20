
import React, { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { ChevronDown, Info } from 'lucide-react';

const StatCard = ({
    title, value, count, variant = 'white'
}) => (
    <div className={`p-5 rounded-lg shadow-sm ${variant === 'blue' ? 'bg-[#146eb4] text-white' : 'bg-white border text-gray-900'}`}>
        <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium opacity-80">{title}</span>
            <Info size={14} className="opacity-60" />
        </div>
        <div className="flex items-center justify-between">
            <span className="text-3xl font-bold">{value}</span>
            {count !== undefined && (
                <span className="text-sm underline cursor-pointer">{count} orders &rarr;</span>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [ordersChartData, setOrdersChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('http://localhost:5000/dashboard');
                const data = await response.json();

                setDashboardData(data);

                // Process sales chart data
                if (data.salesData && Array.isArray(data.salesData)) {
                    const processedChartData = data.salesData.map(item => {
                        const date = new Date(item._id);
                        return {
                            name: date.toLocaleDateString('en-US', { weekday: 'short' }), // e.g., "Mon"
                            sales: item.totalSales || 0
                        };
                    });
                    setChartData(processedChartData);
                }

                // Process orders chart data
                if (data.ordersData && Array.isArray(data.ordersData)) {
                    const processedOrdersData = data.ordersData.map(item => {
                        const date = new Date(item._id);
                        return {
                            name: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), // e.g., "Oct 5"
                            orders: item.orderCount || 0
                        };
                    });
                    setOrdersChartData(processedOrdersData);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    // Default empty data if fetch failed or returned empty
    const stats = dashboardData || {
        pendingAmount: 0,
        processedAmount: 0,
        ordersCountPending: 0,
        ordersCountProcessed: 0,
        salesData: []
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Overview</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded text-sm text-gray-600 hover:bg-gray-50">
                    Last 30 days
                    <ChevronDown size={16} />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard
                    title="Next Payout"
                    value={formatCurrency(stats.pendingAmount)}
                    count={stats.ordersCountPending}
                    variant="blue"
                />
                <StatCard
                    title="Amount Pending"
                    value={formatCurrency(stats.pendingAmount)}
                    count={stats.ordersCountPending}
                />
                <StatCard
                    title="Amount Processed"
                    value={formatCurrency(stats.processedAmount)}
                />
            </div>

            {/* Sales Chart */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-gray-800">Sales Transactions</h2>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#146eb4]"></span>
                            Last 7 days
                        </span>
                    </div>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'No Data', sales: 0 }]}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#146eb4" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#146eb4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value) => formatCurrency(value)}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#146eb4"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Order Volume Chart */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-gray-800">Order Volume</h2>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                            Last 30 days
                        </span>
                    </div>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ordersChartData.length > 0 ? ordersChartData : [{ name: 'No Data', orders: 0 }]}>
                            <defs>
                                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stroke="#10b981"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorOrders)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
