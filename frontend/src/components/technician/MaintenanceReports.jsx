import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Send, FileText, CheckCircle, Clock, Download, Image as ImageIcon, History, Filter, User, Pencil } from 'lucide-react';
import axios from 'axios';

const MaintenanceReports = ({ selectedHome }) => {
    const [devices, setDevices] = useState([
        { id: 1, name: 'Main Hub', location: 'Living Room' },
        { id: 2, name: 'Smart Lock', location: 'Front Door' },
    ]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [remarks, setRemarks] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [view, setView] = useState('create');
    const [signature, setSignature] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!signature) {
            alert("Digital Signature Required for Finalization");
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setSuccessMsg('Report & Signature Synchronized!');
            setRemarks('');
            setResolutionNotes('');
            setSignature(false);
            setIsSubmitting(false);
            setTimeout(() => setSuccessMsg(''), 3000);
        }, 2000);
    };

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic">Work Reports</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Field Documentation</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button onClick={() => setView('create')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${view === 'create' ? 'bg-white dark:bg-[#1e1e2d] shadow-sm text-blue-600' : 'text-slate-400'}`}>New</button>
                    <button onClick={() => setView('history')} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${view === 'history' ? 'bg-white dark:bg-[#1e1e2d] shadow-sm text-blue-600' : 'text-slate-400'}`}>Logs</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                {view === 'create' ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Target Device</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                                >
                                    {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>

                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none h-24"
                                placeholder="Issue findings..."
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="py-3 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-[9px] font-black uppercase text-slate-400 hover:text-blue-500">
                                    <ImageIcon size={14} className="mr-2" /> Add Photos
                                </button>
                                <button type="button" className="py-3 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-center text-[9px] font-black uppercase text-slate-400 hover:text-blue-500">
                                    <FileText size={14} className="mr-2" /> Attach Log
                                </button>
                            </div>

                            {/* Digital Signature Placeholder */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Customer Digital Signature</label>
                                <div
                                    onClick={() => setSignature(true)}
                                    className={`h-24 bg-slate-50 dark:bg-black/20 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all ${signature ? 'border-green-500 bg-green-500/5' : 'border-slate-200 dark:border-white/10 hover:border-blue-500'}`}
                                >
                                    {signature ? (
                                        <div className="flex flex-col items-center">
                                            <CheckCircle className="text-green-500 mb-1" size={20} />
                                            <span className="text-[8px] font-black text-green-500 uppercase">Signed & Verified</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-300">
                                            <Pencil size={20} className="mb-1" />
                                            <span className="text-[8px] font-black uppercase italic">Click to sign</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            <Send size={16} className="mr-3" /> {isSubmitting ? 'Syncing...' : 'Finalize & Post'}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase italic">Svc#182{i}</span>
                                    <span className="text-[8px] font-bold text-slate-400">12 Feb 2026</span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2">Resolved connectivity jitter on Hub A-42 by replacing capacitor.</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {successMsg && <div className="mt-4 p-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest text-center rounded-xl animate-bounce">{successMsg}</div>}
        </div>
    );
};

export default MaintenanceReports;
