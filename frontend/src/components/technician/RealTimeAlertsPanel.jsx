import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, Phone, Search, Navigation, Send, Activity } from 'lucide-react';

const RealTimeAlertsPanel = () => {
    const [alerts, setAlerts] = useState([
        { id: 1, type: 'Motion sensor malfunction', time: '11:05 AM', customer: 'Sarah Jenkins', address: '742 Evergreen Terrace', priority: 'High' },
        { id: 2, type: 'Camera offline', time: '10:42 AM', customer: 'John Doe', address: '124 Park Avenue', priority: 'Medium' },
        { id: 3, type: 'Door lock jammed', time: '09:15 AM', customer: 'Emily Davis', address: '55 Birch Lane', priority: 'Critical' },
        { id: 4, type: 'Hub not responding', time: 'Yesterday', customer: 'Michael Brown', address: '89 Oak Street', priority: 'Critical' },
        { id: 5, type: 'Low battery warnings', time: '2 days ago', customer: 'Alice Smith', address: '10 Sky Tower', priority: 'Low' },
    ]);

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic">Real-Time Alerts</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Critical malfunctions</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Scanning Live</span>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                    {alerts.map((alert, idx) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10 group hover:bg-white dark:hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-2 h-2 rounded-full ${alert.priority === 'Critical' ? 'bg-red-500' : alert.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase italic tracking-tight">{alert.type}</h4>
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <Clock size={12} className="mr-1.5" /> {alert.time}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white dark:bg-[#1e1e2d] rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                                        <User size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-800 dark:text-white leading-tight uppercase tracking-tight">{alert.customer}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">{alert.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#1e1e2d] border border-slate-100 dark:border-white/5 rounded-2xl hover:text-blue-500 transition-all group/btn">
                                    <Phone size={16} className="mb-2" />
                                    <span className="text-[7px] font-black uppercase text-center leading-none">Call<br />Customer</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 bg-white dark:bg-[#1e1e2d] border border-slate-100 dark:border-white/5 rounded-2xl hover:text-orange-500 transition-all group/btn">
                                    <Activity size={16} className="mb-2" />
                                    <span className="text-[7px] font-black uppercase text-center leading-none">Remote<br />Diagnose</span>
                                </button>
                                <button className="flex flex-col items-center justify-center p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                                    <Navigation size={16} className="mb-2" />
                                    <span className="text-[7px] font-black uppercase text-center leading-none italic">Dispatch</span>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button className="w-full mt-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-dashed border-slate-200 dark:border-white/10">
                Silence Low-Priority Alerts
            </button>
        </div>
    );
};

// Mock User icon
const User = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export default RealTimeAlertsPanel;
