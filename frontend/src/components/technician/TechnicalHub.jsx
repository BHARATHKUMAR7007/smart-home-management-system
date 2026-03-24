import { useState } from 'react';
import { Activity, Server, Globe, Signal, Terminal, Clock } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const TechnicalHub = () => {
    const [stats, setStats] = useState({
        nodesOnline: 124,
        totalCalls: 12,
        avgLatency: '14ms',
        uptime: '99.98%'
    });

    const networkData = [
        { time: '00:00', latency: 12, flux: 40 },
        { time: '04:00', latency: 15, flux: 35 },
        { time: '08:00', latency: 18, flux: 80 },
        { time: '12:00', latency: 14, flux: 95 },
        { time: '16:00', latency: 16, flux: 70 },
        { time: '20:00', latency: 13, flux: 50 },
        { time: '23:59', latency: 12, flux: 45 },
    ];

    const serviceQueue = [
        { id: 'T-801', target: 'Property #442', issue: 'Sensor Malfunction', priority: 'URGENT', time: '10:15' },
        { id: 'T-802', target: 'Property #129', issue: 'F/W Sync Failure', priority: 'HIGH', time: '11:30' },
        { id: 'T-803', target: 'Property #550', issue: 'Battery Replacement', priority: 'NORMAL', time: '14:00' },
    ];

    const [logs, setLogs] = useState([
        { id: 1, type: 'info', msg: 'System integrity check completed. 0 errors.', time: '10:55:20' },
        { id: 2, type: 'warn', msg: 'Node ID: 442-A reporting low RSSI (-82dB).', time: '10:56:45' },
        { id: 3, type: 'info', msg: 'Encrypted tunnel established with Gateway-02.', time: '10:58:12' },
        { id: 4, type: 'info', msg: 'Pushing F/W update v3.4 to Segment-C...', time: '11:02:05' },
    ]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 h-full">
            {/* Left Side: Diagnostics & Monitor (60%) */}
            <div className="lg:col-span-3 space-y-10">
                {/* Global KPI Headers */}
                <div className="grid grid-cols-4 gap-6">
                    {[
                        { label: 'Nodes Active', val: stats.nodesOnline, icon: <Server size={18} />, color: 'text-blue-500' },
                        { label: 'Open Tasks', val: stats.totalCalls, icon: <Activity size={18} />, color: 'text-amber-500' },
                        { label: 'Avg Latency', val: stats.avgLatency, icon: <Signal size={18} />, color: 'text-green-500' },
                        { label: 'System Uptime', val: stats.uptime, icon: <Globe size={18} />, color: 'text-indigo-500' },
                    ].map((kpi, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col justify-between h-32">
                            <div className={`${kpi.color} bg-slate-50 w-10 h-10 rounded-xl flex items-center justify-center`}>
                                {kpi.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{kpi.label}</p>
                                <p className="text-lg font-black text-slate-800">{kpi.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Stream (Live Logs) */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                        <div className="flex items-center space-x-3 text-slate-800">
                            <Terminal size={20} className="text-blue-500" />
                            <h3 className="text-sm font-black uppercase tracking-widest italic">Live Diagnostic Stream</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="px-2 py-1 bg-green-100 text-green-600 rounded-md text-[9px] font-black">STABLE</div>
                            <div className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-[9px] font-black italic">ENCRYPTED</div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
                        {logs.map(log => (
                            <div key={log.id} className="font-mono text-[11px] flex space-x-4 border-l-2 border-slate-50 pl-4 py-1 hover:bg-slate-50 transition-colors">
                                <span className="text-slate-400">[{log.time}]</span>
                                <span className={log.type === 'warn' ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                                    {log.type.toUpperCase()}: {log.msg}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50">
                        <div className="flex bg-slate-100 rounded-xl p-3 items-center">
                            <span className="text-blue-500 font-bold mr-3">{'>'}</span>
                            <input type="text" placeholder="Access console..." className="bg-transparent border-none outline-none text-[11px] font-mono w-full text-slate-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Network & Queue (40%) */}
            <div className="lg:col-span-2 flex flex-col space-y-10">
                {/* Network Flux Area Chart */}
                <div className="bg-transparent h-[250px] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Network Throughput</h3>
                        <div className="flex items-center text-white/40 text-[9px] font-black uppercase tracking-widest">
                            ms / 24h
                        </div>
                    </div>
                    <div className="flex-1 -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={networkData}>
                                <defs>
                                    <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8ED6F4" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#8ED6F4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', background: '#202136', color: '#fff', fontSize: '10px' }}
                                />
                                <Area type="stepBefore" dataKey="flux" stroke="#8ED6F4" strokeWidth={2} fill="url(#fluxGrad)" />
                                <Area type="monotone" dataKey="latency" stroke="#FFE169" strokeWidth={1} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Service Workflow Queue */}
                <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 flex flex-col border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Activity size={150} className="text-white" />
                    </div>

                    <div className="relative mb-8">
                        <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-1">Service Dispatch Queue</h4>
                        <div className="w-12 h-1 bg-[#8ED6F4] rounded-full" />
                    </div>

                    <div className="space-y-4">
                        {serviceQueue.map((job, idx) => (
                            <div key={job.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-2 h-2 rounded-full ${job.priority === 'URGENT' ? 'bg-red-500 animate-pulse' : 'bg-blue-400'}`} />
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{job.id} · {job.time}</p>
                                        <h5 className="text-xs font-bold text-white uppercase tracking-tight">{job.target}</h5>
                                        <p className="text-[9px] text-white/40 font-bold uppercase">{job.issue}</p>
                                    </div>
                                </div>
                                <button className="p-2 bg-white/10 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-[#8ED6F4]">
                                    <Clock size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="mt-8 w-full py-4 bg-[#FFE169] rounded-2xl text-[#202136] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-yellow-500/10 hover:scale-[1.02] transition-transform">
                        Initiate Global Scan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TechnicalHub;
