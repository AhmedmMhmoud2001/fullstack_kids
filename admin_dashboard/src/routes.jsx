import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import KidsProducts from './pages/KidsProducts';
import KidsOrders from './pages/KidsOrders';
import NextProducts from './pages/NextProducts';
import NextOrders from './pages/NextOrders';
import Users from './pages/Users';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import ProductForm from './pages/ProductForm';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import ContactMessages from './pages/Contact';
import Brands from './pages/Brands';
import StaticPages from './pages/StaticPages';
import Coupons from './pages/Coupons';
import AllOrders from './pages/AllOrders';
import Settings from './pages/Settings';

// Role Constants
const ROLES = {
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
    ADMIN_KIDS: 'ADMIN_KIDS',
    ADMIN_NEXT: 'ADMIN_NEXT',
};

// Protected Route Component
const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useApp();

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<DashboardLayout />}>
                {/* Dashboard Home - All Admin Roles */}
                <Route
                    index
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <DashboardHome />
                        </ProtectedRoute>
                    }
                />

                {/* Kids Section */}
                <Route path="kids">
                    <Route
                        path="products"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS]}>
                                <KidsProducts />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="products/new"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS]}>
                                <ProductForm audience="KIDS" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="products/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS]}>
                                <ProductForm audience="KIDS" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="orders"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS]}>
                                <KidsOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route index element={<Navigate to="products" replace />} />
                </Route>

                {/* Next Section */}
                <Route path="next">
                    <Route
                        path="products"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_NEXT]}>
                                <NextProducts />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="products/new"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_NEXT]}>
                                <ProductForm audience="NEXT" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="products/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_NEXT]}>
                                <ProductForm audience="NEXT" />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="orders"
                        element={
                            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_NEXT]}>
                                <NextOrders />
                            </ProtectedRoute>
                        }
                    />
                    <Route index element={<Navigate to="products" replace />} />
                </Route>

                {/* Users Section - SYSTEM_ADMIN only */}
                <Route
                    path="users"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                            <Users />
                        </ProtectedRoute>
                    }
                />

                {/* System Orders - SYSTEM_ADMIN only */}
                <Route
                    path="orders"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                            <AllOrders />
                        </ProtectedRoute>
                    }
                />

                {/* Categories Section - Admins only */}
                <Route
                    path="categories"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <Categories />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="categories/new"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <CategoryForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="categories/:id/edit"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <CategoryForm />
                        </ProtectedRoute>
                    }
                />

                {/* Profile - All roles */}
                <Route
                    path="profile"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="notifications"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <Notifications />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="contact"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <ContactMessages />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="brands"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN, ROLES.ADMIN_KIDS, ROLES.ADMIN_NEXT]}>
                            <Brands />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="static-pages"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                            <StaticPages />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="coupons"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                            <Coupons />
                        </ProtectedRoute>
                    }
                />

                {/* Global Settings - SYSTEM_ADMIN only */}
                <Route
                    path="settings"
                    element={
                        <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]}>
                            <Settings />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Catch all redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default DashboardRoutes;
