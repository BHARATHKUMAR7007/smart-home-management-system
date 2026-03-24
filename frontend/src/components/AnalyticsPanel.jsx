import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AnalyticsPanel = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/energy/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(res.data);
            } catch (error) {
                console.error("Error fetching analytics", error);
            }
        };
        fetchAnalytics();
    }, [token]);

    if (!analytics) return null;

    const cards = [
        {
            title: 'Most Used Device',
            value: analytics.mostUsedDevice,
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        },
        {
            title: 'Least Used Device',
            value: analytics.leastUsedDevice,
            icon: TrendingDown,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            title: 'Avg. Usage Duration',
            value: `${analytics.averageUsageDurationHours} hrs/day`,
            icon: Clock,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            title: 'Daily Frequency',
            value: `${analytics.onOffFrequency} Toggles`,
            icon: Activity,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        },
        {
            title: 'Est. Monthly Cost',
            value: `₹${analytics.estimatedCostINR.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-yellow-500',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between transition-colors duration-300 hover:shadow-md"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                            <card.icon className="w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white mt-1 truncate" title={card.value}>{card.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default AnalyticsPanel;
