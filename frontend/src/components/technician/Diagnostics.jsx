import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCw, Terminal, Zap, ShieldAlert, Wifi, Battery, Server, Cpu, Settings2, BrainCircuit, Sparkles, AlertCircle } from 'lucide-react';

const Diagnostics = ({ selectedHome }) => {
    const [devices, setDevices] = useState([
        { id: 1, name: 'Main Hub', type: 'Gateway', healthStatus: 'ACTIVE', signal: '94%', battery: 100, firmware: '3.4.1' },
        { id: 2, name: 'Smart Lock', type: 'Security', healthStatus: 'WARN', signal: '42%', battery: 15, firmware: '2.4.9' },
        { id: 3, name: 'HVAC Unit', type: 'Appliance', healthStatus: 'ACTIVE', signal: '81%', battery: 100, firmware: '1.2.0' },
    ]);
    const [actionLoading, setActionLoading] = useState(null);
    const [showAI, setShowAI] = useState(true);
    const [consoleOutput, setConsoleOutput] = useState([
        { time: '11:25:01', msg: 'Core Diagnostic Engine v4.2 started.', type: 'info' },
        { time: '11:25:05', msg: 'AI Fault Predictor: Online', type: 'success' }
    ]);

    const addToConsole = (msg, type = 'info') => {
        const time = new Date().toLocaleTimeString();
        setConsoleOutput(prev => [{ time, msg, type }, ...prev].slice(0, 50));
    };

    const handleRemoteAction = (deviceId, action) => {
        setActionLoading(`${deviceId}-${action}`);
        addToConsole(`Executing ${action.toUpperCase()} on SegmentID: ${deviceId}...`);

        setTimeout(() => {
            addToConsole(`${action.toUpperCase()} successful. Returning code: 0x00`, 'success');
            setActionLoading(null);
        }, 1500);
    };

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                        <Settings2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic">Technical Core</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Remote Diagnostics</p>
                    </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                    <button onClick={() => setShowAI(false)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${!showAI ? 'bg-white dark:bg-[#1e1e2d] shadow-sm text-blue-600' : 'text-slate-400'}`}>Standard</button>
                    <button onClick={() => setShowAI(true)} className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${showAI ? 'bg-white dark:bg-[#1e1e2d] shadow-sm text-indigo-600' : 'text-slate-400'}`}>AI Pro</button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {showAI && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="mb-8 p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] text-white overflow-hidden relative"
                    >
                        <Sparkles className="absolute -top-4 -right-4 opacity-10 w-24 h-24" />
                        <div className="flex items-center space-x-3 mb-4">
                            <BrainCircuit size={20} className="text-blue-200" />
                            <h4 className="text-xs font-black uppercase tracking-[0.2em]">Fault Prediction Analyst</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle size={16} className="text-amber-300 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider mb-1">Predicted Failure</p>
                                        <p className="text-xs font-bold leading-tight">Node A-12 (Smart Lock) showing capacitor decay. Predicted offline in 48h.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="flex items-start space-x-3">
                                    <Zap size={16} className="text-blue-200 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider mb-1">Auto-Troubleshooting</p>
                                        <p className="text-xs font-bold leading-tight italic">"Force firmware rollback to v2.4.5 to stabilize signal jitter."</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2 mb-6">
                {devices.map((device) => (
                    <div key={device.id} className="p-5 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/10 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${device.healthStatus === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Cpu size={18} />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{device.name}</h5>
                                    <div className="flex items-center space-x-2 text-[8px] font-bold text-slate-400 uppercase">
                                        <Wifi size={10} className="text-blue-500" /> <span>{device.signal}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleRemoteAction(device.id, 'reboot')} className="p-2 bg-white dark:bg-[#1e1e2d] rounded-lg text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                    <RefreshCw size={14} className={actionLoading === `${device.id}-reboot` ? 'animate-spin' : ''} />
                                </button>
                                <button onClick={() => handleRemoteAction(device.id, 'reset')} className="p-2 bg-white dark:bg-[#1e1e2d] rounded-lg text-slate-400 hover:text-red-500 transition-all shadow-sm">
                                    <ShieldAlert size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-[9px] font-black text-slate-400 uppercase">
                                <Battery size={10} className="mr-1.5 text-blue-500" /> {device.battery}%
                            </div>
                            <span className="text-[8px] font-black text-slate-300 uppercase italic">F/W {device.firmware}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Terminal Preview */}
            <div className="h-24 bg-[#0f172a] rounded-3xl p-4 border border-slate-800 relative overflow-hidden">
                <div className="h-full overflow-y-auto space-y-1 font-mono text-[9px] no-scrollbar">
                    {consoleOutput.map((log, i) => (
                        <div key={i} className="flex space-x-2">
                            <span className="text-slate-600">[{log.time}]</span>
                            <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}>
                                {log.msg}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Diagnostics;
