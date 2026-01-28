import React, { useState, useEffect } from 'react';
import { Eye, Search, X, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { fetchOrders, updateOrderItemStatus } from '../api/orders';

const OrdersList = ({ audience, title }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, [audience]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await fetchOrders(audience);
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

    const handleUpdateItemStatus = async (itemId, newStatus) => {
        try {
            const response = await updateOrderItemStatus(itemId, newStatus);
            if (response.success) {
                if (selectedOrder) {
                    const updatedItems = selectedOrder.items.map(item =>
                        item.id === itemId ? { ...item, status: newStatus } : item
                    );
                    setSelectedOrder({ ...selectedOrder, items: updatedItems });
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
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
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

    if (loading) return <div className="p-8 text-center">Loading orders...</div>;
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>;

    return (
        <div className="space-y-6 overflow-x-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{title}</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Manage orders for {audience} audience</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search orders by ID, name, or email..."
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
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.user?.firstName} {order.user?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                        ${parseFloat(order.totalAmount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders found
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-slide-in-bottom">
                        <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Order Details #{selectedOrder.id}</h2>
                                <p className="text-xs md:text-sm text-gray-500 mt-1">
                                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6 md:space-y-8 bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer Info</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase">Name</p>
                                            <p className="font-medium text-gray-900 text-sm md:text-base">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase">Email</p>
                                            <p className="font-medium text-gray-900 text-sm md:text-base break-all">{selectedOrder.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase">Phone</p>
                                            <p className="font-medium text-gray-900 text-sm md:text-base">{selectedOrder.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Shipping & Payment</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase">Address</p>
                                            <p className="font-medium text-gray-900 text-sm md:text-base">{selectedOrder.shippingAddress || 'N/A'}</p>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-500 uppercase">Method</p>
                                                <p className="font-medium text-gray-900 text-sm">{selectedOrder.paymentMethod}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase">Status</p>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full mt-1 inline-block ${selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-center">
                                <h3 className="p-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase">Order Items</h3>
                                <div className="divide-y divide-gray-100">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="p-4 flex flex-col sm:flex-row items-center gap-4 md:gap-6 hover:bg-gray-50 transition-colors">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product?.thumbnails && JSON.parse(item.product.thumbnails)[0] ? (
                                                    <img src={JSON.parse(item.product.thumbnails)[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-full h-full p-4 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.product?.name}</h4>
                                                <p className="text-xs text-gray-500 italic">
                                                    Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdateItemStatus(item.id, e.target.value)}
                                                    className="text-[10px] border rounded-lg px-2 py-1 bg-white outline-none transition-all cursor-pointer focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </div>
                                            <div className="text-right min-w-[80px]">
                                                <p className="text-base md:text-lg font-bold text-gray-900">
                                                    ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600 font-semibold text-sm">Total Amount</span>
                                    <span className="text-xl md:text-2xl font-black text-blue-600">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
