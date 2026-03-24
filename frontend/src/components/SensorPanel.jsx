import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SensorPanel = () => {
    const [sensors, setSensors] = useState([]);

    useEffect(() => {
        const fetchSensors = async () => {
            try {
                // Simulated Data for "Wow" Effect
                setSensors([
                    { id: 1, type: 'Temperature', value: 24, unit: '°C', icon: Thermometer, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                    { id: 2, type: 'Humidity', value: 45, unit: '%', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                    { id: 3, type: 'CO2 Level', value: 420, unit: 'ppm', icon: Wind, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { id: 4, type: 'Motion', value: 'Active', unit: '', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                ]);
            } catch (error) {
                console.error("Error fetching sensors", error);
            }
        };
        fetchSensors();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sensors.map((sensor, index) => (
                <motion.div
                    key={sensor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 glass-hover transition-all"
                >
                    <div className={`p-3 rounded-xl border ${sensor.bg} ${sensor.color}`}>
                        <sensor.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{sensor.type}</p>
                        <p className="text-lg font-bold text-white mt-0.5">
                            {sensor.value} <span className="text-xs font-normal text-slate-400 ml-0.5">{sensor.unit}</span>
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default SensorPanel;
