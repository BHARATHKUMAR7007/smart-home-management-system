import { useState, useEffect } from 'react';
import axios from 'axios';
import { Smartphone, Plus, Save, Trash2, Edit3, Settings, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeviceConfig = ({ selectedHome }) => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'LIGHT',
        powerRating: 0,
        location: '',
        healthStatus: 'ACTIVE'
    });

    useEffect(() => {
        if (selectedHome) fetchDevices();
    }, [selectedHome]);

    const fetchDevices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/technician/homes/${selectedHome.id}/devices`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDevices(response.data);
        } catch (error) {
            console.error('Error fetching devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingDevice) {
                await axios.put(`http://localhost:8081/api/technician/devices/${editingDevice.id}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                await axios.post('http://localhost:8081/api/technician/devices/register', {
                    ...formData,
                    homeownerId: selectedHome.id
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }
            fetchDevices();
            setIsAdding(false);
            setEditingDevice(null);
            setFormData({ name: '', type: 'LIGHT', powerRating: 0, location: '', healthStatus: 'ACTIVE' });
        } catch (error) {
            console.error('Error saving device:', error);
        }
    };

    const startEdit = (device) => {
        setEditingDevice(device);
        setFormData({
            name: device.name,
            type: device.type,
            powerRating: device.powerRating,
            location: device.location,
            healthStatus: device.healthStatus || 'ACTIVE'
        });
        setIsAdding(true);
    };

    if (!selectedHome) return <div className="p-8 text-slate-500">Select a home to manage devices.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Device Configuration</h2>
                    <p className="text-slate-500">Managing devices for {selectedHome.fullName}</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setEditingDevice(null); }}
                    className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg active:scale-95"
                >
                    <Plus size={18} className="mr-2" />
                    Add New Device
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 border border-blue-500/30 overflow-hidden"
                    >
                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2">Device Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                    placeholder="e.g. Living Room AC"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2">Device Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                >
                                    <option value="LIGHT">Light</option>
                                    <option value="AC">AC</option>
                                    <option value="FAN">Fan</option>
                                    <option value="FRIDGE">Fridge</option>
                                    <option value="TV">TV</option>
                                    <option value="HEATER">Heater</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2">Power Rating (W)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.powerRating}
                                    onChange={(e) => setFormData({ ...formData, powerRating: e.target.value })}
                                    className="bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                    placeholder="e.g. Master Bedroom"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2">Health Status</label>
                                <select
                                    value={formData.healthStatus}
                                    onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })}
                                    className="bg-white dark:bg-[#1e1e2d] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white"
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="FAULTY">Faulty</option>
                                    <option value="OFFLINE">Offline</option>
                                </select>
                            </div>
                            <div className="lg:col-span-4 flex justify-end space-x-4 mt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsAdding(false); setEditingDevice(null); }}
                                    className="px-6 py-2 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center px-8 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
                                >
                                    <Save size={18} className="mr-2" />
                                    {editingDevice ? 'Update Device' : 'Register Device'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white dark:bg-[#1e1e2d] rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="px-6 py-4">Device</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Power</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Health</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {devices.map((device) => (
                            <tr key={device.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-white">{device.name}</div>
                                            <div className="text-xs text-slate-400">{device.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{device.location}</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-bold">{device.powerRating}W</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${device.status ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                        {device.status ? 'ON' : 'OFF'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center text-xs font-bold ${device.healthStatus === 'ACTIVE' ? 'text-green-500' : device.healthStatus === 'FAULTY' ? 'text-red-500' : 'text-amber-500'}`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${device.healthStatus === 'ACTIVE' ? 'bg-green-500' : device.healthStatus === 'FAULTY' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                        {device.healthStatus || 'ACTIVE'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => startEdit(device)}
                                        className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {devices.length === 0 && !loading && (
                    <div className="p-12 text-center text-slate-400 italic">No devices found in this home.</div>
                )}
            </div>
        </div>
    );
};

export default DeviceConfig;
