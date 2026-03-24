import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Save, Trash, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduleManager = () => {
    const { token } = useAuth();
    const [devices, setDevices] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [onTime, setOnTime] = useState('');
    const [offTime, setOffTime] = useState('');

    const fetchDevices = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/devices', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDevices(res.data);
        } catch (error) {
            console.error("Error fetching devices", error);
        }
    };

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/schedules', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(res.data);
        } catch (error) {
            console.error("Error fetching schedules", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDevices();
            fetchSchedules();
        }
    }, [token]);

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        if (!selectedDevice) {
            alert("Please select a device");
            return;
        }
        try {
            await axios.post(`http://localhost:8081/api/schedules/device/${selectedDevice}`, {
                onTime: onTime ? onTime + ":00" : null,
                offTime: offTime ? offTime + ":00" : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Schedule set successfully!');
            setOnTime('');
            setOffTime('');
            setSelectedDevice('');
            fetchSchedules();
        } catch (error) {
            console.error("Error adding schedule", error);
            alert("Failed to add schedule");
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (!window.confirm("Delete this schedule?")) return;
        try {
            await axios.delete(`http://localhost:8081/api/schedules/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedules();
        } catch (error) {
            console.error("Error deleting schedule", error);
            alert("Failed to delete schedule");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 mt-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Automation Schedules</h3>
                    <p className="text-sm text-slate-500">Automate your devices to save energy.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> New Schedule
                    </h4>
                    <form onSubmit={handleAddSchedule} className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Device</label>
                            <select
                                value={selectedDevice}
                                onChange={e => setSelectedDevice(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                            >
                                <option value="">Select a device...</option>
                                {devices.map(d => <option key={d.id} value={d.id}>{d.name} ({d.type})</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Turn ON</label>
                                <input
                                    type="time"
                                    value={onTime}
                                    onChange={e => setOnTime(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Turn OFF</label>
                                <input
                                    type="time"
                                    value={offTime}
                                    onChange={e => setOffTime(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-sm transition"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 mt-2"
                        >
                            <Save className="w-4 h-4" /> Save Schedule
                        </button>
                    </form>
                </div>

                {/* Schedules List Section */}
                <div className="lg:col-span-2 flex flex-col p-6 rounded-xl border-2 border-slate-100">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" /> Active Schedules
                    </h4>

                    {schedules.length === 0 ? (
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="bg-orange-100 p-4 rounded-full mb-4">
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 mb-2">Smart Scheduling Tips</h4>
                            <p className="text-slate-500 max-w-md">
                                Did you know? Scheduling high-power devices like heaters and ACs to run during off-peak hours can reduce your energy bill by up to 20%. Add your first schedule to start saving!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence>
                                {schedules.map((schedule) => (
                                    <motion.div
                                        key={schedule.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                                    >
                                        <div>
                                            <h5 className="font-bold text-slate-800">{schedule.device.name}</h5>
                                            <div className="flex items-center gap-3 mt-1 text-sm">
                                                {schedule.onTime && (
                                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">ON at {schedule.onTime.substring(0, 5)}</span>
                                                )}
                                                {schedule.offTime && (
                                                    <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-medium">OFF at {schedule.offTime.substring(0, 5)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Schedule"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScheduleManager;
