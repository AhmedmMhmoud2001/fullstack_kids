import React, { useState, useEffect } from 'react';
import { Eye, Search, X, Package, Truck, CheckCircle, Clock, Filter } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../api/orders';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [audienceFilter, setAudienceFilter] = useState('ALL');

    useEffect(() => {
        loadOrders();
    }, [audienceFilter]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // If audienceFilter is ALL, we don't pass audience to fetchOrders (it uses SYSTEM_ADMIN power to see everything)
            const response = await fetchOrders(audienceFilter === 'ALL' ? null : audienceFilter);
            if (response.success) {
                setOrders(response.data);
            } else {
                setError('Failed to load orders');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            let cancelReason = null;
            if (newStatus === 'CANCELLED') {
                cancelReason = prompt('Please enter the reason for cancellation (this will be sent to the user):');
                if (cancelReason === null) return; // User cancelled the prompt
            }

            const response = await updateOrderStatus(orderId, newStatus, cancelReason);
            if (response.success) {
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus, cancelReason: cancelReason });
                }
                loadOrders();
            }
        } catch (err) {
            alert('Error updating status: ' + err.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PAID': return 'bg-green-100 text-green-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-blue-100 text-blue-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.user && (
            order.user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    const formatAddress = (address) => {
        if (!address) return 'N/A';
        try {
            const addr = typeof address === 'string' ? JSON.parse(address) : address;
            return `${addr.address || ''}, ${addr.city || ''}, ${addr.country || ''}`.replace(/^, /, '');
        } catch (e) {
            return String(address);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading all orders...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">Total Orders Management</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Full control over all Kids & Next system orders</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Filter size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Scope:</span>
                    <select
                        value={audienceFilter}
                        onChange={(e) => setAudienceFilter(e.target.value)}
                        className="text-sm border-none focus:ring-0 cursor-pointer font-bold text-blue-600 outline-none"
                    >
                        <option value="ALL">All Orders (Combined)</option>
                        <option value="KIDS">Kids Audience</option>
                        <option value="NEXT">Next Audience</option>
                    </select>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search all orders by ID, customer name, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto modern-scrollbar">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Discount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total Price</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.user?.firstName} {order.user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-red-600">
                                        {parseFloat(order.discount || 0) > 0 ? `-${parseFloat(order.discount).toFixed(2)} EGP` : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                        {parseFloat(order.totalAmount).toFixed(2)} EGP
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                            className={`px-3 py-1 text-xs font-semibold rounded-full border-none cursor-pointer outline-none ${getStatusColor(order.status)}`}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Eye size={16} />
                                            View Analysis
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analysis Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 bg-white">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Total Analysis: Order #{selectedOrder.id}</h2>
                                <p className="text-sm text-gray-500">System Analysis for Admin Control</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">Customer Intelligence</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Identity</p>
                                            <p className="font-semibold text-gray-900">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                            <p className="text-sm text-blue-500">{selectedOrder.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase font-bold">Contact Points</p>
                                            <p className="text-sm text-gray-700">Phone: {selectedOrder.billingInfo?.phone || 'N/A'}</p>
                                            <p className="text-sm text-gray-700">Address: {formatAddress(selectedOrder.shippingAddress)}</p>
                                        </div>
                                        {selectedOrder.status === 'CANCELLED' && selectedOrder.cancelReason && (
                                            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                                                <p className="text-[10px] text-red-500 uppercase font-bold">Cancellation Reason (Sent to User)</p>
                                                <p className="text-sm text-red-700 leading-relaxed font-medium">{selectedOrder.cancelReason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">Financial Overview</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                                            <span className="text-sm font-semibold text-blue-700">Total Profitability</span>
                                            <span className="text-lg font-black text-blue-600">{parseFloat(selectedOrder.totalAmount).toFixed(2)} EGP</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Subtotal</p>
                                                <p className="text-sm font-medium">{parseFloat(selectedOrder.subtotal).toFixed(2)} EGP</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold">Shipping</p>
                                                <p className="text-sm font-medium">{parseFloat(selectedOrder.shippingFee).toFixed(2)} EGP</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-500 uppercase font-bold">Discount</p>
                                                <p className="text-sm font-medium text-red-600">-{parseFloat(selectedOrder.discount).toFixed(2)} EGP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <h3 className="p-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase">Product Composition</h3>
                                <div className="divide-y divide-gray-100">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                                                {item.product?.thumbnails && (
                                                    <img
                                                        src={Array.isArray(JSON.parse(item.product.thumbnails)) ? JSON.parse(item.product.thumbnails)[0] : JSON.parse(item.product.thumbnails)}
                                                        className="w-full h-full object-cover"
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">{item.productName || item.product?.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} × {parseFloat(item.priceAtPurchase).toFixed(2)} EGP</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-gray-900">{(item.quantity * item.priceAtPurchase).toFixed(2)} EGP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllOrders;
