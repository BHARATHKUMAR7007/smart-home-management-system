import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, History, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CustomerInfo = ({ selectedHome }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedItem, setExpandedItem] = useState(null);

    useEffect(() => {
        if (selectedHome) fetchServiceHistory();
    }, [selectedHome]);

    const fetchServiceHistory = async () => {
        try {
            // Fetch reports for all devices in this home
            const devRes = await axios.get(`http://localhost:8081/api/technician/homes/${selectedHome.id}/devices`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const devices = devRes.data;
            let allReports = [
                { id: 'h1', date: '2026-01-15', technician: 'Alice Smith', device: 'Central Hub', remarks: 'Firmware update applied.', resolution: 'System rebooted and verified.' },
                { id: 'h2', date: '2025-12-10', technician: 'Bob Jones', device: 'HVAC', remarks: 'Reported unusual noise.', resolution: 'Tightened loose fan belt.' }
            ];
            // In a real app, we'd fetch from /api/technician/reports per device or per home
            setHistory(allReports);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedHome) return <div className="p-8 text-slate-500 font-medium">Select a homeowner to view their profile.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-6">
                        <User size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{selectedHome.fullName}</h3>
                    <p className="text-slate-500 font-medium mb-8">Premium Homeowner Since 2023</p>

                    <div className="space-y-4 text-left border-t border-slate-50 dark:border-white/5 pt-8">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-400"><Mail size={18} /></div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedHome.email || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-400"><Phone size={18} /></div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedHome.phoneNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-400"><MapPin size={18} /></div>
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedHome.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center space-x-2 text-slate-400 uppercase tracking-widest text-[10px] font-black mb-4">
                        <FileText size={14} /> <span>Technician Notes</span>
                    </div>
                    <textarea
                        className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-2xl p-4 text-sm text-slate-600 dark:text-slate-400 min-h-[120px] focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Add a private note about this household..."
                    />
                    <button className="w-full mt-4 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20">Save Note</button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-[#1e1e2d] rounded-3xl p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white">Service History</h3>
                            <p className="text-sm text-slate-500">Timeline of past maintenance and repairs</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-slate-400"><History size={20} /></div>
                    </div>

                    <div className="space-y-4">
                        {history.map((item, idx) => (
                            <div key={item.id} className="border border-slate-100 dark:border-white/5 rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                    className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center space-x-6 text-left">
                                        <div className="text-center min-w-[60px]">
                                            <div className="text-xs font-black text-slate-400 uppercase">{item.date.split('-')[1]}</div>
                                            <div className="text-2xl font-black text-slate-800 dark:text-white leading-none">{item.date.split('-')[2]}</div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white">{item.device} Diagnostic</h4>
                                            <p className="text-sm text-slate-500">Fixed by {item.technician}</p>
                                        </div>
                                    </div>
                                    {expandedItem === item.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                </button>
                                <AnimatePresence>
                                    {expandedItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="px-6 pb-6 bg-slate-50/50 dark:bg-white/[0.02]"
                                        >
                                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Observations</h5>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.remarks}</p>
                                                </div>
                                                <div>
                                                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resolution</h5>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.resolution}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerInfo;
