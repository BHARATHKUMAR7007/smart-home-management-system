import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Calendar, Clock, Zap, History, Filter, ChevronRight } from 'lucide-react';

const EnergyLogsView = () => {
    const { token } = useAuth();
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, [token]);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/devices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(response.data);
            if (response.data.length > 0) {
                handleDeviceSelect(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching devices for logs", error);
        }
    };

    const handleDeviceSelect = async (device) => {
        setSelectedDevice(device);
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8081/api/energy/logs/${device.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(res.data);
        } catch (err) {
            console.error("Error fetching logs", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Energy Usage Logs</h1>
            <p className="text-slate-400 mb-8">Detailed historical energy consumption per device.</p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Device Selector Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Select Device
                    </h2>
                    <div className="space-y-2">
                        {devices.map((device) => (
                            <button
                                key={device.id}
                                onClick={() => handleDeviceSelect(device)}
                                className={`w-full text-left p-4 rounded-xl transition-all border ${selectedDevice?.id === device.id
                                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/40 text-white'
                                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700/50'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{device.name}</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedDevice?.id === device.id ? 'rotate-90' : ''}`} />
                                </div>
                                <div className="text-xs opacity-60 mt-1">{device.type} • {device.location}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logs Table Content */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedDevice ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl overflow-hidden shadow-xl"
                        >
                            <div className="p-6 border-b border-slate-700 bg-slate-800/80 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                        <History className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{selectedDevice.name} Logs</h2>
                                        <p className="text-sm text-slate-400 uppercase tracking-wider">{selectedDevice.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-400 text-xs">Total Logs Found</p>
                                    <p className="text-xl font-bold text-blue-400">{logs.length}</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900/50">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Energy Used (kWh)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-20 text-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                                </td>
                                            </tr>
                                        ) : logs.length > 0 ? (
                                            logs.map((log, idx) => (
                                                <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-slate-500" />
                                                            {new Date(log.timestamp).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-slate-400">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-slate-500" />
                                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                            <span className="text-sm font-bold text-white">{log.energyConsumed?.toFixed(3) || '0.000'}</span>
                                                            <Zap className="w-3 h-3 text-yellow-500" />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-20 text-center text-slate-500">
                                                    No consumption logs found for this device.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl h-96 flex flex-col items-center justify-center text-slate-500">
                            <Zap className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a device to view energy history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EnergyLogsView;
