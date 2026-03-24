import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Zap, Power, Server, Tv, Wind, Thermometer, MapPin } from 'lucide-react';

const DeviceManager = () => {
    const { token } = useAuth();
    const [devices, setDevices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'OTHER',
        powerRating: '',
        location: ''
    });

    const fetchDevices = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/devices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(response.data);
        } catch (error) {
            console.error("Error fetching devices", error);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, [token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDevice) {
                await axios.put(`http://localhost:8081/api/devices/${editingDevice.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8081/api/devices', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsModalOpen(false);
            setEditingDevice(null);
            setFormData({ name: '', type: 'OTHER', powerRating: '', location: '' });
            fetchDevices();
        } catch (error) {
            console.error("Error saving device", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            try {
                await axios.delete(`http://localhost:8081/api/devices/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchDevices();
            } catch (error) {
                console.error("Error deleting device", error);
            }
        }
    };

    const handleToggle = async (id) => {
        try {
            await axios.patch(`http://localhost:8081/api/devices/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDevices();
        } catch (error) {
            console.error("Error toggling device", error);
        }
    };

    const openEditModal = (device) => {
        setEditingDevice(device);
        setFormData({
            name: device.name,
            type: device.type,
            powerRating: device.powerRating,
            location: device.location || ''
        });
        setIsModalOpen(true);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'AC': return <Wind className="w-6 h-6" />;
            case 'FRIDGE': return <Server className="w-6 h-6" />;
            case 'TV': return <Tv className="w-6 h-6" />;
            case 'FAN': return <Wind className="w-6 h-6" />;
            case 'HEATER': return <Thermometer className="w-6 h-6" />;
            default: return <Zap className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen bg-dashboard-bg transition-colors duration-300 text-gray-100">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 animate-fade-in">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">
                            My Devices
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Manage and optimize your smart home network.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingDevice(null);
                            setFormData({ name: '', type: 'OTHER', powerRating: '', location: '' });
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition shadow-xl shadow-blue-500/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add New Device
                    </button>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block bg-card-bg rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-slate-900/40">
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Icon</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">Identification</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Type</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Rating</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Energy Today</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Power</th>
                                    <th className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence>
                                    {devices.map((device) => (
                                        <motion.tr
                                            key={device.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <div className={`inline-flex p-3 rounded-2xl transition-all ${device.status ? 'bg-cyan-500/20 text-cyan-400 shadow-glow' : 'bg-slate-800 text-slate-500'}`}>
                                                    {getIcon(device.type)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <div className="text-sm font-bold">{device.name}</div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium"><MapPin size={10} /> {device.location || 'Central Home'}</div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase tracking-wider">
                                                    {device.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center font-bold text-sm">
                                                {device.powerRating}W
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">
                                                    <Zap className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-sm font-bold text-emerald-500">{device.todayUsage?.toFixed(2) || '0.00'} kWh</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleToggle(device.id)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border shadow-sm active:scale-95 ${device.status
                                                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-glow'
                                                        : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-500'
                                                        }`}
                                                >
                                                    <Power className="w-4 h-4" />
                                                    <span className="font-bold text-xs uppercase tracking-widest">{device.status ? 'On' : 'Off'}</span>
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <button
                                                        onClick={() => openEditModal(device)}
                                                        className="p-2.5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl transition-all border border-blue-500/10"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(device.id)}
                                                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/10"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {devices.length === 0 && (
                        <div className="p-20 text-center">
                            <Zap size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                            <p className="text-slate-400 font-bold">No appliances connected yet.</p>
                        </div>
                    )}
                </div>

                {/* Mobile & Tablet View: Cards */}
                <div className="lg:hidden space-y-4">
                    {devices.map((device) => (
                        <motion.div
                            key={device.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-3xl border space-y-4 transition-all duration-300 ${device.status ? 'bg-card-bg border-cyan-400/50 shadow-glow' : 'bg-card-bg border-slate-700'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`p-4 rounded-2xl ${device.status ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                                        {getIcon(device.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{device.name}</h3>
                                        <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={10} /> {device.location || 'Central'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle(device.id)}
                                    className={`p-3 rounded-2xl transition-all active:scale-95 border ${device.status ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400 shadow-glow' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                                >
                                    <Power size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div className="bg-white/5 p-3 rounded-2xl">
                                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Energy Today</span>
                                    <span className="text-sm font-bold text-emerald-400">{device.todayUsage?.toFixed(2) || '0.00'} kWh</span>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl">
                                    <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Rating</span>
                                    <span className="text-sm font-bold">{device.powerRating}W</span>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => openEditModal(device)}
                                    className="flex-1 py-3 bg-blue-500/10 text-blue-500 rounded-xl font-bold text-xs uppercase"
                                >
                                    Quick Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(device.id)}
                                    className="px-4 bg-red-500/10 text-red-500 rounded-xl"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {devices.length === 0 && (
                        <div className="py-12 glass rounded-3xl text-center">
                            <p className="text-slate-500 font-bold">No appliances found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-card-bg border border-slate-700 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl overflow-hidden relative text-white"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] pointer-events-none" />

                            <h2 className="text-3xl font-black mb-8 tracking-tight">{editingDevice ? 'Manage Device' : 'Connect Device'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Internal Label</label>
                                    <input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-dashboard-bg border border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-cyan-400 outline-none transition text-white"
                                        placeholder="Kitchen Oven..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Category</label>
                                        <select
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            className="w-full bg-dashboard-bg border border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-cyan-400 outline-none transition appearance-none text-white"
                                        >
                                            <option value="AC">AC Unit</option>
                                            <option value="FRIDGE">Smart Fridge</option>
                                            <option value="TV">Entertainment</option>
                                            <option value="FAN">Climate / Fan</option>
                                            <option value="HEATER">Heating</option>
                                            <option value="LIGHT">Lighting</option>
                                            <option value="OTHER">Other IoT</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Power (W)</label>
                                        <input
                                            type="number"
                                            name="powerRating"
                                            value={formData.powerRating}
                                            onChange={handleInputChange}
                                            className="w-full bg-dashboard-bg border border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-cyan-400 outline-none transition text-white"
                                            placeholder="1200"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">Installation Zone</label>
                                    <input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-dashboard-bg border border-slate-700 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-cyan-400 outline-none transition text-white"
                                        placeholder="e.g. Living Room, Garage"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 bg-slate-800 text-slate-300 font-black rounded-2xl transition hover:bg-slate-700"
                                    >
                                        DISMISS
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl transition shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95"
                                    >
                                        PROCEED
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DeviceManager;
