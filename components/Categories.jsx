import React, { useState } from 'react';
import {
    Search,
    Plus,
    ArrowLeft,
    Trash2,
    X
} from 'lucide-react';

const Categories = ({ categories, onAddCategory, onDeleteCategory, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const filteredCategories = categories.filter(category =>
        category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            onAddCategory(newCategoryName.trim());
            setNewCategoryName('');
            setShowAddModal(false);
        }
    };

    const handleDelete = (category) => {
        if (window.confirm(`Are you sure you want to delete the category "${category}"?`)) {
            onDeleteCategory(category);
        }
    };

    return (
        <div className="flex flex-col h-full -m-6 md:-m-8">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-medium text-gray-800">Categories</h1>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#146eb4] text-white text-sm font-medium rounded hover:bg-[#115a95] transition-colors"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </header>

            <div className="p-8 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Categories Table */}
                <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                            <tr className="border-b">
                                <th className="px-6 py-4">Category Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-gray-700">
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {category}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 italic">
                                            {category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="hover:text-red-600 transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                                        No categories found matching "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Add New Category</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                                    placeholder="e.g. Beverages"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#146eb4] text-white font-medium rounded hover:bg-[#115a95] transition-colors"
                                >
                                    Create Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
