import React, { useState, useEffect } from 'react';
import { Search, Users, MoreVertical, Calendar, ShoppingBag, CreditCard, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { BASE_URL } from '../api';

const Audience = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/admin/customers`);
                const result = await response.json();
                if (result.success) {
                    setCustomers(result.data);
                } else {
                    setError(result.message || 'Failed to fetch customers');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filter by name
    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(search.toLowerCase()) ||
        customer.email?.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone?.includes(search)
    );

    // Sort by total orders
    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.total_orders - a.total_orders;
        } else {
            return a.total_orders - b.total_orders;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#146eb4]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 no-print">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="text-[#146eb4]" size={24} />
                        Audience
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your customers and view their purchase history.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Total Customers:</span>
                    <span className="text-lg font-bold text-[#146eb4]">{customers.length}</span>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
                <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ArrowUpDown size={16} />
                        Sort by Orders ({sortOrder === 'desc' ? 'High to Low' : 'Low to High'})
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Total Orders</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Total Spent</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Order</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {currentItems.length > 0 ? (
                                currentItems.map((customer) => (
                                    <tr key={customer.user_id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#146eb4] font-bold text-lg">
                                                    {customer.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900">{customer.name || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{customer.email}</div>
                                                    <div className="text-[10px] text-gray-400">{customer.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(customer.first_order_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#146eb4] text-xs font-bold">
                                                <ShoppingBag size={12} />
                                                {customer.total_orders} Orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm font-bold text-gray-900 flex items-center justify-end gap-1">
                                                <CreditCard size={14} className="text-gray-400" />
                                                ₹{customer.total_spent?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600 font-medium">
                                                {formatDate(customer.last_order_date)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="p-2 text-gray-400 hover:text-[#146eb4] hover:bg-blue-50 rounded-lg transition-all">
                                                <MoreVertical size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Users size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-medium">No customers found</p>
                                            <p className="text-sm">Try adjusting your search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, sortedCustomers.length)}</span> of <span className="font-medium">{sortedCustomers.length}</span> customers
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                            ? 'bg-[#146eb4] text-white'
                                            : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-lg text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Audience;
