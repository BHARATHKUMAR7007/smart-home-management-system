import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { Zap, TrendingUp, AlertTriangle, DollarSign, PieChart as PieIcon, BarChart3, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const EnergyDashboard = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [deviceData, setDeviceData] = useState([]);

    // New States
    const [timeframe, setTimeframe] = useState('weekly');
    const [patternData, setPatternData] = useState([]);
    const [comparison, setComparison] = useState(null);
    const [rate, setRate] = useState(10.0);
    const [cost, setCost] = useState(null);
    const [peak, setPeak] = useState(null);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        const fetchBaseData = async () => {
            try {
                const [logsRes, analyticsRes, compRes, peakRes, insightsRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/energy/logs', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8081/api/energy/analytics', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8081/api/energy/analytics/comparison', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8081/api/energy/analytics/peak', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:8081/api/energy/insights', { headers: { Authorization: `Bearer ${token}` } })
                ]);

                setAnalytics(analyticsRes.data);
                setComparison(compRes.data);
                setPeak(peakRes.data);
                setInsights(insightsRes.data);

                // Process Device Comparison (Pie Chart Data)
                const deviceMap = logsRes.data.reduce((acc, log) => {
                    const name = log.device.name;
                    acc[name] = (acc[name] || 0) + log.energyConsumed;
                    return acc;
                }, {});
                setDeviceData(Object.entries(deviceMap).map(([name, value]) => ({ name, value })));

            } catch (error) {
                console.error('Error fetching base energy data', error);
            }
        };

        fetchBaseData();
    }, [token]);

    // Fetch pattern data when timeframe changes
    useEffect(() => {
        const fetchPattern = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/energy/analytics/patterns?timeframe=${timeframe}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const formattedData = res.data.labels.map((label, index) => ({
                    time: label,
                    value: res.data.data[index]
                }));
                setPatternData(formattedData);
            } catch (error) {
                console.error('Error fetching pattern data', error);
            }
        };
        fetchPattern();
    }, [token, timeframe]);

    // Fetch cost data when rate changes
    useEffect(() => {
        const fetchCost = async () => {
            try {
                const res = await axios.get(`http://localhost:8081/api/energy/analytics/cost?rate=${rate}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCost(res.data);
            } catch (error) {
                console.error('Error fetching cost data', error);
            }
        };
        fetchCost();
    }, [token, rate]);

    const handleRateChange = (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
            setRate(val);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Energy Analytics</h1>
                    <p className="text-slate-400">Deep dive into your home energy consumption patterns.</p>
                </div>
            </header>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Most Used', value: analytics?.mostUsedDevice || 'N/A', icon: <Zap />, color: 'text-blue-400' },
                    { label: 'Least Used', value: analytics?.leastUsedDevice || 'N/A', icon: <TrendingUp className="rotate-180" />, color: 'text-emerald-400' },
                    { label: 'Avg Usage', value: `${analytics?.averageUsageDurationHours?.toFixed(2) || 0} kWh`, icon: <BarChart3 />, color: 'text-purple-400' },
                    { label: 'Est. Cost', value: `₹${cost?.estimatedMonthlyBill?.toFixed(2) || 0}`, icon: <DollarSign />, color: 'text-yellow-400' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 bg-slate-700 rounded-xl ${stat.color}`}>{stat.icon}</div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{stat.label}</p>
                                <p className={`text-xl font-bold text-white`}>{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Comparison Widget */}
            {comparison && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-4 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center gap-4"
                >
                    <Activity className={comparison.percentageChange < 0 ? 'text-emerald-400' : 'text-red-400'} />
                    <div>
                        <h4 className="text-white font-semibold">Weekly Comparison</h4>
                        <p className="text-slate-400 text-sm">
                            Last Week: {comparison.lastWeekUsage.toFixed(2)} kWh | This Week: {comparison.thisWeekUsage.toFixed(2)} kWh
                        </p>
                        <p className={`font-bold mt-1 ${comparison.percentageChange <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {comparison.summary}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Smart Insights Block */}
            {insights && insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl border border-indigo-500/30 bg-indigo-500/10"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Zap className="text-indigo-400" /> Smart Energy Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="flex gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                                <AlertTriangle className="text-amber-400 shrink-0 mt-1 w-5 h-5" />
                                <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trend Analysis (Area Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-400" /> Usage Trend
                        </h3>
                        <select
                            value={timeframe}
                            onChange={(e) => setTimeframe(e.target.value)}
                            className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={patternData}>
                                <defs>
                                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#ffffff" fontSize={10} />
                                <YAxis stroke="#ffffff" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{ stroke: '#ffffff', strokeWidth: 2 }} />
                                <Area type="monotone" dataKey="value" stroke="#ffffff" fillOpacity={1} fill="url(#colorUsage)" name="Usage (kWh)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Device Comparison (Pie Chart) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <PieIcon className="text-emerald-400" /> Device Distribution
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Peak vs Off-Peak Analysis */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock className="text-indigo-400" /> Peak vs Off-Peak Analysis
                    </h3>

                    {peak && (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="flex-1 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                    <h4 className="text-red-400 font-semibold mb-2">Peak Hours</h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {peak.peakHours.slice(0, 2).map((h, idx) => <li key={idx}>• {h}</li>)}
                                    </ul>
                                </div>
                                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                                    <h4 className="text-emerald-400 font-semibold mb-2">Off-Peak Hours</h4>
                                    <ul className="text-sm text-slate-300 space-y-1">
                                        {peak.offPeakHours.slice(0, 2).map((h, idx) => <li key={idx}>• {h}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={peak.hourlyUsage.map((val, i) => ({ hour: `${i}:00`, value: val }))}>
                                        <XAxis dataKey="hour" stroke="#ffffff" fontSize={10} interval={3} />
                                        <Tooltip cursor={{ fill: '#334155' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Bar dataKey="value" fill="#ffffff" radius={[4, 4, 0, 0]} name="Avg kWh" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Cost Prediction Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl"
                >
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <DollarSign className="text-yellow-400" /> Cost Prediction Config
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Electricity Rate (per kWh)</label>
                            <div className="flex items-center">
                                <span className="bg-slate-700 text-slate-300 px-3 py-2 rounded-l-lg border border-slate-600 border-r-0">₹</span>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={handleRateChange}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-r-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    step="0.5"
                                />
                            </div>
                        </div>
                        {cost && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Daily Avg Cost</p>
                                    <p className="text-2xl font-bold text-white mt-1">₹{cost.dailyCost.toFixed(2)}</p>
                                </div>
                                <div className="bg-slate-700/50 p-4 rounded-xl">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider">Total Consumed</p>
                                    <p className="text-2xl font-bold text-white mt-1">{cost.totalEnergyConsumed.toFixed(2)} kWh</p>
                                </div>
                                <div className="bg-yellow-500/20 col-span-2 p-4 rounded-xl border border-yellow-500/30">
                                    <p className="text-xs text-yellow-500 uppercase font-bold tracking-wider">Est. Monthly Bill</p>
                                    <p className="text-3xl font-bold text-yellow-400 mt-1">₹{cost.estimatedMonthlyBill.toFixed(2)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default EnergyDashboard;

