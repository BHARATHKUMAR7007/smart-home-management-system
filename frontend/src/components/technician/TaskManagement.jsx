import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, List, Clock, AlertCircle, CheckCircle2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const TaskManagement = () => {
    const [view, setView] = useState('list'); // 'list' or 'calendar'
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/technician/tasks', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            // Mock data if failed
            setTasks([
                { id: 1, title: 'Smart Lighting Installation', description: 'Install Hue bridge and 6 bulbs in living room', priority: 'HIGH', status: 'PENDING', scheduledDate: new Date().toISOString(), type: 'INSTALLATION', homeownerName: 'John Doe' },
                { id: 2, title: 'HVAC Connectivity Issue', description: 'Thermostat keeps disconnecting from WiFi', priority: 'URGENT', status: 'IN_PROGRESS', scheduledDate: new Date().toISOString(), type: 'TROUBLESHOOTING', homeownerName: 'Jane Smith' },
                { id: 3, title: 'Routine Maintenance', description: 'Check battery levels for all sensors', priority: 'LOW', status: 'COMPLETED', scheduledDate: new Date().toISOString(), type: 'MAINTENANCE', homeownerName: 'Alice Johnson' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-500 text-white shadow-red-500/20';
            case 'HIGH': return 'bg-orange-500 text-white shadow-orange-500/20';
            case 'MEDIUM': return 'bg-blue-500 text-white shadow-blue-500/20';
            case 'LOW': return 'bg-green-500 text-white shadow-green-500/20';
            default: return 'bg-slate-500 text-white shadow-slate-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} className="text-amber-500" />;
            case 'IN_PROGRESS': return <AlertCircle size={16} className="text-blue-500" />;
            case 'COMPLETED': return <CheckCircle2 size={16} className="text-green-500" />;
            default: return <Clock size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex bg-white dark:bg-[#1e1e2d] p-1 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <List size={18} />
                        <span>List View</span>
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${view === 'calendar' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Calendar size={18} />
                        <span>Calendar</span>
                    </button>
                </div>

                <button className="px-6 py-3 bg-slate-800 dark:bg-white text-white dark:text-slate-800 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                    + New Appointment
                </button>
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                    >
                        {tasks.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white dark:bg-[#1e1e2d] p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${getPriorityColor(task.priority)}`}>
                                        {task.priority[0]}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h4 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-tight">{task.title}</h4>
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{task.type}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            <span className="flex items-center">{getStatusIcon(task.status)} <span className="ml-1.5">{task.status.replace('_', ' ')}</span></span>
                                            <span className="flex items-center"><Clock size={14} className="mr-1.5" /> {new Date(task.scheduledDate).toLocaleDateString()}</span>
                                            <span className="font-bold text-slate-800 dark:text-white underline decoration-blue-500/30 underline-offset-4">{task.homeownerName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all">Details</button>
                                    <button className="p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"><MoreVertical size={20} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="bg-white dark:bg-[#1e1e2d] rounded--[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">February 2026</h3>
                            <div className="flex space-x-2">
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"><ChevronLeft /></button>
                                <button className="p-2 hover:bg-slate-100 dark:hover:hover:bg-white/5 rounded-full transition-colors"><ChevronRight /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{day}</div>
                            ))}
                            {[...Array(31)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`aspect-square rounded-2xl border border-slate-50 dark:border-white/5 p-3 flex flex-col justify-between hover:border-blue-500/30 transition-all cursor-pointer group ${i + 1 === 27 ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 border-blue-600' : 'bg-slate-50/50 dark:bg-white/[0.02]'}`}
                                >
                                    <span className={`text-sm font-black ${i + 1 === 27 ? 'text-white' : 'text-slate-400 dark:text-slate-600 group-hover:text-blue-500'}`}>{i + 1}</span>
                                    {(i + 1 === 27 || i + 1 === 28) && (
                                        <div className={`h-1.5 w-full rounded-full ${i + 1 === 27 ? 'bg-white/30' : 'bg-blue-500/40'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TaskManagement;
