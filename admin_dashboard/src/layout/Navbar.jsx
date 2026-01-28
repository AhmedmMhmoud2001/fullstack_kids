import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Bell, Search, User, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
    const { user } = useApp();

    return (
        <header className="h-16 bg-white border-b border-gray-100 sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
            {/* Left side - Search or Breadcrumbs */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                >
                    <Menu size={24} />
                </button>
                {/* <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-64 transition-all"
                    />
                </div> */}
            </div>

            {/* Right side - User Menu */}
            <div className="flex items-center gap-4">
                <Link to="/notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </Link>


                <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {user?.role?.replace('_', ' ')}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center border border-white shadow-sm ring-2 ring-gray-50">
                        <User size={20} className="text-blue-600" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
