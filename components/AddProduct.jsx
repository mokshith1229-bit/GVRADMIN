import React, { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft,
    HelpCircle,
    Upload,
    X,
    Plus,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    Trash2,
    Video,
    Layout,
    Type,
    Bold,
    Italic,
    Underline,
    Link as LinkIcon,
    Image as ImageIcon,
    Table,
    List,
    ListOrdered,
    Quote,
    Code,
    Maximize2
} from 'lucide-react';

const AddProduct = ({ onClose, onSave, categories = [], initialData = null }) => {
    // Product fields
    const [name, setName] = useState(initialData?.name || '');
    const [price, setPrice] = useState(initialData?.price || '');
    const [discountedPrice, setDiscountedPrice] = useState(initialData?.discountedPrice || '');
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || '');
    const [cover, setCover] = useState(initialData?.cover || { type: 'image', url: '' });
    const [media, setMedia] = useState(initialData?.media || []);
    const [description, setDescription] = useState(initialData?.description || '');
    const [stock, setStock] = useState(initialData?.stock || initialData?.inventory || '');
    const [category, setCategory] = useState(initialData?.category || (categories[0] || ''));

    // Inventory & Shipping
    const [sku, setSku] = useState(initialData?.inventory?.sku || '');
    const [weight, setWeight] = useState(initialData?.shipping?.weight || '');
    const [length, setLength] = useState(initialData?.shipping?.dimensions?.length || '');
    const [width, setWidth] = useState(initialData?.shipping?.dimensions?.width || '');
    const [height, setHeight] = useState(initialData?.shipping?.dimensions?.height || '');

    // Variants
    const [variants, setVariants] = useState(initialData?.variants || []);

    // SEO
    const [metaTitle, setMetaTitle] = useState(initialData?.seo?.title || '');
    const [metaDescription, setMetaDescription] = useState(initialData?.seo?.description || '');

    // UI states
    const [loading, setLoading] = useState(false);
    const [openAccordion, setOpenAccordion] = useState('inventory');
    const [activeSection, setActiveSection] = useState('Product Information');

    const getSections = () => {
        const baseSections = [
            'Product Information',
            'Product Media',
            'Inventory',
            'Shipping & Tax',
            'Variants',
            'Dukaan SEO'
        ];

        if (category === 'Clothing' || category === 'Apparels') {
            return baseSections.filter(s => s !== 'Shipping & Tax');
        }
        return baseSections;
    };

    const sections = getSections();

    const handleSaveProduct = async () => {
        if (!name || !price || !description || !category) {
            alert('Please fill in all required fields (Name, Price, Category, Description)');
            return;
        }

        setLoading(true);

        const productData = {
            name,
            price: parseFloat(price),
            discountedPrice: discountedPrice ? parseFloat(discountedPrice) : undefined,
            image: image || (images.length > 0 ? images[0] : ''),
            images,
            description,
            category,
            thumbnail,
            cover,
            media,
            stock: parseInt(stock) || 0,
            weight: parseFloat(weight),
            dimensions: {
                length: parseFloat(length),
                width: parseFloat(width),
                height: parseFloat(height)
            },
            variants: variants.map(v => ({
                ...v,
                price: parseFloat(v.price) || 0,
                discountedPrice: v.discountedPrice ? parseFloat(v.discountedPrice) : undefined,
                stock: parseInt(v.stock) || 0,
                thumbnail: v.thumbnail || v.images?.[0] || '', // Migration/fallback
                cover: v.cover || { type: 'image', url: v.images?.[0] || '' },
                media: v.media || (v.images ? v.images.map(img => ({ type: 'image', url: img })) : [])
            })),
            seo: {
                title: metaTitle,
                description: metaDescription
            },
            status: initialData?.status || 'Active'
        };

        try {
            const url = initialData
                ? `http://localhost:5000/products/${initialData._id || initialData.id}`
                : 'http://localhost:5000/products';

            const method = initialData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                alert(initialData ? 'Product updated' : 'Product added');
                if (onSave) onSave();
                if (onClose) onClose();
            } else {
                const err = await response.json();
                alert(err.message || (initialData ? 'Failed to update product' : 'Failed to add product'));
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('An error occurred. Please check if your backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const navToSection = (section) => {
        setActiveSection(section);
        const element = document.getElementById(section.replace(/\s+/g, '-'));
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#f8f9fa] overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 bg-white border-b sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-[17px] font-semibold text-gray-900">
                            {initialData ? 'Edit product' : 'Add new product'}
                        </h1>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-500 font-medium border border-gray-200 cursor-pointer hover:bg-gray-200">
                            <HelpCircle size={12} />
                            How it works
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleSaveProduct}
                    disabled={loading}
                    className="px-6 py-2 bg-[#146eb4] text-white text-[13px] font-medium rounded-md hover:bg-[#115a95] transition-all shadow-sm disabled:opacity-50"
                >
                    {loading ? 'Adding...' : (initialData ? 'Save changes' : 'Add product')}
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[240px] border-r bg-white p-6 hidden lg:block overflow-y-auto">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Quick navigation</p>
                    <nav className="space-y-1">
                        {sections.map(section => (
                            <button
                                key={section}
                                onClick={() => navToSection(section)}
                                className={`w-full text-left px-3 py-2.5 rounded-md text-[13px] transition-all ${activeSection === section
                                    ? 'bg-[#146eb4]/5 text-[#146eb4] font-semibold border-l-2 border-[#146eb4] rounded-l-none'
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                {section}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="scroll-container">
                    <div className="max-w-4xl mx-auto space-y-8 pb-32">

                        {/* Product Information */}
                        <section id="Product-Information" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-[16px] font-bold text-gray-900">Product Information</h2>
                                <p className="text-[12px] text-gray-500 mt-1">Easily input essential details like name, price, and more to showcase your product.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none transition-all"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-medium text-gray-700">Product Category <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none appearance-none transition-all"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat, idx) => (
                                            <option key={idx} value={cat}>{cat}</option>
                                        ))}
                                        <option value="Electronics">Electronics</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Dry Fruits">Dry Fruits</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-gray-700">Price <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none transition-all"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-gray-700">Discounted Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Enter discounted price"
                                                className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none transition-all"
                                                value={discountedPrice}
                                                onChange={(e) => setDiscountedPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[13px] font-medium text-gray-700">Product Description <span className="text-red-500">*</span></label>
                                        <button
                                            type="button"
                                            className="text-[12px] text-[#146eb4] font-medium hover:underline flex items-center gap-1"
                                            onClick={() => {
                                                const suggestions = [
                                                    "Premium quality product with durable materials.",
                                                    "Enhance your collection with this stylish addition.",
                                                    "Designed for comfort and long-lasting performance."
                                                ];
                                                setDescription(prev => prev + (prev ? "\n" : "") + suggestions[Math.floor(Math.random() * suggestions.length)]);
                                            }}
                                        >
                                            <Type size={12} />
                                            Get description
                                        </button>
                                    </div>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#146eb4] transition-all">
                                        <div className="flex items-center gap-0.5 p-1.5 bg-gray-50 border-b overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                            <select
                                                className="bg-transparent text-[12px] font-medium px-2 py-1 outline-none border-r border-gray-200 mr-1 cursor-pointer hover:bg-gray-100 rounded"
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    let format = '';
                                                    if (val === 'Heading 1') format = '# ';
                                                    if (val === 'Heading 2') format = '## ';
                                                    if (format) {
                                                        const textarea = document.getElementById('product-description-textarea');
                                                        const start = textarea.selectionStart;
                                                        const text = textarea.value;
                                                        const newText = text.substring(0, start) + format + text.substring(start);
                                                        setDescription(newText);
                                                        e.target.value = 'Paragraph'; // Reset
                                                        setTimeout(() => {
                                                            textarea.focus();
                                                            textarea.setSelectionRange(start + format.length, start + format.length);
                                                        }, 0);
                                                    }
                                                }}
                                            >
                                                <option>Paragraph</option>
                                                <option>Heading 1</option>
                                                <option>Heading 2</option>
                                            </select>
                                            {[
                                                { icon: Bold, label: 'Bold', type: 'wrap', format: '**' },
                                                { icon: Italic, label: 'Italic', type: 'wrap', format: '*' },
                                                { icon: Underline, label: 'Underline', type: 'wrap', format: '__' },
                                                { icon: LinkIcon, label: 'Link', type: 'link' },
                                                { icon: List, label: 'Bullet List', type: 'prefix', format: '- ' },
                                                { icon: ListOrdered, label: 'Numbered List', type: 'prefix', format: '1. ' },
                                                { icon: Quote, label: 'Quote', type: 'prefix', format: '> ' },
                                                { icon: Code, label: 'Code', type: 'wrap', format: '`' },
                                                { icon: Maximize2, label: 'Fullscreen', type: 'action' }
                                            ].map((btn, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    title={btn.label}
                                                    onClick={() => {
                                                        const textarea = document.getElementById('product-description-textarea');
                                                        const start = textarea.selectionStart;
                                                        const end = textarea.selectionEnd;
                                                        const text = textarea.value;
                                                        const selected = text.substring(start, end);
                                                        let newText = '';
                                                        let newStart = start;
                                                        let newEnd = end;

                                                        if (btn.type === 'wrap') {
                                                            newText = text.substring(0, start) + btn.format + selected + btn.format + text.substring(end);
                                                            newStart = start + btn.format.length;
                                                            newEnd = end + btn.format.length;
                                                        } else if (btn.type === 'prefix') {
                                                            newText = text.substring(0, start) + btn.format + selected + text.substring(end);
                                                            newStart = start + btn.format.length;
                                                            newEnd = end + btn.format.length;
                                                        } else if (btn.type === 'link') {
                                                            const url = prompt('Enter URL:', 'https://');
                                                            if (url) {
                                                                const linkText = selected || 'link';
                                                                const linkMd = `[${linkText}](${url})`;
                                                                newText = text.substring(0, start) + linkMd + text.substring(end);
                                                                newStart = start + 1;
                                                                newEnd = start + 1 + linkText.length;
                                                            } else {
                                                                return;
                                                            }
                                                        }

                                                        if (newText) {
                                                            setDescription(newText);
                                                            setTimeout(() => {
                                                                textarea.focus();
                                                                textarea.setSelectionRange(newStart, newEnd);
                                                            }, 0);
                                                        }
                                                    }}
                                                    className="p-1.5 text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
                                                >
                                                    <btn.icon size={14} />
                                                </button>
                                            ))}
                                            <div className="flex-1"></div>
                                            <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600">
                                                <ChevronDown size={14} />
                                            </button>
                                        </div>
                                        <textarea
                                            id="product-description-textarea"
                                            className="w-full p-4 min-h-[180px] text-[14px] outline-none resize-y leading-relaxed"
                                            placeholder="Enter product description..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[11px] text-gray-400">Markdown supported for basic formatting.</p>
                                        <p className="text-[11px] text-gray-400">{description.length} characters</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Product Media */}
                        <section id="Product-Media" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-[16px] font-bold text-gray-900">Product Media</h2>
                                <p className="text-[12px] text-gray-500 mt-1">Upload captivating images and videos. Set one as Thumbnail and one as Cover.</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Media Gallery */}
                                    {[...media, ...(thumbnail ? [{ url: thumbnail, type: 'image', isThumbnail: true }] : []), ...(cover?.url ? [{ url: cover.url, type: cover.type, isCover: true }] : [])]
                                        .reduce((acc, current) => {
                                            const x = acc.find(item => item.url === current.url);
                                            if (!x) return acc.concat([current]);
                                            return acc;
                                        }, [])
                                        .map((item, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden group shadow-sm bg-gray-50">
                                                {item.type === 'video' ? (
                                                    <video src={item.url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={item.url} alt="Product" className="w-full h-full object-cover" />
                                                )}

                                                {/* Badges */}
                                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                    {thumbnail === item.url && (
                                                        <span className="px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded uppercase">Thumb</span>
                                                    )}
                                                    {cover?.url === item.url && (
                                                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded uppercase">Cover</span>
                                                    )}
                                                </div>

                                                {/* Controls Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                    <button
                                                        onClick={() => setThumbnail(item.url)}
                                                        className="w-full py-1.5 bg-white text-[10px] font-bold text-gray-900 rounded hover:bg-gray-100"
                                                    >
                                                        Set Thumbnail
                                                    </button>
                                                    <button
                                                        onClick={() => setCover({ type: item.type, url: item.url })}
                                                        className="w-full py-1.5 bg-white text-[10px] font-bold text-gray-900 rounded hover:bg-gray-100"
                                                    >
                                                        Set Cover
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (thumbnail === item.url) setThumbnail('');
                                                            if (cover?.url === item.url) setCover({ type: 'image', url: '' });
                                                            setMedia(media.filter(m => m.url !== item.url));
                                                        }}
                                                        className="absolute top-2 right-2 text-white hover:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    }

                                    {/* Upload Buttons */}
                                    <div
                                        onClick={() => {
                                            const input = document.createElement('input');
                                            input.type = 'file';
                                            input.accept = 'image/*,video/*';
                                            input.multiple = true;
                                            input.onchange = (e) => {
                                                const files = Array.from(e.target.files);
                                                files.forEach(file => {
                                                    const reader = new FileReader();
                                                    reader.onload = (re) => {
                                                        const type = file.type.startsWith('video') ? 'video' : 'image';
                                                        setMedia(prev => [...prev, { type, url: re.target.result }]);
                                                        if (!thumbnail && type === 'image') setThumbnail(re.target.result);
                                                        if (!cover.url) setCover({ type, url: re.target.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                });
                                            };
                                            input.click();
                                        }}
                                        className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#146eb4] hover:bg-blue-50 transition-all group bg-white"
                                    >
                                        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#146eb4]/10">
                                            <Upload size={20} className="text-gray-400 group-hover:text-[#146eb4]" />
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-500 group-hover:text-[#146eb4]">Add Media</span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-4">Upload multiple images and videos. Mark one for Thumbnail and one for Cover.</p>
                            </div>
                        </section>

                        {/* Inventory */}
                        <section id="Inventory" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleAccordion('inventory')}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <h2 className="text-[16px] font-bold text-gray-900">Inventory</h2>
                                    <p className="text-[12px] text-gray-500 mt-1">Manage your stock levels seamlessly to keep up with customer demand.</p>
                                </div>
                                {openAccordion === 'inventory' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openAccordion === 'inventory' && (
                                <div className="p-6 pt-0 border-t border-gray-100 mt-4 space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                                            <input
                                                type="number"
                                                placeholder="Enter quantity"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-gray-700">SKU ID</label>
                                            <input
                                                type="text"
                                                placeholder="Enter SKU ID"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                value={sku}
                                                onChange={(e) => setSku(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Shipping & Tax */}
                        {(category !== 'Clothing') && (
                            <section id="Shipping-&-Tax" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <button
                                    onClick={() => toggleAccordion('shipping')}
                                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <h2 className="text-[16px] font-bold text-gray-900">Shipping & Tax</h2>
                                        <p className="text-[12px] text-gray-500 mt-1">Configure shipping options and tax rules to streamline your sales process.</p>
                                    </div>
                                    {openAccordion === 'shipping' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openAccordion === 'shipping' && (
                                    <div className="p-6 pt-0 border-t border-gray-100 mt-4 space-y-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-gray-700">Weight (gms)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[13px] font-medium text-gray-700">Dimensions (cm) - L x W x H</label>
                                            <div className="grid grid-cols-3 gap-4">
                                                <input
                                                    type="number"
                                                    placeholder="L"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="W"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                    value={width}
                                                    onChange={(e) => setWidth(e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="H"
                                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Variants */}
                        <section id="Variants" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleAccordion('variants')}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <h2 className="text-[16px] font-bold text-gray-900">Variants</h2>
                                    <p className="text-[12px] text-gray-500 mt-1">
                                        {category === 'Dry Fruits'
                                            ? "Add options for different weights or quantities."
                                            : "Customize variants for size, color, and more to cater to all your customers' preferences."}
                                    </p>
                                </div>
                                {openAccordion === 'variants' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openAccordion === 'variants' && (
                                <div className="p-6 pt-0 border-t border-gray-100 mt-4">
                                    <div className="space-y-4">
                                        {variants.map((variant, index) => (
                                            <div key={index} className="p-4 border rounded-lg bg-gray-50 relative">
                                                <button
                                                    onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                                                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                                <div className="space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {(category === 'Clothing' || category === 'Apparels') ? (
                                                                <>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-gray-400 uppercase">Size</label>
                                                                        <input
                                                                            className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1"
                                                                            value={variant.size || ''}
                                                                            onChange={(e) => {
                                                                                const newVariants = [...variants];
                                                                                newVariants[index].size = e.target.value;
                                                                                newVariants[index].name = `${e.target.value}${newVariants[index].color ? ' / ' + newVariants[index].color : ''}`;
                                                                                setVariants(newVariants);
                                                                            }}
                                                                            placeholder="e.g. XL, M, 42"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-[11px] font-bold text-gray-400 uppercase">Color</label>
                                                                        <input
                                                                            className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1"
                                                                            value={variant.color || ''}
                                                                            onChange={(e) => {
                                                                                const newVariants = [...variants];
                                                                                newVariants[index].color = e.target.value;
                                                                                newVariants[index].name = `${newVariants[index].size ? newVariants[index].size + ' / ' : ''}${e.target.value}`;
                                                                                setVariants(newVariants);
                                                                            }}
                                                                            placeholder="e.g. Red, Blue"
                                                                        />
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-gray-400 uppercase">
                                                                        {category === 'Dry Fruits' ? 'Weight / Pack' : 'Option Name'}
                                                                    </label>
                                                                    <input
                                                                        className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1"
                                                                        value={variant.name}
                                                                        onChange={(e) => {
                                                                            const newVariants = [...variants];
                                                                            newVariants[index].name = e.target.value;
                                                                            setVariants(newVariants);
                                                                        }}
                                                                        placeholder={category === 'Dry Fruits' ? "e.g. 500g, 1kg" : "e.g. Size / Color / Model"}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <label className="text-[11px] font-bold text-gray-400 uppercase">Price</label>
                                                                <div className="relative">
                                                                    <span className="absolute left-0 top-1 text-gray-400 text-[13px]">₹</span>
                                                                    <input
                                                                        type="number"
                                                                        className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1 pl-4"
                                                                        value={variant.price}
                                                                        onChange={(e) => {
                                                                            const newVariants = [...variants];
                                                                            newVariants[index].price = e.target.value;
                                                                            setVariants(newVariants);
                                                                        }}
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="text-[11px] font-bold text-gray-400 uppercase">Sale Price</label>
                                                                <div className="relative">
                                                                    <span className="absolute left-0 top-1 text-gray-400 text-[13px]">₹</span>
                                                                    <input
                                                                        type="number"
                                                                        className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1 pl-4"
                                                                        value={variant.discountedPrice || ''}
                                                                        onChange={(e) => {
                                                                            const newVariants = [...variants];
                                                                            newVariants[index].discountedPrice = e.target.value;
                                                                            setVariants(newVariants);
                                                                        }}
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {(category === 'Clothing' || category === 'Apparels' || category === 'Accessories') && (
                                                                <div>
                                                                    <label className="text-[11px] font-bold text-gray-400 uppercase">SKU</label>
                                                                    <input
                                                                        className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1"
                                                                        value={variant.sku}
                                                                        onChange={(e) => {
                                                                            const newVariants = [...variants];
                                                                            newVariants[index].sku = e.target.value;
                                                                            setVariants(newVariants);
                                                                        }}
                                                                        placeholder="SKU-123"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <label className="text-[11px] font-bold text-gray-400 uppercase">Quantity</label>
                                                                <input
                                                                    type="number"
                                                                    className="w-full bg-transparent border-b border-gray-300 focus:border-[#146eb4] outline-none text-[13px] py-1"
                                                                    value={variant.stock || ''}
                                                                    onChange={(e) => {
                                                                        const newVariants = [...variants];
                                                                        newVariants[index].stock = e.target.value;
                                                                        setVariants(newVariants);
                                                                    }}
                                                                    placeholder="0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Variant Media Section */}
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <label className="text-[11px] font-bold text-gray-400 uppercase">Variant Media</label>
                                                            <span className="text-[10px] text-gray-400">Add unique images/videos for this variant</span>
                                                        </div>
                                                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                                            {/* Variant Media Gallery */}
                                                            {[...(variant.media || []), ...(variant.thumbnail ? [{ url: variant.thumbnail, type: 'image' }] : []), ...(variant.cover?.url ? [{ url: variant.cover.url, type: variant.cover.type }] : [])]
                                                                .reduce((acc, current) => {
                                                                    const x = acc.find(item => item.url === current.url);
                                                                    if (!x) return acc.concat([current]);
                                                                    return acc;
                                                                }, [])
                                                                .map((item, mIdx) => (
                                                                    <div key={mIdx} className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden group shadow-sm bg-gray-50">
                                                                        {item.type === 'video' ? (
                                                                            <video src={item.url} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <img src={item.url} alt="Variant" className="w-full h-full object-cover" />
                                                                        )}

                                                                        {/* Premium Badges for variant */}
                                                                        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                                                                            {variant.thumbnail === item.url && (
                                                                                <span className="px-1.5 py-0.5 bg-green-500 text-white text-[7px] font-bold rounded uppercase shadow-sm">Thumb</span>
                                                                            )}
                                                                            {variant.cover?.url === item.url && (
                                                                                <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[7px] font-bold rounded uppercase shadow-sm">Cover</span>
                                                                            )}
                                                                        </div>

                                                                        {/* Premium Controls Overlay */}
                                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    const nvs = [...variants];
                                                                                    nvs[index].thumbnail = item.url;
                                                                                    setVariants(nvs);
                                                                                }}
                                                                                className="w-full py-1 bg-white text-[8px] font-bold text-gray-900 rounded hover:bg-gray-100 transition-colors"
                                                                            >
                                                                                Thumb
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const nvs = [...variants];
                                                                                    nvs[index].cover = { type: item.type, url: item.url };
                                                                                    setVariants(nvs);
                                                                                }}
                                                                                className="w-full py-1 bg-white text-[8px] font-bold text-gray-900 rounded hover:bg-gray-100 transition-colors"
                                                                            >
                                                                                Cover
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    const nvs = [...variants];
                                                                                    if (nvs[index].thumbnail === item.url) nvs[index].thumbnail = '';
                                                                                    if (nvs[index].cover?.url === item.url) nvs[index].cover = { type: 'image', url: '' };
                                                                                    nvs[index].media = (nvs[index].media || []).filter(m => m.url !== item.url);
                                                                                    setVariants(nvs);
                                                                                }}
                                                                                className="absolute -top-1 -right-1 p-1 text-white bg-red-500 rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg"
                                                                            >
                                                                                <X size={10} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }

                                                            {/* Premium Variant Add Button */}
                                                            <div
                                                                onClick={() => {
                                                                    const input = document.createElement('input');
                                                                    input.type = 'file';
                                                                    input.accept = 'image/*,video/*';
                                                                    input.multiple = true;
                                                                    input.onchange = (e) => {
                                                                        const files = Array.from(e.target.files);
                                                                        files.forEach(file => {
                                                                            const reader = new FileReader();
                                                                            reader.onload = (re) => {
                                                                                const type = file.type.startsWith('video') ? 'video' : 'image';
                                                                                const nvs = [...variants];
                                                                                if (!nvs[index].media) nvs[index].media = [];
                                                                                nvs[index].media.push({ type, url: re.target.result });
                                                                                if (!nvs[index].thumbnail && type === 'image') nvs[index].thumbnail = re.target.result;
                                                                                if (!nvs[index].cover || !nvs[index].cover.url) nvs[index].cover = { type, url: re.target.result };
                                                                                setVariants(nvs);
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        });
                                                                    };
                                                                    input.click();
                                                                }}
                                                                className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#146eb4] hover:bg-blue-50 transition-all group bg-white shadow-sm"
                                                            >
                                                                <div className="p-1.5 bg-gray-100 rounded-lg group-hover:bg-[#146eb4]/10 transition-colors">
                                                                    <Plus size={16} className="text-gray-400 group-hover:text-[#146eb4]" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setVariants([...variants, { name: '', price: '', stock: '', sku: '' }])}
                                            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-[13px] text-gray-500 hover:border-[#146eb4] hover:text-[#146eb4] hover:bg-blue-50 transition-all font-medium flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} /> Add variant
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* SEO */}
                        <section id="Dukaan-SEO" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <button
                                onClick={() => toggleAccordion('seo')}
                                className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <h2 className="text-[16px] font-bold text-gray-900">Dukaan SEO</h2>
                                    <p className="text-[12px] text-gray-500 mt-1">Optimize your product with meta tags to boost its visibility on search engines.</p>
                                </div>
                                {openAccordion === 'seo' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            {openAccordion === 'seo' && (
                                <div className="p-6 pt-0 border-t border-gray-100 mt-4 space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-gray-700">Meta Title</label>
                                        <input
                                            type="text"
                                            placeholder="Enter meta title"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none"
                                            value={metaTitle}
                                            onChange={(e) => setMetaTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[13px] font-medium text-gray-700">Meta Description</label>
                                        <textarea
                                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[14px] focus:ring-2 focus:ring-[#146eb4]/20 focus:border-[#146eb4] outline-none min-h-[100px]"
                                            placeholder="Enter meta description"
                                            value={metaDescription}
                                            onChange={(e) => setMetaDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            )}
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddProduct;
