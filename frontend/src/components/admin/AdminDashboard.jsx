import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Settings, LogOut, Shield, Database, Bell, LayoutDashboard, Sliders, Map as MapIcon, ScrollText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserManagement from './UserManagement';
import DeviceManager from '../DeviceManager';
import Rooms from '../Rooms';
import EnergyDashboard from '../EnergyDashboard';
import Notifications from '../Notifications';
import SettingsView from '../Settings';
import EnergyLogsView from '../EnergyLogsView';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ totalUsers: 0, activeDevices: 0, alerts: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8081/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        if (activeTab === 'overview') {
            fetchStats();
        }
    }, [activeTab]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'devices', icon: Sliders, label: 'Device Management' },
        { id: 'rooms', icon: MapIcon, label: 'Rooms / Zones' },
        { id: 'energy', icon: Activity, label: 'Energy Monitoring' },
        { id: 'alerts', icon: Bell, label: 'Alerts & Notifications' },
        { id: 'users', icon: Users, label: 'User Management' },
        { id: 'settings', icon: Settings, label: 'Settings' },
        { id: 'logs', icon: ScrollText, label: 'Logs / History' }
    ];

    const renderView = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-card-bg p-6 rounded-2xl border border-slate-700"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total Users</p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {loadingStats ? '...' : stats.totalUsers}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-card-bg p-6 rounded-2xl border border-slate-700"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#23bbab]/20 text-[#23bbab] flex items-center justify-center">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Active Devices</p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {loadingStats ? '...' : stats.activeDevices}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="bg-card-bg p-6 rounded-2xl border border-slate-700"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">System Alerts</p>
                                        <h3 className="text-2xl font-bold text-white">
                                            {loadingStats ? '...' : stats.alerts}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                );
            case 'devices':
                return <DeviceManager />;
            case 'rooms':
                return <Rooms />;
            case 'energy':
                return <EnergyDashboard />;
            case 'alerts':
                return <Notifications />;
            case 'users':
                return <UserManagement />;
            case 'settings':
                return <SettingsView />;
            case 'logs':
                return <EnergyLogsView />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-dashboard-bg overflow-hidden text-sm">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -280 }} animate={{ x: 0 }}
                className="w-[280px] bg-sidebar-bg border-r border-white/5 flex flex-col relative z-20"
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-wide">Admin Center</h1>
                            <p className="text-xs text-cyan-400/80 font-medium">Smart Power Platform</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
                                        ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}
                                    `}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabAdmin"
                                            className="absolute inset-0 bg-cyan-500/10 border border-cyan-400/50 shadow-glow rounded-xl"
                                        />
                                    )}
                                    <Icon size={20} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400/70'}`} />
                                    <span className="relative z-10 font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-white/5 bg-sidebar-bg">
                    <div className="flex items-center gap-3 mb-6 bg-dashboard-bg p-3 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/30">
                            {user?.fullName?.charAt(0) || <Shield size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'System Admin'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.username || 'admin@smartpower.com'}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto relative bg-dashboard-bg">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#23bbab]/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="p-8 max-w-7xl mx-auto relative z-10 min-h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {renderView()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
