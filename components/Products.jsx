
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectProducts } from '../store/slices/productSlice';
import AddProduct from './AddProduct';
import {
    Search,
    Plus,
    MoreVertical,
    HelpCircle,
    Bell,
    FileText,
    Menu,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    ArrowUpDown,
    Eye,
    Share2
} from 'lucide-react';

const Products = ({ onRefresh, categories, onToggleStatus }) => {
    const products = useSelector(selectProducts);
    const [showAddModal, setShowAddModal] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const itemsPerPage = 8;

    const [editingProduct, setEditingProduct] = useState(null);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Count products per category for badge display
    const categoryCount = (cat) =>
        cat === 'All'
            ? products.length
            : products.filter(p => p.category === cat).length;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleCategorySelect = (cat) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    const handleProductSaved = () => {
        setShowAddModal(false);
        setEditingProduct(null);
        if (onRefresh) onRefresh();
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setShowAddModal(true);
    };

    const handleAddNewClick = () => {
        setEditingProduct(null);
        setShowAddModal(true);
    };

    if (showAddModal) {
        return (
            <AddProduct
                onClose={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                }}
                onSave={handleProductSaved}
                categories={categories}
                initialData={editingProduct}
            />
        );
    }

    return (
        <div className="flex flex-col h-full -m-6 md:-m-8">


            {/* Filter and Search Bar Area */}
            <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-2xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <button
                                onClick={handleAddNewClick}
                                className="flex items-center gap-2 pl-4 pr-3 py-2 bg-[#146eb4] text-white rounded-l-md text-sm font-medium hover:bg-[#115a95] transition-all"
                            >
                                <Plus size={18} />
                                Add new product
                            </button>
                            <button className="px-2 py-2 bg-[#146eb4] text-white border-l border-[#ffffff33] rounded-r-md hover:bg-[#115a95]">
                                <ChevronDown size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                    {['All', ...(categories || [])].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategorySelect(cat)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedCategory === cat
                                ? 'bg-[#146eb4] text-white border-[#146eb4] shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#146eb4] hover:text-[#146eb4]'
                                }`}
                        >
                            {cat}
                            <span
                                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold ${selectedCategory === cat
                                    ? 'bg-white/25 text-white'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {categoryCount(cat)}
                            </span>
                        </button>
                    ))}
                    <div className="ml-auto flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
                            <ArrowUpDown size={14} className="text-gray-400" />
                            Sort by
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
                            <Filter size={14} className="text-gray-400" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                                <tr className="border-b">
                                    <th className="px-4 py-3 w-10">
                                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                    <th className="px-4 py-3 text-center">Inventory</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-700">
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product) => (
                                        <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {product.image ? (
                                                        <img src={product.image} alt="" className="w-10 h-10 rounded-md object-cover border bg-gray-50" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40'; }} />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-md border bg-gray-50 flex items-center justify-center text-gray-400">
                                                            <div className="w-5 h-5 bg-gray-200 rounded-sm"></div>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-medium text-[#146eb4] block hover:underline cursor-pointer">{product.name}</span>
                                                        <span className="text-[10px] text-gray-400 block mt-0.5">{product.category}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">₹{product.price ? product.price.toLocaleString() : '0'}</td>
                                            <td className="px-4 py-3 text-center text-gray-400">{product.stock !== undefined ? product.stock : (product.inventory || 0)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div
                                                        onClick={() => onToggleStatus(product._id || product.id)}
                                                        className={`w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${product.status === 'Active' ? 'bg-[#146eb4]' : 'bg-gray-300'}`}
                                                    >
                                                        <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform ${product.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                    </div>
                                                    <span className={`text-[10px] font-medium min-w-[35px] ${product.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>
                                                        {product.status || 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleEditClick(product)}
                                                    className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-xs font-medium shadow-sm"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                            {selectedCategory !== 'All'
                                                ? `No products found in "${selectedCategory}"${search ? ` matching "${search}"` : ''}`
                                                : `No products found matching "${search}"`}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-4 py-3 border-t bg-white flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>
                                Viewing {(currentPage - 1) * itemsPerPage + 1}-
                                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 border rounded flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={14} />
                                Previous
                            </button>
                            <div className="flex gap-1 px-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-7 h-7 flex items-center justify-center rounded ${currentPage === page
                                            ? 'bg-[#146eb4] text-white'
                                            : 'hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1.5 border rounded flex items-center gap-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Products;
