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
                // Refresh order details if modal is open
                if (selectedOrder) {
                    const updatedItems = selectedOrder.items.map(item =>
                        item.id === itemId ? { ...item, status: newStatus } : item
                    );
                    setSelectedOrder({ ...selectedOrder, items: updatedItems });
                }
                loadOrders(); // Refresh list
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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600 mt-1">Manage orders for {audience} audience</p>
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
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
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
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        <Eye size={16} />
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders found
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Order Details #{selectedOrder.id}</h2>
                                <p className="text-sm text-gray-500 mt-1">
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

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50/30">
                            {/* Customer & Shipping Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Customer Info</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="font-medium text-gray-900">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-gray-900">{selectedOrder.user?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="font-medium text-gray-900">{selectedOrder.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Shipping & Payment</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-500">Address</p>
                                            <p className="font-medium text-gray-900">{selectedOrder.shippingAddress || 'N/A'}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Method</p>
                                                <p className="font-medium text-gray-900">{selectedOrder.paymentMethod}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Payment Status</p>
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full mt-1 inline-block ${selectedOrder.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden text-center">
                                <h3 className="p-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">Order Items</h3>
                                <div className="divide-y divide-gray-100">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
                                            {/* Item Image */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product?.thumbnails && JSON.parse(item.product.thumbnails)[0] ? (
                                                    <img src={JSON.parse(item.product.thumbnails)[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="w-full h-full p-6 text-gray-300" />
                                                )}
                                            </div>

                                            {/* Item Info */}
                                            <div className="flex-1 text-center md:text-left">
                                                <h4 className="font-bold text-gray-900">{item.product?.name}</h4>
                                                <p className="text-sm text-gray-500 italic">
                                                    Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Audience: {item.audience}
                                                </p>
                                            </div>

                                            {/* Status Update */}
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleUpdateItemStatus(item.id, e.target.value)}
                                                    className="text-xs border rounded px-2 py-1 bg-white hover:border-blue-500 outline-none transition-all cursor-pointer"
                                                >
                                                    <option value="PENDING">Set Pending</option>
                                                    <option value="PROCESSING">Set Processing</option>
                                                    <option value="SHIPPED">Set Shipped</option>
                                                    <option value="DELIVERED">Set Delivered</option>
                                                    <option value="CANCELLED">Set Cancelled</option>
                                                </select>
                                            </div>

                                            <div className="text-right min-w-[100px]">
                                                <p className="text-lg font-bold text-gray-900">
                                                    ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-gray-600 font-semibold">Total Amount</span>
                                    <span className="text-2xl font-black text-blue-600">${parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
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
