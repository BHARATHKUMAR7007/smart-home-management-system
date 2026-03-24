import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, Home, Fingerprint, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('HOMEOWNER');
    const { register, login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await register(password, role, fullName, email);
            if (success) {
                try {
                    const userData = await login(email, password);
                    if (userData) {
                        if (userData.role === 'ADMIN') {
                            navigate('/admin-dashboard');
                        } else if (userData.role === 'TECHNICIAN') {
                            navigate('/technician-hub');
                        } else {
                            navigate('/dashboard');
                        }
                        return;
                    }
                } catch (err) {
                    console.error("Auto-login failed after registration:", err);
                }
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration component error:", err);
            setError(err.response?.data || 'Registration failed. Try again.');
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const success = await googleLogin(tokenResponse.access_token);
                if (success) navigate('/dashboard');
                else setError('Google Login Failed');
            } catch (err) {
                setError('Google Login Failed');
            }
        },
        onError: () => setError('Google Login Failed'),
    });

    return (
        <div className="auth-split-wrapper relative overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#23bbab]/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[100px] rounded-full"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="auth-container relative z-10"
                id="container"
            >
                {/* Left Side: Welcome Back (Teal Panel) */}
                <div className="auth-info-side overflow-hidden relative">
                    {/* Inner Glow Decorative Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                    <div className="auth-logo-container relative z-10">
                        <div className="auth-logo-icon flex items-center justify-center relative p-0.5">
                            <Home size={14} className="text-white" />
                            <div className="absolute inset-0 flex items-center justify-center pt-0.5">
                                <Fingerprint size={6} className="text-white" />
                            </div>
                        </div>
                        <span className="font-black uppercase tracking-widest text-[#23bbab] text-[10px]">Smart Power</span>
                    </div>

                    <div className="relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="info-heading"
                        >
                            Welcome Back!
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="info-text"
                        >
                            To keep connected with us please login with your personal info
                        </motion.p>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="auth-btn-outline"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </motion.button>
                    </div>
                </div>

                {/* Right Side: Create Account (Form Panel) */}
                <div className="auth-form-side">
                    <motion.h1 variants={itemVariants} className="auth-panel-heading">Create Account</motion.h1>

                    <motion.div variants={itemVariants} className="social-container">
                        <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }} className="social hover:scale-110 transition-transform"><img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /></a>
                        <a href="#" onClick={(e) => e.preventDefault()} className="social hover:scale-110 transition-transform"><img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" /></a>
                        <a href="#" onClick={(e) => e.preventDefault()} className="social hover:scale-110 transition-transform"><img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" /></a>
                    </motion.div>

                    <motion.span variants={itemVariants} className="auth-panel-text">or use your email for registration:</motion.span>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 p-3 bg-red-50/50 border border-red-200 rounded-xl text-red-600 text-sm animate-shake"
                            >
                                {error}
                            </motion.div>
                        )}

                        <motion.div variants={itemVariants} className="auth-input-group group">
                            <User className="auth-input-icon group-focus-within:text-[#23bbab] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="auth-input"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="auth-input-group group">
                            <Mail className="auth-input-icon group-focus-within:text-[#23bbab] transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="Email"
                                className="auth-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="auth-input-group group">
                            <Lock className="auth-input-icon group-focus-within:text-[#23bbab] transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="auth-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-4 mb-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 text-center">Assign Role</label>
                            <div className="flex gap-2">
                                {['HOMEOWNER', 'TECHNICIAN', 'ADMIN'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`flex-1 py-3 px-1 rounded-xl text-[9px] font-black transition-all uppercase tracking-tighter ${role === r
                                            ? 'bg-[#23bbab] text-white shadow-lg shadow-[#23bbab]/30 scale-105'
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                            }`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="auth-btn-primary flex items-center justify-center gap-2 group"
                        >
                            Sign Up
                            <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
