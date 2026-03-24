import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Smartphone, WifiOff, RefreshCcw, Lightbulb, Thermometer, Shield, Camera, Bell, Zap, Battery, Activity, HardDrive, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const ConnectedDevicesSummary = () => {
    // Detailed stats as requested in Section 2
    const stats = [
        { label: 'Total Homes Assigned', value: 8, icon: <Home size={20} />, color: 'blue' },
        { label: 'Devices Under Maintenance', value: 48, icon: <HardDrive size={20} />, color: 'indigo' },
        { label: 'Devices Offline', value: 2, icon: <WifiOff size={20} />, color: 'red', alert: true },
        { label: 'F/W Updates Pending', value: 5, icon: <RefreshCcw size={20} />, color: 'amber' },
    ];

    const categories = [
        { name: 'Smart Lights', icon: <Lightbulb size={18} />, count: 12, color: 'amber' },
        { name: 'Smart Thermostats', icon: <Thermometer size={18} />, count: 4, color: 'blue' },
        { name: 'Smart Locks', icon: <Shield size={18} />, count: 6, color: 'green' },
        { name: 'Security Cameras', icon: <Camera size={18} />, count: 8, color: 'purple' },
        { name: 'Alarm Systems', icon: <Bell size={18} />, count: 3, color: 'red' },
        { name: 'Smart Plugs', icon: <Zap size={18} />, count: 15, color: 'indigo' },
    ];

    const detailedDevices = [
        { id: 1, name: 'HVAC Sensor Hub', status: 'Offline', sync: '10m ago', battery: 85, firmware: 'v2.1.0', error: 'Connection Timed Out' },
        { id: 2, name: 'Main Entry Camera', status: 'Error', sync: '2h ago', battery: 12, firmware: 'v1.5.4', error: 'Lens Obstruction' },
    ];

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((s, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 group">
                        <div className={`p-2 w-10 h-10 rounded-xl bg-white dark:bg-[#1e1e2d] shadow-sm mb-3 flex items-center justify-center text-${s.color}-500`}>
                            {s.icon}
                        </div>
                        <div className="text-xl font-black text-slate-800 dark:text-white leading-none mb-1">{s.value}</div>
                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic leading-tight">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                <div className="border-t border-slate-50 dark:border-white/5 pt-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">Device Categories</h4>
                    <div className="grid grid-cols-3 gap-3">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-white/5 rounded-2xl group cursor-pointer hover:bg-blue-600 transition-all">
                                <div className={`mb-2 text-${cat.color}-500 group-hover:text-white`}>{cat.icon}</div>
                                <span className="text-[8px] font-black text-slate-400 uppercase group-hover:text-white/60">{cat.name}</span>
                                <span className="text-xs font-black text-slate-800 dark:text-white group-hover:text-white leading-none mt-1">{cat.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-50 dark:border-white/5 pt-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">System Health Log</h4>
                    <div className="space-y-4">
                        {detailedDevices.map(dev => (
                            <div key={dev.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h5 className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">{dev.name}</h5>
                                        <p className="text-[8px] font-bold text-red-500 uppercase">{dev.error}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="text-[8px] font-black text-slate-400 bg-white dark:bg-[#1e1e2d] px-2 py-0.5 rounded-full border border-slate-100 dark:border-white/5">{dev.firmware}</div>
                                        <div className={`w-2 h-2 rounded-full ${dev.status === 'Offline' ? 'bg-red-500' : 'bg-amber-500'} animate-pulse`} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="flex items-center text-[9px] font-bold text-slate-400">
                                        <Battery size={10} className="mr-1.5 text-blue-500" /> {dev.battery}%
                                    </div>
                                    <div className="flex items-center text-[9px] font-bold text-slate-400">
                                        <Activity size={10} className="mr-1.5 text-green-500" /> {dev.sync}
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                    Diagnostic Mode
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectedDevicesSummary;
