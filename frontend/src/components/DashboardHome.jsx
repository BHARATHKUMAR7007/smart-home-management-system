import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutGrid, Zap, BarChart2, Bell, User, MoreHorizontal, Home, Clock, Hash, Shield } from 'lucide-react';
import EnergyCharts from './EnergyCharts';

const SummaryCards = () => {
    const { token } = useAuth();
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/energy/summary', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSummary(res.data);
            } catch (err) {
                console.error("Error fetching summary:", err);
            }
        };
        fetchSummary();
    }, [token]);

    const cards = [
        { title: 'Active Nodes', value: summary?.totalDevices || 0, icon: <Hash size={18} />, color: 'bg-card-bg text-white border-slate-700', id: '@master' },
        { title: 'Real-time Usage', value: `${summary?.todayConsumption?.toFixed(1) || 0} kWh`, icon: <Home size={18} />, color: 'bg-card-bg text-white border-slate-700', id: 'Smart Home' },
        { title: 'Period Usage', value: `${summary?.monthlyConsumption?.toFixed(1) || 0} kWh`, icon: <Clock size={18} />, color: 'bg-card-bg text-white border-slate-700', id: '@history' },
        { title: 'Expected Cost', value: `₹${summary?.estimatedMonthlyCost?.toFixed(0) || 0}`, icon: <Zap size={18} />, color: 'bg-card-bg text-white border-cyan-400/50 shadow-glow', id: 'Smart Home' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {cards.map((card, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${card.color} p-8 rounded-[2rem] border shadow-sm relative overflow-hidden transition-all duration-300`}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-cyan-400">
                            {card.icon}
                        </div>
                        <span className="text-xs font-bold opacity-60">{card.id}</span>
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">{card.title}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const DashboardHome = () => {
    const { user } = useAuth();
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

    const displayName = user?.fullName || (user?.username?.includes('@') ? user.username.split('@')[0] : user?.username);
    const capitalizedName = displayName ? displayName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : 'User';

    return (
        <div className="min-h-screen animate-fade-in relative transition-colors duration-300 bg-dashboard-bg text-gray-100">

            <div className="mx-auto space-y-10 p-adaptive max-w-[1800px]">
                {/* Header Section */}
                <header className="flex justify-between items-center py-4">
                    <div className="space-y-1">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold tracking-tight"
                        >
                            Dashboard
                        </motion.h1>
                        <p className="text-slate-400 font-medium text-sm">
                            Take a closer look of your performance.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer hover:scale-110 transition-transform">
                            <Bell size={22} className="text-slate-400" />
                            <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full border-2 border-white" />
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                            <div className="relative group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                                    {user?.photoURL ? (
                                        <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-400 to-slate-500 text-white font-bold">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-bold leading-none">{capitalizedName}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Summary Cards */}
                <SummaryCards />

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                    {/* Left Column - Device Activity (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold tracking-tight">Device Activity</h2>
                            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
                                <Clock size={14} />
                                Last week
                                <MoreHorizontal size={14} className="ml-2 rotate-90" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Master Node Sync', tag: '#system #automation #master', icon: <Zap size={18} className="text-cyan-400" />, bg: 'bg-card-bg border border-cyan-400/50 shadow-glow' },
                                { title: 'Solar Array Optimal', tag: '#green #energy #efficiency', icon: <Home size={18} className="text-cyan-400" />, bg: 'bg-card-bg border border-slate-700' },
                                { title: 'Security Perimeter Set', tag: '#safety #nodes #active', icon: <Shield size={18} className="text-cyan-400" />, bg: 'bg-card-bg border border-slate-700' },
                                { title: 'Scheduled Flush Comp.', tag: '#maintenance #optimized', icon: <Clock size={18} className="text-cyan-400" />, bg: 'bg-card-bg border border-slate-700' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={`flex items-center justify-between p-4 rounded-3xl transition-colors group cursor-pointer ${item.bg}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">{item.title}</h4>
                                            <p className="text-[10px] font-medium text-slate-400 mt-0.5">{item.tag}</p>
                                        </div>
                                    </div>
                                    <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={18} className="text-slate-300" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Engagement & Charts (5 cols) */}
                    <div className="lg:col-span-5 space-y-8 flex flex-col">
                        {/* Total Likes style Card */}
                        <div className="bg-card-bg border border-slate-700 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-sm font-bold opacity-80">Grid Score</h3>
                                <p className="text-6xl font-bold tracking-tighter">98.4</p>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold opacity-90">32</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Nodes</p>
                                    </div>
                                    <div className="space-y-1 border-l border-white/20 pl-4">
                                        <p className="text-sm font-bold opacity-90">12</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Active</p>
                                    </div>
                                    <div className="space-y-1 border-l border-white/20 pl-4">
                                        <p className="text-sm font-bold opacity-90">0</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Alerts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Engagement style Chart */}
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-sm font-bold text-slate-400 mb-6">Total Efficiency</h3>
                            <div className="flex-grow min-h-[250px] -mx-4">
                                <EnergyCharts />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
