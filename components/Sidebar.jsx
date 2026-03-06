import React from 'react';
import { ChevronRight, ChevronDown, ExternalLink, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ items, activeTab, onSelect, isOpen, onClose }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Initial check and resize listener
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sidebarWidth = isMobile ? 240 : (isHovered ? 240 : 70);

    return (
        <>
            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                onMouseEnter={() => !isMobile && setIsHovered(true)}
                onMouseLeave={() => !isMobile && setIsHovered(false)}
                initial={isMobile ? { x: "-100%" } : { width: 70 }}
                animate={isMobile ? { x: isOpen ? 0 : "-100%" } : { width: sidebarWidth }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`h-full bg-[#1e2640] text-white flex flex-col shrink-0 no-print overflow-hidden z-[70] shadow-xl ${isMobile ? 'fixed inset-y-0 left-0' : 'relative'
                    }`}
            >
                {/* Mobile Close Button */}
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Header / Store Selector */}
                <div className="p-3">
                    <motion.div
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white/10 cursor-pointer transition-colors overflow-hidden whitespace-nowrap"
                    >
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold overflow-hidden shrink-0">
                            <img src="https://picsum.photos/seed/store/40/40" alt="G" className="w-full h-full object-cover" />
                        </div>
                        <AnimatePresence>
                            {(isHovered || isMobile) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-w-0 flex items-center justify-between"
                                >
                                    <div className="flex-1 min-w-0 mr-2">
                                        <p className="text-sm font-semibold truncate">GVR Cashew M...</p>
                                        <p className="text-[10px] text-gray-400 underline hover:text-white">Visit store</p>
                                    </div>
                                    <ChevronDown size={20} className="text-white shrink-0" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide py-2 overflow-x-hidden">
                    {items.map((item) => {
                        const isProducts = item.id === 'products';
                        const isSubmenuOpen = isProducts && (activeTab === 'products' || activeTab === 'categories');

                        return (
                            <div key={item.id}>
                                <motion.button
                                    onClick={() => onSelect(item.id)}
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium relative whitespace-nowrap overflow-hidden ${activeTab === item.id
                                        ? 'bg-white/10 text-white'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {activeTab === item.id && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-6 bg-[#146eb4] rounded-r-full"
                                        />
                                    )}
                                    <motion.span
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.15 }}
                                        className={`shrink-0 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`}
                                    >
                                        {item.icon}
                                    </motion.span>

                                    <AnimatePresence>
                                        {(isHovered || isMobile) && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex-1 flex items-center justify-between min-w-0"
                                            >
                                                <span className="truncate">{item.label}</span>
                                                {isProducts && (
                                                    <motion.div
                                                        animate={{ rotate: isSubmenuOpen ? 180 : 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="shrink-0"
                                                    >
                                                        <ChevronDown size={14} className="text-gray-400" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                {/* Submenu for Products */}
                                <AnimatePresence>
                                    {(isHovered || isMobile) && isProducts && isSubmenuOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                            className="mt-1 ml-9 space-y-1 overflow-hidden whitespace-nowrap"
                                        >
                                            <motion.button
                                                whileHover={{ x: 4, color: "#fff" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => onSelect('products')}
                                                className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center transition-colors ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                            >
                                                <span>All products</span>
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ x: 4, color: "#fff" }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => onSelect('categories')}
                                                className={`w-full text-left px-3 py-1.5 text-sm rounded-md flex justify-between items-center transition-colors ${activeTab === 'categories' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}
                                            >
                                                <span>Categories</span>
                                            </motion.button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </nav>
            </motion.aside>
        </>
    );
};

export default Sidebar;
