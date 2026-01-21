import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // Load user from localStorage on mount
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    // Authentication functions
    const login = (authData) => {
        // authData = { user, token }
        const userData = authData.user || authData;
        setUser(userData);

        if (authData.token) {
            localStorage.setItem('authToken', authData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
