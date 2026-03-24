import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    });

    // Update theme when user profile is loaded
    useEffect(() => {
        if (user?.theme) {
            setTheme(user.theme);
        }
    }, [user?.theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        if (token) {
            try {
                await axios.put('http://localhost:8081/api/users/me', { theme: newTheme });
            } catch (err) {
                console.error("Error saving theme to backend:", err);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
