import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, Lightbulb, LayoutGrid, BarChart2, PieChart, Shield, Bell, User, Users, FileText, Settings as SettingsIcon, LogOut, Menu, X, Zap, Sun, Moon, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const menuItems = [
        { path: '/dashboard/home', name: 'Dashboard', icon: <LayoutGrid size={18} /> },
        ...(user?.role === 'TECHNICIAN' ? [{ path: '/technician-hub', name: 'Technician Hub', icon: <Shield size={18} /> }] : []),
        { path: '/dashboard/devices', name: 'Statistics', icon: <BarChart2 size={18} /> },
        { path: '/dashboard/energy-logs', name: 'Reports', icon: <FileText size={18} /> },
        { path: '/dashboard/analytics', name: 'Analytics', icon: <PieChart size={18} /> },
        { path: '/dashboard/profile', name: 'Accounts', icon: <Users size={18} /> },
        { path: '/dashboard/settings', name: 'Settings', icon: <SettingsIcon size={18} /> },
    ];

    return (
        <div className="flex full-viewport-height bg-dashboard-bg transition-colors duration-300">
            {/* Mobile Toggle Hub (Floating) - Always Visible on Mobile */}
            <div className="fixed top-6 left-6 z-[70] md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-2xl shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] active:scale-90 transition-transform"
                >
                    {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[60] md:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    width: window.innerWidth < 768 ? (isOpen ? '100%' : 0) : (isOpen ? 260 : 80),
                    x: window.innerWidth < 768 ? (isOpen ? 0 : -300) : 0
                }}
                className={`bg-sidebar-bg border-r border-white/5 h-full flex flex-col justify-between transition-all duration-300 z-[65] 
                    fixed inset-y-0 left-0 md:relative md:flex`}
                style={{ width: window.innerWidth < 768 ? '100%' : (isOpen ? '260px' : '80px') }}
            >
                <div className="flex flex-col h-full text-white">
                    {/* Logo Section */}
                    <div className="flex items-center px-6 py-10">
                        <div className="w-10 h-10 rounded-2xl bg-[#ea4c89]/20 flex items-center justify-center transition-transform hover:scale-110">
                            <div className="relative">
                                <Home size={18} className="text-[#ea4c89]" />
                                <div className="absolute inset-0 flex items-center justify-center pt-1">
                                    <Fingerprint size={8} className="text-[#ea4c89]" />
                                </div>
                            </div>
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="ml-3 overflow-hidden"
                                >
                                    <h2 className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                                        sicstats
                                    </h2>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1 flex-grow">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => { if (window.innerWidth < 768) setIsOpen(false); }}
                                className={({ isActive }) => `
                                    flex items-center p-3 rounded-xl transition-all duration-200 group
                                    ${isActive ? 'bg-cyan-500/10 text-cyan-400 shadow-glow border border-cyan-400/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className={`transition-transform duration-200 ${isOpen ? 'min-w-[20px]' : 'mx-auto group-hover:scale-110'}`}>{item.icon}</span>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="ml-4 font-bold text-sm whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 space-y-1 mb-6">
                        <button
                            onClick={logout}
                            className="w-full flex items-center p-3 rounded-xl text-slate-400 hover:text-red-400 transition-all duration-200"
                        >
                            <span className={isOpen ? 'min-w-[20px]' : 'mx-auto'}><LogOut size={18} /></span>
                            {isOpen && <span className="ml-4 font-bold text-sm">Logout</span>}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Collapse Trigger for Desktop Only */}
            <div className="hidden md:block fixed bottom-10 left-[70px] z-[70] translate-x-[-50%]">
                <button
                    onClick={toggleSidebar}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all shadow-xl"
                >
                    <Menu size={14} className={isOpen ? 'rotate-90' : 'rotate-0'} style={{ transition: 'transform 0.3s ease' }} />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
