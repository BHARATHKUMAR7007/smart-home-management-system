import { useState, useEffect } from 'react';
import axios from 'axios';
import DeviceForm from './DeviceForm';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Trash2, Edit2, Plus, Server, MapPin, Zap, Fan } from 'lucide-react';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [editingDevice, setEditingDevice] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const { token, user } = useAuth();

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/devices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices', error);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [token]);

    const toggleDevice = async (id) => {
        try {
            await axios.patch(`http://localhost:8081/api/devices/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (error) {
            console.error('Error toggling device', error);
        }
    };

    const deleteDevice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this device?')) return;
        try {
            await axios.delete(`http://localhost:8081/api/devices/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (error) {
            console.error('Error deleting device', error);
        }
    };

    const updateInstallationStatus = async (id, status) => {
        try {
            await axios.patch(`http://localhost:8081/api/devices/${id}/installation`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const updateDeviceSettings = async (id, settings) => {
        try {
            await axios.put(`http://localhost:8081/api/devices/${id}`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (error) {
            console.error('Error updating device settings', error);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" /> My Devices
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and monitor your smart home devices.</p>
                </div>
                {user.role !== 'TECHNICIAN' && (
                    <button
                        onClick={() => { setEditingDevice(null); setShowForm(!showForm); }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-lg shadow-blue-500/30"
                    >
                        {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Device</>}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <DeviceForm
                            fetchDevices={fetchDevices}
                            editingDevice={editingDevice}
                            setEditingDevice={setEditingDevice}
                            closeForm={() => setShowForm(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {devices.map(device => (
                    <motion.div
                        key={device.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        className={`relative rounded-xl border p-5 transition-all duration-300 animate-fade-in ${device.status
                            ? 'bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800/50 border-blue-200 dark:border-blue-700 shadow-md ring-1 ring-blue-100 dark:ring-blue-900/30'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${device.status ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                    {device.type === 'FAN' ? <Fan className={`w-6 h-6 ${device.status ? 'animate-spin' : ''}`} /> : <Zap className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">{device.name}</h3>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">{device.type}</span>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${device.status ? 'bg-emerald-500 status-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        </div>

                        {/* Device Controls */}
                        <div className="space-y-4 mb-4">
                            {device.type === 'AC' && device.status && (
                                <div>
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                                        <span>Temperature</span>
                                        <span>{device.temperature || 24}°C</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="16" max="30"
                                        value={device.temperature || 24}
                                        onChange={(e) => updateDeviceSettings(device.id, { ...device, temperature: e.target.value })}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}

                            {device.type === 'FAN' && device.status && (
                                <div>
                                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-1">
                                        <span>Speed</span>
                                        <span>{device.speed || 1}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1" max="5"
                                        value={device.speed || 1}
                                        onChange={(e) => updateDeviceSettings(device.id, { ...device, speed: e.target.value })}
                                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={() => toggleDevice(device.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${device.status
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'}`}
                            >
                                <Power className="w-4 h-4" /> {device.status ? 'Turn OFF' : 'Turn ON'}
                            </button>

                            {user.role !== 'TECHNICIAN' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setEditingDevice(device); setShowForm(true); }}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 rounded-lg transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteDevice(device.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-lg transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            {devices.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Server className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No devices found. Add one to get started.</p>
                </div>
            )}
        </div>
    );
};

export default DeviceList;
