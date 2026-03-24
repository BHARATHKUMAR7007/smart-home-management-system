import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, Zap, Target, Star, TrendingUp, Clock,
    Shield, MapPin, ClipboardList, Settings, LogOut,
    MessageSquare, ChevronRight, Globe, Cpu, LayoutGrid,
    Search, Server, FileText, Package, Menu, X, ChevronLeft
} from 'lucide-react';

// Import refined components
import TopNavBar from './technician/TopNavBar';
import ActiveServiceRequests from './technician/ActiveServiceRequests';
import ConnectedDevicesSummary from './technician/ConnectedDevicesSummary';
import RealTimeAlertsPanel from './technician/RealTimeAlertsPanel';
import PerformanceMetrics from './technician/PerformanceMetrics';
import FieldMap from './technician/FieldMap';
import Diagnostics from './technician/Diagnostics';
import MaintenanceReports from './technician/MaintenanceReports';
import InventoryTracking from './technician/InventoryTracking';

const TechnicianDashboard = () => {
    const [darkMode, setDarkMode] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState('Operations');
    const [metrics, setMetrics] = useState({
        jobsCompleted: 8,
        weeklySLA: 98.4,
        avgResolution: '42m',
        activeAlerts: 3
    });

    const sidebarItems = [
        { id: 'Operations', label: 'Operation Center', icon: Activity, description: 'Dispatch & Alerts' },
        { id: 'Diagnostics', label: 'Technical Core', icon: Cpu, description: 'Remote Tools' },
        { id: 'Map', label: 'Field Map', icon: MapPin, description: 'Route Optimization' },
        { id: 'History', label: 'Documentation', icon: FileText, description: 'Reports & Inventory' },
    ];

    const renderView = () => {
        switch (activeView) {
            case 'Operations':
                return (
                    <div className="space-y-12">
                        {/* MISSION CRITICAL - DISPATCH & ALERTS */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                            <div className="xl:col-span-8 flex flex-col gap-10">
                                <ActiveServiceRequests />
                            </div>
                            <div className="xl:col-span-4 flex flex-col gap-10">
                                <RealTimeAlertsPanel />
                                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between border border-white/10">
                                    <Activity className="absolute -top-10 -right-10 w-64 h-64 opacity-10" />
                                    <div>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] italic border-b-2 border-white/20 pb-2">Mission Control</h3>
                                            <TrendingUp className="text-green-400" size={24} />
                                        </div>
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-blue-100/60 leading-none">Success Rate</p>
                                                    <p className="text-4xl font-black italic">98.4%</p>
                                                </div>
                                                <Target size={32} className="opacity-40" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-blue-100/60 leading-none">Queue Status</p>
                                                    <p className="text-4xl font-black italic">12/15</p>
                                                </div>
                                                <Clock size={32} className="opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 mt-8">
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-blue-300 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                        </div>
                                        <p className="text-[9px] font-bold mt-2 opacity-50 uppercase">+12% vs Baseline</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PerformanceMetrics metrics={metrics} />
                    </div>
                );
            case 'Diagnostics':
                return (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch h-full">
                        <div className="xl:col-span-4 h-full min-h-[700px]">
                            <ConnectedDevicesSummary />
                        </div>
                        <div className="xl:col-span-8 h-full min-h-[700px]">
                            <Diagnostics />
                        </div>
                    </div>
                );
            case 'Map':
                return (
                    <div className="h-[calc(100vh-180px)] rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#11111a]">
                        <FieldMap fullScreen={true} />
                    </div>
                );
            case 'History':
                return (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
                        <div className="xl:col-span-8 min-h-[600px]">
                            <MaintenanceReports />
                        </div>
                        <div className="xl:col-span-4 flex flex-col gap-10">
                            <InventoryTracking />
                            <div className="bg-white dark:bg-[#11111a] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest italic">Compliance Status</h4>
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/10 text-green-600 flex items-center justify-center">
                                                <Star size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black uppercase text-slate-800 dark:text-white leading-none mb-1">Audit Stream #{i}42</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase italic">Verified • 2h ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-dashboard-bg text-white' : 'bg-[#f8fafc]'} transition-colors duration-500 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative flex`}>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-900/10 blur-[120px] rounded-full" />
            </div>

            {/* TOGGLEABLE SIDEBAR NAVIGATION */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 300 : 100 }}
                className={`flex flex-col h-screen fixed top-0 left-0 z-50 bg-sidebar-bg border-r border-slate-200/60 dark:border-white/5 shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'p-8' : 'p-4 items-center'}`}
            >
                {/* Internal Dashboard Sidebar Branding */}
                <div className={`flex items-center space-x-4 mb-16 ${!isSidebarOpen && 'flex-col space-x-0 space-y-4 pt-4'}`}>
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/40">
                        <Activity size={24} />
                    </div>
                    {isSidebarOpen && (
                        <div className="overflow-hidden">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Technical<span className="text-blue-600">Hub</span></h2>
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">v4.5 PRO</p>
                        </div>
                    )}
                </div>

                {/* Sidebar Navigation Items */}
                <nav className="flex-1 space-y-3">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center p-4 rounded-[1.5rem] transition-all group ${activeView === item.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/50 shadow-glow' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                        >
                            <item.icon size={22} className={`${activeView === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'} shrink-0`} />
                            {isSidebarOpen && (
                                <div className="ml-4 text-left overflow-hidden">
                                    <span className="text-[10px] font-black uppercase tracking-widest block leading-none">{item.label}</span>
                                    <span className={`text-[8px] font-bold block mt-1 uppercase ${activeView === item.id ? 'text-cyan-100/60' : 'text-slate-500'}`}>{item.description}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Sidebar Footer Controls */}
                <div className="mt-auto space-y-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`w-full flex items-center p-4 rounded-[1.5rem] text-slate-400 hover:text-blue-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group`}
                    >
                        {isSidebarOpen ? <ChevronLeft size={22} /> : <Menu size={22} />}
                        {isSidebarOpen && <span className="ml-4 text-[10px] font-black uppercase tracking-[0.2em]">Collapse Hub</span>}
                    </button>
                    {isSidebarOpen && (
                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-black text-slate-800 dark:text-white uppercase tracking-widest">Active Engineer</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight italic">Alex Rivera • Level 5</p>
                        </div>
                    )}
                </div>
            </motion.aside>

            {/* MAIN CONTENT AREA (Padded by sidebar width) */}
            <div className="flex-1 transition-all duration-300" style={{ marginLeft: isSidebarOpen ? '300px' : '100px' }}>
                <TopNavBar
                    metrics={metrics}
                    syncStatus="online"
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    activeViewLabel={sidebarItems.find(i => i.id === activeView)?.label}
                />

                <main className="relative z-10 w-full transition-all duration-500 pb-20">
                    <div className="max-w-[2000px] mx-auto px-6 lg:px-12 mt-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-screen"
                            >
                                <div className="mb-10 flex items-center space-x-4">
                                    <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic shadow-sm">
                                        {sidebarItems.find(i => i.id === activeView)?.label}
                                    </h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent" />
                                </div>

                                {renderView()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Premium Dockable Support UI - Full Floating Context */}
            <button className="fixed bottom-12 right-12 w-16 h-16 bg-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group border-4 border-white dark:border-[#0a0a0f]">
                <MessageSquare size={26} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-[#0f172a] rounded-full animate-pulse shadow-lg" />
            </button>
        </div>
    );
};

export default TechnicianDashboard;
