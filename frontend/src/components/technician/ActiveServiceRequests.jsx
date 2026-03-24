import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, AlertCircle, Play, CheckCircle2, Filter, Navigation, Phone, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';

const ActiveServiceRequests = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('Today'); // 'Today', 'Upcoming', 'Emergency', 'Area-based'
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
            // Mock data for demo
            setTasks([
                { id: 1, homeownerName: 'Sarah Jenkins', address: '742 Evergreen Terrace, NY', scheduledTime: '10:30 AM', issueType: 'HVAC Offline', priority: 'High', status: 'PENDING', area: 'Area 4' },
                { id: 2, homeownerName: 'Robert Wilson', address: '124 Park Avenue, NY', scheduledTime: '01:00 PM', issueType: 'Smart Lock Failure', priority: 'Medium', status: 'PENDING', area: 'Area 2' },
                { id: 3, homeownerName: 'Emily Davis', address: '55 Birch Lane, NY', scheduledTime: '03:30 PM', issueType: 'Camera Offline', priority: 'Low', status: 'PENDING', area: 'Area 4' },
                { id: 4, homeownerName: 'Michael Brown', address: '89 Oak Street, NY', scheduledTime: 'ASAP', issueType: 'Hub Not Responding', priority: 'High', status: 'PENDING', area: 'Area 1' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'Emergency') return task.priority === 'High';
        if (filter === 'Upcoming') return task.scheduledTime.includes('PM');
        if (filter === 'Area-based') return task.area === 'Area 4'; // Mock area filter
        return true;
    });

    const getPriorityStyles = (p) => {
        switch (p) {
            case 'High': return 'bg-red-500 text-white shadow-red-500/20';
            case 'Medium': return 'bg-orange-500 text-white shadow-orange-500/20';
            case 'Low': return 'bg-green-500 text-white shadow-green-500/20';
            default: return 'bg-slate-500 text-white';
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic">Active Service Requests</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority Panel</p>
                    </div>
                </div>

                <div className="flex bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm overflow-x-auto no-scrollbar">
                    {['Today', 'Upcoming', 'Emergency', 'Area-based'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.map((task, idx) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10 group hover:border-blue-500/50 hover:bg-white dark:hover:bg-white/10 transition-all relative overflow-hidden"
                        >
                            {/* Priority Indicator */}
                            <div className="absolute top-0 right-0 p-4">
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${getPriorityStyles(task.priority)}`}>
                                    {task.priority}
                                </div>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <h4 className="text-base font-black text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">{task.homeownerName}</h4>
                                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        <MapPin size={12} className="mr-1 text-slate-400" /> {task.address}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Scheduled</p>
                                    <div className="flex items-center font-black text-slate-700 dark:text-slate-200 text-xs uppercase">
                                        <Clock size={12} className="mr-2 text-blue-500" /> {task.scheduledTime}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Issue Type</p>
                                    <div className="flex items-center font-black text-slate-700 dark:text-slate-200 text-xs uppercase">
                                        <Shield size={12} className="mr-2 text-red-500" /> {task.issueType}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center group/btn">
                                    Accept / <Play size={12} className="ml-2 group-hover/btn:translate-x-1 transition-transform" /> Start Job
                                </button>
                                <button className="p-3 bg-white dark:bg-[#1e1e2d] text-slate-400 dark:text-slate-500 rounded-xl hover:text-blue-500 border border-slate-200 dark:border-white/5 shadow-sm transition-all">
                                    <Phone size={16} />
                                </button>
                                <button className="p-3 bg-white dark:bg-[#1e1e2d] text-slate-400 dark:text-slate-500 rounded-xl hover:text-green-500 border border-slate-200 dark:border-white/5 shadow-sm transition-all">
                                    <Navigation size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Mock Shield icon
const Shield = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);

export default ActiveServiceRequests;
