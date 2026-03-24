import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const initialFullName = localStorage.getItem('fullName');
    const initialUsername = localStorage.getItem('username');
    const [user, setUser] = useState(token ? { username: initialUsername, fullName: initialFullName, role: role } : null);
    const [hasAttemptedHydration, setHasAttemptedHydration] = useState(false);


    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // If we have a token but no fullName, and haven't tried hydrating yet, fetch the current user profile
            if ((!user || !user.fullName) && !hasAttemptedHydration) {
                setHasAttemptedHydration(true);
                axios.get('http://localhost:8081/api/users/me')
                    .then(res => {
                        const profile = res.data;
                        setUser(prev => ({ ...prev, ...profile, username: profile.username || prev.username }));
                        if (profile.fullName) {
                            localStorage.setItem('fullName', profile.fullName);
                        }
                    })
                    .catch(err => {
                        console.error("Error hydrating profile:", err);
                    });
            }
        } else {
            delete axios.defaults.headers.common['Authorization'];
            // Reset hydration flag if logged out
            if (hasAttemptedHydration) setHasAttemptedHydration(false);
        }
    }, [token, user?.fullName, hasAttemptedHydration]);



    const login = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:8081/api/auth/login', { username, password });
            const { token, role, username: userValues, fullName } = res.data;
            setToken(token);
            setRole(role);
            const userData = { username: userValues, fullName, role };
            setUser(userData);
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('username', userValues);
            localStorage.setItem('fullName', fullName || '');
            return userData;
        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Throwing error instead of returning false
        }
    };

    const register = async (password, role, fullName, email) => {
        try {
            await axios.post('http://localhost:8081/api/auth/register', { password, role, fullName, email });
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error; // Throwing error instead of returning false
        }
    };

    const googleLogin = async (token) => {
        try {
            console.log("Sending Google Token to Backend:", token);
            const res = await axios.post('http://localhost:8081/api/auth/google', { token });
            console.log("Backend Response:", res.data);
            const { token: jwt, role, username: userValues, fullName } = res.data;
            setToken(jwt);
            setRole(role);
            const userData = { username: userValues, fullName, role };
            setUser(userData);
            localStorage.setItem('token', jwt);
            localStorage.setItem('role', role);
            localStorage.setItem('username', userValues);
            localStorage.setItem('fullName', fullName || '');
            return userData;
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error; // Throwing error instead of returning false
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
