import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    TrendingUp, TrendingDown, Users, DollarSign,
    ShoppingCart, Activity, MousePointer2, Percent,
    Eye
} from 'lucide-react';
import { fetchOrders } from '../api/orders';
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-start">
        <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">{value}</h3>
            <div className={`flex items-center gap-1 mt-2 text-sm font-bold ${isDown ? 'text-red-500' : 'text-emerald-500'}`}>
                {isDown ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                <span>{change}</span>
                <span className="text-gray-400 font-medium ml-1">Since last month</span>
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
                const response = await fetchOrders();
                if (response.success) {
                    const orders = response.data;
                    setRecentOrders(orders.slice(0, 5));
                    const revenue = orders.reduce((sum, order) =>
                        order.paymentStatus === 'PAID' ? sum + parseFloat(order.totalAmount) : sum, 0);

                    setStats(prev => ({
                        ...prev,
                        totalOrders: orders.length,
                        totalRevenue: revenue
                    }));
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
        <div className="-m-4 md:-m-6 overflow-x-hidden">
            {/* Header / Dark Background Section */}
            <div className="pt-6 md:pt-10 pb-24 md:pb-32 px-4 md:px-6 bg-slate-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 leading-tight">Performance Overview</h1>
                            <p className="text-slate-500 mt-1 text-sm md:text-base">Real-time statistics for your store</p>
                        </div>
                    </div>

                    {/* Stat Cards Grid - Overlapping bottom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <StatCard
                            title="Traffic"
                            value="350,897"
                            icon={<MousePointer2 size={24} />}
                            change="3.48%"
                            iconBg="bg-pink-500"
                        />
                        <StatCard
                            title="New Users"
                            value="2,356"
                            icon={<Users size={24} />}
                            change="3.48%"
                            isDown
                            iconBg="bg-orange-500"
                        />
                        <StatCard
                            title="Sales"
                            value={stats.totalOrders}
                            icon={<ShoppingCart size={24} />}
                            change="1.10%"
                            isDown
                            iconBg="bg-yellow-500"
                        />
                        <StatCard
                            title="Performance"
                            value={stats.performance}
                            icon={<Percent size={24} />}
                            change="12%"
                            iconBg="bg-cyan-500"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content - Charts Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 space-y-6 md:space-y-8 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Sales Chart */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                            <div>
                                <h3 className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">Overview</h3>
                                <h2 className="text-lg md:text-xl font-bold text-gray-800">Sales Value</h2>
                            </div>
                            <div className="flex bg-slate-50 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                                {['Month', 'Week'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${timeframe === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-indigo-600'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[250px] md:h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(v) => [`$${v.toLocaleString()}`, 'Value']}
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
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Performance</h3>
                            <h2 className="text-xl font-bold text-gray-800">Total orders</h2>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ordersStats}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
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

                {/* Recent Activity Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Transactions</h2>
                            <p className="text-sm text-gray-500 text-balance">A detailed list of the latest orders</p>
                        </div>
                        <button
                            onClick={() => navigate('/kids/orders')}
                            className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                        >
                            View All Orders
                        </button>
                    </div>
                    <div className="overflow-x-auto modern-scrollbar">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Id</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{order.user?.firstName} {order.user?.lastName}</p>
                                                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-indigo-600">
                                            ${parseFloat(order.totalAmount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/kids/orders`)}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600"
                                            >
                                                <Eye size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
