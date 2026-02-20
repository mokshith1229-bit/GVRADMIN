
import React from 'react';
import { ChevronRight, ChevronDown, ExternalLink, Wallet } from 'lucide-react';

const Sidebar = ({ items, activeTab, onSelect }) => {
    return (
        <aside className="w-64 h-full bg-[#1e2640] text-white flex flex-col shrink-0">
            {/* Header / Store Selector */}
            <div className="p-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/10 hover:bg-white/15 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold overflow-hidden">
                            <img src="https://picsum.photos/seed/store/40/40" alt="G" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">GVR Cashew M...</p>
                            <p className="text-[10px] text-gray-400 underline hover:text-white">Visit store</p>
                        </div>
                    </div>
                    <ChevronDown size={20} className="text-white" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide py-2">
                {items.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => onSelect(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${activeTab === item.id
                                ? 'bg-white/10 text-white'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={activeTab === item.id ? 'text-white' : 'text-gray-400'}>
                                {item.icon}
                            </span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.id === 'products' && <ChevronDown size={14} className="text-gray-400" />}
                        </button>

                        {/* Submenu for Products */}
                        {item.id === 'products' && (activeTab === 'products' || activeTab === 'categories') && (
                            <div className="mt-1 ml-9 space-y-1">
                                <button
                                    onClick={() => onSelect('products')}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center transition-colors ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>All products</span>
                                </button>
                                <button
                                    onClick={() => onSelect('categories')}
                                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center transition-colors ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span>Categories</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Bottom Profile / Credits */}
            <div className="p-3">
                <div className="bg-white/10 p-3 rounded-lg flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded flex items-center justify-center">
                        <Wallet size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] text-gray-400">Dukaan Credits</p>
                        <p className="text-sm font-semibold text-white">142.2</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
