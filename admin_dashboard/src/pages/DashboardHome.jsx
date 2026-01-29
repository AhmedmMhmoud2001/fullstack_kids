import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, DollarSign,
    ShoppingCart, Activity, MousePointer2, Percent,
    Eye, Package, Folder, Tag, Plus, PlusCircle
} from 'lucide-react';
import { fetchOrders } from '../api/orders';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import brandsApi from '../api/brands';
import couponsApi from '../api/coupons';
import { useNavigate } from 'react-router-dom';

// Mock data for charts
const salesData = [
    { name: 'May', value: 5000 },
    { name: 'Jun', value: 18000 },
    { name: 'Jul', value: 12000 },
    { name: 'Aug', value: 28000 },
    { name: 'Sep', value: 16000 },
    { name: 'Oct', value: 38000 },
    { name: 'Nov', value: 22000 },
    { name: 'Dec', value: 55000 },
];

const ordersStats = [
    { name: 'Jul', orders: 25 },
    { name: 'Aug', orders: 20 },
    { name: 'Sep', orders: 30 },
    { name: 'Oct', orders: 22 },
    { name: 'Nov', orders: 17 },
    { name: 'Dec', orders: 29 },
];

const StatCard = ({ title, value, icon, change, isDown, iconBg }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-start hover:shadow-md transition-shadow">
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
            <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${isDown ? 'text-red-500' : 'text-emerald-500'}`}>
                {isDown ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                <span>{change}</span>
            </div>
        </div>
        <div className={`p-3 rounded-full ${iconBg} text-white shadow-lg`}>
            {icon}
        </div>
    </div>
);

const DashboardHome = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0,
        totalCoupons: 0,
        activeUsers: 890,
        performance: "49,65%"
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('Month');
    const navigate = useNavigate();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [ordersRes, productsRes, categoriesRes, brandsRes, couponsRes] = await Promise.all([
                    fetchOrders(),
                    fetchProducts(),
                    fetchCategories(),
                    brandsApi.getAll(),
                    couponsApi.getAll()
                ]);

                if (ordersRes.success) {
                    const orders = ordersRes.data;
                    setRecentOrders(orders.slice(0, 5));
                    const revenue = orders.reduce((sum, order) =>
                        order.status === 'PAID' ? sum + parseFloat(order.totalAmount) : sum, 0);

                    setStats(prev => ({
                        ...prev,
                        totalOrders: orders.length,
                        totalRevenue: revenue,
                        totalProducts: productsRes.success ? productsRes.data.length : 0,
                        totalCategories: categoriesRes.success ? categoriesRes.data.length : 0,
                        totalBrands: brandsRes.success ? brandsRes.data.length : 0, // brandsApi directly returns data or response? check api
                        totalCoupons: couponsRes.success ? couponsRes.data.length : 0
                    }));

                    // Handle brands if they are direct array
                    if (Array.isArray(brandsRes)) {
                        setStats(s => ({ ...s, totalBrands: brandsRes.length }));
                    } else if (brandsRes.success) {
                        setStats(s => ({ ...s, totalBrands: brandsRes.data.length }));
                    }
                }
            } catch (err) {
                console.error('Error loading dashboard stats:', err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    return (
        <div className="-m-4 md:-m-6 overflow-x-hidden bg-gray-50/50">
            {/* Header Section */}
            <div className="pt-6 md:pt-10 pb-32 px-4 md:px-6 bg-slate-900 border-b border-slate-800 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
                        <div>
                            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white leading-tight">Dashboard Overview</h1>
                            <p className="text-slate-400 mt-1 text-sm md:text-lg font-medium">Monitoring your store's growth and inventory</p>
                        </div>
                    </div>

                    {/* Primary Stat Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            title="Total Revenue"
                            value={`${stats.totalRevenue.toFixed(2)} EE`}
                            icon={<DollarSign size={24} />}
                            change="8.5%+"
                            iconBg="bg-emerald-500"
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.totalOrders}
                            icon={<ShoppingCart size={24} />}
                            change="1.10%+"
                            iconBg="bg-amber-500"
                        />
                        <StatCard
                            title="Products"
                            value={stats.totalProducts}
                            icon={<Package size={24} />}
                            change="Live now"
                            iconBg="bg-pink-500"
                        />
                        <StatCard
                            title="Categories"
                            value={stats.totalCategories}
                            icon={<Folder size={24} />}
                            change="Active"
                            iconBg="bg-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* Content Section (Overlapping) */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 space-y-6 md:space-y-8 pb-12 relative z-10">
                {/* Secondary Stats & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Secondary Stats Row */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
                                <Tag size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Brands</p>
                                <p className="text-xl font-black text-gray-800">{stats.totalBrands}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                                <Percent size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Coupons</p>
                                <p className="text-xl font-black text-gray-800">{stats.totalCoupons}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Perf.</p>
                                <p className="text-xl font-black text-gray-800">{stats.performance}</p>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 text-slate-600">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Users</p>
                                <p className="text-xl font-black text-gray-800">{stats.activeUsers}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => navigate('/kids/products/new')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all gap-2 group"
                            >
                                <PlusCircle className="text-gray-300 group-hover:text-blue-500" size={20} />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600 uppercase">Product</span>
                            </button>
                            <button
                                onClick={() => navigate('/categories/new')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 hover:border-pink-400 hover:bg-pink-50 transition-all gap-2 group"
                            >
                                <PlusCircle className="text-gray-300 group-hover:text-pink-500" size={20} />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-pink-600 uppercase">Category</span>
                            </button>
                            <button
                                onClick={() => navigate('/brands')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all gap-2 group"
                            >
                                <PlusCircle className="text-gray-300 group-hover:text-indigo-500" size={20} />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-indigo-600 uppercase">Brand</span>
                            </button>
                            <button
                                onClick={() => navigate('/coupons')}
                                className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all gap-2 group"
                            >
                                <PlusCircle className="text-gray-300 group-hover:text-orange-500" size={20} />
                                <span className="text-[10px] font-bold text-gray-500 group-hover:text-orange-600 uppercase">Coupon</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Sales Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                            <div>
                                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Analytics</h3>
                                <h2 className="text-lg md:text-xl font-bold text-gray-800">Revenue Growth</h2>
                            </div>
                        </div>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#4f46e5"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Total Orders Bar Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Volume</h3>
                            <h2 className="text-xl font-bold text-gray-800">Total orders</h2>
                        </div>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ordersStats}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Transactions</h2>
                            <p className="text-sm text-gray-500">Overview of the last 5 orders placed</p>
                        </div>
                        <button
                            onClick={() => navigate('/kids/orders')}
                            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                        >
                            Manage All Orders
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                                                    {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                                                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-blue-600">
                                            {parseFloat(order.totalAmount).toFixed(2)} EE
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider ${order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/kids/orders`)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">
                                            No recent transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
