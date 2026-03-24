import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Target, Clock, Zap, Star, TrendingUp, Filter } from 'lucide-react';

const PerformanceMetrics = ({ metrics = {} }) => {
    const data = [
        { name: 'Mon', jobs: 8 },
        { name: 'Tue', jobs: 12 },
        { name: 'Wed', jobs: 7 },
        { name: 'Thu', jobs: 15 },
        { name: 'Fri', jobs: 10 },
        { name: 'Sat', jobs: 5 },
        { name: 'Sun', jobs: 3 },
    ];

    const issueDistribution = [
        { name: 'HVAC', value: 40, color: '#3b82f6' },
        { name: 'Security', value: 30, color: '#ef4444' },
        { name: 'Lighting', value: 20, color: '#f59e0b' },
        { name: 'Others', value: 10, color: '#10b981' },
    ];

    const cards = [
        { label: 'Jobs Completed', value: metrics.jobsCompleted || 8, sub: 'Today', icon: <Target />, color: 'blue' },
        { label: 'Avg Resolution', value: '42m', sub: '-5m from avg', icon: <Clock />, color: 'indigo' },
        { label: 'First-Time Fix', value: '94%', sub: 'Target: 90%', icon: <Zap />, color: 'orange' },
        { label: 'User Rating', value: '4.9', sub: 'Last 20 reviews', icon: <Star />, color: 'amber' },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-[#1e1e2d] p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl bg-${card.color}-50 dark:bg-${card.color}-950/20 text-${card.color}-600 dark:text-${card.color}-400`}>
                                {card.icon}
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <div className="text-3xl font-black text-slate-800 dark:text-white mb-1">{card.value}</div>
                        <div className="flex items-baseline justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
                            <span className="text-[10px] font-bold text-slate-500">{card.sub}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase italic">Weekly Job Completion</h3>
                            <p className="text-xs font-bold text-slate-400">Activity volume over the last 7 days</p>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400"><Filter size={18} /></div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorJobs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 uppercase italic text-center">Issue Breakdown</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={issueDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {issueDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-6">
                        {issueDistribution.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-white">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 flex items-center justify-between text-white shadow-2xl shadow-blue-500/20">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                        <Zap size={32} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-black uppercase italic">SLA Compliance: 98.4%</h4>
                        <p className="text-sm font-bold text-blue-100 opacity-80 uppercase tracking-widest">Top 5% Performance ranking this month</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-xl">Detailed PDF Summary</button>
            </div>
        </div>
    );
};

export default PerformanceMetrics;
