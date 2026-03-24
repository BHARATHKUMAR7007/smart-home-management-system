import { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, TrendingUp, Clock, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const EnergyMonitoring = ({ selectedHome }) => {
    const [usageData, setUsageData] = useState({ current: 0, daily: 0, weekly: 0 });

    // Mocking real-time usage since energy logs might be complex to filter per home instantly
    useEffect(() => {
        const interval = setInterval(() => {
            setUsageData(prev => ({
                ...prev,
                current: (Math.random() * 2 + 1).toFixed(2)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!selectedHome) return <div className="p-8 text-slate-500">Select a home to view energy monitoring.</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 p-6 rounded-[2rem] border border-amber-200/50 dark:border-amber-900/30">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white">
                        <Info size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-100">Read-Only Access</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-400">Technicians can only view energy metrics. Schedule and tariff modifications are restricted.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#1e1e2d] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4 font-black text-xs uppercase tracking-widest">
                        <Zap size={14} className="mr-2" /> Real-time Load
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-black text-slate-800 dark:text-white leading-none">{usageData.current}</span>
                        <span className="text-xl font-bold text-slate-400">kW</span>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 font-bold">Refreshing every 3 seconds</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e2d] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
                    <div className="flex items-center text-green-600 dark:text-green-400 mb-4 font-black text-xs uppercase tracking-widest">
                        <TrendingUp size={14} className="mr-2" /> Daily Forecast
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-black text-slate-800 dark:text-white leading-none">12.4</span>
                        <span className="text-xl font-bold text-slate-400">kWh</span>
                    </div>
                    <p className="mt-4 text-xs text-green-500 font-bold">↑ 2.1% from yesterday</p>
                </div>

                <div className="bg-white dark:bg-[#1e1e2d] p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
                    <div className="flex items-center text-purple-600 dark:text-purple-400 mb-4 font-black text-xs uppercase tracking-widest">
                        <Clock size={14} className="mr-2" /> Peak Hours
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">18:00 - 21:00</span>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 font-bold">Highest demand period</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-10 shadow-sm border border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8">Home Usage Heatmap</h3>
                <div className="h-64 flex items-end space-x-2">
                    {[40, 60, 45, 90, 100, 80, 50, 40, 30, 20, 60, 80, 110, 120, 100, 70, 50, 60, 80, 100, 130, 140, 120, 100].map((h, i) => (
                        <div key={i} className="flex-1 select-none group relative">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${h / 1.5}%` }}
                                className={`w-full rounded-t-lg transition-all ${i >= 18 && i <= 21 ? 'bg-amber-500' : 'bg-blue-500/20 group-hover:bg-blue-500/50'}`}
                            />
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded font-bold transition-opacity">
                                {i}:00
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                </div>
            </div>
        </div>
    );
};

export default EnergyMonitoring;
