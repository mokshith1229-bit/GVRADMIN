
import React, { useState } from 'react';
import {
    Search,
    Download,
    ChevronDown,
    HelpCircle,
    Bell,
    Menu,
    FileText,
    PlayCircle,
    Calendar,
    ArrowUpFromLine
} from 'lucide-react';

const Delivery = () => {
    const [activeStatus, setActiveStatus] = useState('All');
    const [search, setSearch] = useState('');

    const statusTabs = [
        'All',
        'Pickup pending',
        'In transit',
        'Out for delivery',
        'Delivered',
        'RTO',
        'Lost'
    ];

    return (
        <div className="flex flex-col h-full -m-6 md:-m-8">
            {/* Top Header Bar */}
            <header className="flex items-center justify-between px-8 py-4 bg-white border-b sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-medium text-gray-800">Delivery</h1>
                    <button className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition-colors">
                        <PlayCircle size={14} className="text-gray-400" />
                        How it works
                    </button>
                </div>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm">
                        <HelpCircle size={18} />
                        Help
                    </button>
                    <button className="text-gray-500 hover:text-gray-900">
                        <Bell size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-900">
                        <FileText size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-900">
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="p-8 space-y-6">

                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
                    {statusTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveStatus(tab)}
                            className={`px-5 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeStatus === tab
                                    ? 'bg-white border text-gray-800 shadow-sm'
                                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300 border border-transparent'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Filter and Search Bar Area */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Order ID, AWB, etc"
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-100 placeholder:text-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 font-medium">
                            <ArrowUpFromLine size={16} className="text-gray-400" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 font-medium">
                            Modified date
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 font-medium">
                            Payment
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 font-medium">
                            <Calendar size={16} className="text-gray-400" />
                            Last 30 days
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Table/Empty State Area */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col min-h-[400px]">
                    {/* Table Headers */}
                    <div className="grid grid-cols-6 bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider font-bold border-b border-gray-200">
                        <div className="px-6 py-3">Order info</div>
                        <div className="px-6 py-3">Items</div>
                        <div className="px-6 py-3">Customer details</div>
                        <div className="px-6 py-3">Amount</div>
                        <div className="px-6 py-3">Shipment details</div>
                        <div className="px-6 py-3">Status</div>
                    </div>

                    {/* Empty State Content */}
                    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                                <div className="w-16 h-20 bg-[#146eb4] rounded-sm relative overflow-hidden shadow-sm flex flex-col">
                                    {/* Mimicking the icon in the screenshot */}
                                    <div className="h-1/4 bg-[#1e2640] w-full flex items-center px-1 gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center p-2">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
                                    <div className="absolute bottom-4 left-2 right-4 h-1 bg-white/30 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-gray-800 font-medium text-lg text-center">
                            You have not shipped any order with Dukaan Delivery.
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Delivery;
