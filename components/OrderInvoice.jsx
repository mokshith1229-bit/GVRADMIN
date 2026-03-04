import React from 'react';

const OrderInvoice = ({ order }) => {
    if (!order) return null;

    // Data calculations
    const subtotal = order.products?.reduce((acc, p) => acc + (p.price * p.quantity), 0) || 0;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const grandTotal = order.amount || (subtotal + tax);

    const formatDate = (dateString) => {
        const date = dateString ? new Date(dateString) : new Date();
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div
            className="invoice-print-container bg-white text-[#5d4037] font-sans"
            id="printable-invoice"
        >
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@400;600;700&family=Prata&display=swap');

                @media screen {
                    #printable-invoice { display: none !important; }
                }

                @media print {
                    @page { 
                        size: A4; 
                        margin: 0; 
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        height: auto !important;
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body * { 
                        visibility: hidden !important; 
                    }
                    #printable-invoice, #printable-invoice * { 
                        visibility: visible !important; 
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    #printable-invoice {
                        visibility: visible !important;
                        position: relative !important;
                        width: 210mm !important;
                        min-height: 297mm !important;
                        padding: 20mm !important;
                        margin: 0 auto !important;
                        background: white !important;
                        display: flex !important;
                        flex-direction: column !important;
                        overflow: visible !important;
                    }
                    .no-print { display: none !important; }
                }

                #printable-invoice {
                    font-family: 'Outfit', sans-serif;
                }
                .font-serif-invoice {
                    font-family: 'Prata', serif;
                }
                `}
            </style>

            {/* Main Content Area */}
            <div className="flex-1 px-[25mm] pt-[30mm] pb-[10mm] flex flex-col">
                {/* Header section */}
                <div className="flex justify-between items-start mb-24">
                    <div>
                        <h1 className="text-7xl font-sans font-bold text-[#735438] leading-[0.9] tracking-tighter">
                            GVR<br />Cashew<br />Merchants
                        </h1>
                    </div>
                    <div className="text-right pt-2">
                        <h2 className="text-4xl font-sans font-bold text-[#735438] mb-1">Dry Fruits</h2>
                        <p className="text-lg text-stone-400">gvrcashews.com</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-20 mb-20">
                    <div>
                        <h3 className="text-2xl font-bold mb-6 uppercase tracking-[0.2em] text-[#735438]">Invoice</h3>
                        <div className="space-y-1">
                            <p className="text-xl font-bold text-[#5d4037]">Invoice #{order.id?.slice(-6).toUpperCase() || '1001'}</p>
                            <p className="text-xl text-stone-500 font-medium">{formatDate(order.createdAt || order.orderDate)}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-6 uppercase tracking-[0.2em] text-[#735438]">Client Info</h3>
                        <div className="space-y-1">
                            <p className="text-xl font-bold text-[#5d4037]">{order.customer || 'Valued Customer'}</p>
                            <p className="text-xl text-stone-500 font-medium">{order.phone || ''}</p>
                            <div className="text-xl text-stone-500 font-medium leading-relaxed mt-2">
                                {[
                                    order.shippingAddress?.line1,
                                    order.shippingAddress?.city,
                                    order.shippingAddress?.state
                                ].filter(Boolean).join(', ')}
                                {order.shippingAddress?.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-4 border-[#735438]">
                                <th className="py-6 text-xl font-bold text-stone-400 uppercase tracking-[0.15em]">Item</th>
                                <th className="py-6 text-xl font-bold text-stone-400 uppercase tracking-[0.15em] text-center w-32">Quantity</th>
                                <th className="py-6 text-xl font-bold text-stone-400 uppercase tracking-[0.15em] text-right w-40">Unit Price</th>
                                <th className="py-6 text-xl font-bold text-stone-400 uppercase tracking-[0.15em] text-right w-40">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {order.products?.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-8 text-2xl font-bold text-[#5d4037]">{item.name}</td>
                                    <td className="py-8 text-2xl text-center text-stone-500 font-medium">{item.quantity}</td>
                                    <td className="py-8 text-2xl text-right text-stone-500 font-medium">₹{item.price.toLocaleString()}</td>
                                    <td className="py-8 text-2xl text-right font-bold text-[#5d4037]">₹{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer section inside flex container */}
                <div className="mt-12 mr-0">
                    <div className="ml-auto w-[400px]">
                        <div className="border-t-4 border-[#735438] pt-8 space-y-6">
                            <div className="flex justify-between text-2xl">
                                <span className="font-bold text-stone-400 uppercase tracking-[0.1em]">Subtotal</span>
                                <span className="font-bold text-[#5d4037]">₹{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-2xl pb-6 border-b-2 border-stone-100">
                                <span className="font-bold text-stone-400 uppercase tracking-[0.1em]">Tax (5%)</span>
                                <span className="font-bold text-[#5d4037]">₹{tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-6">
                                <h4 className="text-4xl font-bold text-[#735438] uppercase tracking-tighter">Grand Total</h4>
                                <span className="text-6xl font-bold text-[#735438]">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 mb-12">
                    <h4 className="text-6xl font-serif-invoice text-[#735438] italic leading-tight">Thank you</h4>
                </div>
            </div>

            {/* Premium Dark Footer */}
            <div className="bg-[#735438] text-white px-[25mm] py-[15mm] grid grid-cols-2 gap-20 mt-auto">
                <div>
                    <h5 className="text-2xl font-bold mb-6 uppercase tracking-wider">Payment Details</h5>
                    <div className="space-y-2 text-lg text-stone-200/80 font-medium">
                        <p>Any Bank</p>
                        <p>Account Name: GVR Cashew Merchants</p>
                        <p>Account No.: 1234567890</p>
                    </div>
                </div>
                <div>
                    <h5 className="text-2xl font-bold mb-6 uppercase tracking-wider">Contact Info</h5>
                    <div className="space-y-2 text-lg text-stone-200/80 font-medium leading-tight">
                        <p>gvrcashewmerchants9@gmail.com</p>
                        <p>+91 9848190498</p>
                        <p>Suryabagh, Near Leela Mahal Jct., Visakhapatnam - 530020, Andhra Pradesh, India</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderInvoice;
