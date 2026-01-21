import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Folder,
    UserCircle,
    LogOut,
    ChevronRight,
    Tag
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useApp();
    const role = user?.role;
    const menuItems = [
        {
            title: 'Dashboard',
            path: '/',
            icon: <LayoutDashboard size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT'],
            exact: true
        },
        {
            title: 'Users',
            path: '/users',
            icon: <Users size={20} />,
            roles: ['SYSTEM_ADMIN']
        },
        {
            title: 'Categories',
            path: '/categories',
            icon: <Folder size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']
        },
        {
            title: 'Kids Products',
            path: '/kids/products',
            icon: <Package size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_KIDS']
        },
        {
            title: 'Kids Orders',
            path: '/kids/orders',
            icon: <ShoppingCart size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_KIDS']
        },
        {
            title: 'Next Products',
            path: '/next/products',
            icon: <Package size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_NEXT']
        },
        {
            title: 'Next Orders',
            path: '/next/orders',
            icon: <ShoppingCart size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_NEXT']
        },
        {
            title: 'Profile',
            path: '/profile',
            icon: <UserCircle size={20} />,
            roles: ['SYSTEM_ADMIN', 'ADMIN_KIDS', 'ADMIN_NEXT']
        }
    ];

    const filteredItems = menuItems.filter(item =>
        item.roles.includes(role)
    );

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl z-[9999]">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Kids & Co
                </h1>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{role?.replace('_', ' ')}</p>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {filteredItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
                  ${isActive
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }
                `}
                            >
                                {item.icon}
                                <span className="font-medium">{item.title}</span>
                                {/* Active Indicator */}
                                <div className={`ml-auto opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0`}>
                                    <ChevronRight size={16} />
                                </div>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-800 relative z-[10000]">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
