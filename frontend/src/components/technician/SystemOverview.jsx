import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Activity, AlertTriangle, ShieldCheck, Thermometer, Droplets } from 'lucide-react';
import axios from 'axios';

const SystemOverview = ({ selectedHome }) => {
    const [stats, setStats] = useState({
        totalDevices: 0,
        activeDevices: 0,
        alerts: 0,
        energyUsage: '0.00'
    });
    const [recentAlerts, setRecentAlerts] = useState([]);

    const fetchSystemSummary = async () => {
        try {
            const devRes = await axios.get(`http://localhost:8081/api/technician/homes/${selectedHome.id}/devices`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const devices = devRes.data;
            const active = devices.filter(d => d.status).length;

            // Fetch logs to count alerts
            let alertCount = 0;
            const allLogs = [];
            for (const dev of devices) {
                const logRes = await axios.get(`http://localhost:8081/api/technician/devices/${dev.id}/logs`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                alertCount += logRes.data.length;
                logRes.data.forEach(log => allLogs.push({ ...log, deviceName: dev.name }));
            }

            setStats({
                totalDevices: devices.length,
                activeDevices: active,
                alerts: alertCount,
                energyUsage: (Math.random() * 5 + 2).toFixed(2) // Mocked for summary
            });

            setRecentAlerts(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5));
        } catch (error) {
            console.error('Error fetching system summary:', error);
        }
    };

    useEffect(() => {
        if (selectedHome) {
            fetchSystemSummary();
        }
    }, [selectedHome]);

    if (!selectedHome) return <div className="p-8 text-slate-500 font-medium">Please select a homeowner to view system overview.</div>;

    const cards = [
        { label: 'Active Devices', value: `${stats.activeDevices}/${stats.totalDevices}`, icon: <Activity size={24} />, color: 'blue' },
        { label: 'System Alerts', value: stats.alerts, icon: <AlertTriangle size={24} />, color: 'red', alert: stats.alerts > 0 },
        { label: 'Energy Load', value: `${stats.energyUsage} kW`, icon: <Zap size={24} />, color: 'amber' },
        { label: 'Health Score', value: '98%', icon: <ShieldCheck size={24} />, color: 'green' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-[#1e1e2d] p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden group"
                    >
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${card.color}-500/10 rounded-full blur-2xl group-hover:bg-${card.color}-500/20 transition-all`} />
                        <div className={`p-3 rounded-2xl bg-${card.color}-50 dark:bg-${card.color}-950/20 text-${card.color}-600 dark:text-${card.color}-400 w-fit mb-4`}>
                            {card.icon}
                        </div>
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">
                            {card.value}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {card.label}
                        </div>
                        {card.alert && (
                            <div className="absolute top-4 right-4 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Environment Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex items-center space-x-6 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <div className="p-4 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl">
                                    <Thermometer size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Temperature</p>
                                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">22.4 °C</h4>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl">
                                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                                    <Droplets size={32} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Humidity</p>
                                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">45%</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6">Recent Alerts</h3>
                        <div className="space-y-4">
                            {recentAlerts.map((alert, i) => (
                                <div key={i} className="flex items-start space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-colors group">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
                                    <div>
                                        <h5 className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-red-500 transition-colors">{alert.deviceName}: {alert.errorCode}</h5>
                                        <p className="text-xs text-slate-500 line-clamp-1">{alert.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                            {recentAlerts.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 italic text-sm">No active alerts reported.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemOverview;
