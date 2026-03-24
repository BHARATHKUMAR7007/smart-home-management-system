import { useState, useEffect } from 'react';
import { Bell, MapPin, User, Search, RefreshCw, ChevronDown, Activity, Zap, Sun, Moon, LogOut, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TopNavBar = ({ metrics, syncStatus = 'online', darkMode, setDarkMode, activeViewLabel }) => {
    const [scrolled, setScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const notifications = [
        { id: 1, type: 'URGENT', message: 'HVAC Failure at 124 Park Ave', time: '2m ago' },
        { id: 2, type: 'NEW', message: 'Installation request: Smart Lock', time: '15m ago' },
        { id: 3, type: 'SYSTEM', message: 'Firmware update required for Hub v2', time: '1h ago' },
    ];

    return (
        <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-[1920px] mx-auto px-6 md:px-10 flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    {/* Contextual Active View Title */}
                    <div className="flex items-center space-x-4">
                        <div className="w-px h-8 bg-slate-200 dark:bg-white/10 hidden md:block" />
                        <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.2em] italic">
                            {activeViewLabel || 'Control Room'}
                        </h2>
                    </div>

                    {/* GPS Location */}
                    <div className="hidden lg:flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white dark:bg-[#11111a] px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <MapPin size={14} className="text-red-500 animate-pulse" />
                        <span>Loc: <span className="text-slate-800 dark:text-white font-black italic">NY CENTRAL DISPATCH</span></span>
                    </div>

                    {/* Sync Status */}
                    <div className="hidden md:flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#11111a] px-5 py-2.5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                        <RefreshCw size={14} className={`text-blue-500 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                        <span>Sync: <span className={syncStatus === 'online' ? 'text-green-500' : 'text-red-500'}>{syncStatus.toUpperCase()}</span></span>
                    </div>
                </div>

                <div className="flex items-center space-x-5">
                    {/* Global Search Interface */}
                    <div className="hidden sm:flex items-center bg-white dark:bg-[#11111a] border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-2 shadow-sm mr-2 w-64 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <Search size={16} className="text-slate-400 group-focus-within:text-blue-500" />
                        <input
                            type="text"
                            placeholder="Search nodes, tasks..."
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-600 dark:text-slate-400 ml-3 w-full uppercase placeholder:text-slate-300"
                        />
                    </div>

                    {/* Utility Controls */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-3 bg-white dark:bg-[#11111a] border border-slate-100 dark:border-white/5 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group"
                        >
                            {darkMode ? <Sun size={20} className="group-hover:rotate-45 transition-transform" /> : <Moon size={20} className="group-hover:-rotate-12 transition-transform" />}
                        </button>
                        <button
                            className="p-3 bg-white dark:bg-[#11111a] border border-slate-100 dark:border-white/5 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shadow-sm"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    {/* Notifications Counter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-3 bg-white dark:bg-[#11111a] border border-slate-100 dark:border-white/5 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all relative group shadow-sm"
                        >
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white dark:border-[#11111a] rounded-full" />
                        </button>
                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#11111a] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden ring-1 ring-black/5"
                                >
                                    <div className="p-5 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 flex justify-between items-center">
                                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-500 italic">Central Logs</h4>
                                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">3 ALERTS</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto no-scrollbar">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-slate-50 dark:border-white/5 last:border-0 relative group">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${n.type === 'URGENT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{n.type}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold">{n.time}</span>
                                                </div>
                                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{n.message}</p>
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Identity Plate */}
                    <div className="flex items-center space-x-4 pl-6 border-l border-slate-100 dark:border-white/5">
                        <div className="text-right hidden sm:block">
                            <h4 className="text-xs font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight italic">A. Rivera</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Tech</p>
                        </div>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 ring-4 ring-white dark:ring-[#11111a] hover:rotate-6 transition-transform cursor-pointer">
                            <User size={22} />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavBar;
