import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Info, Zap, AlertCircle, TrafficCone, Compass, Layers, ShieldAlert } from 'lucide-react';

const FieldMap = () => {
    const locations = [
        { id: 1, x: '20%', y: '25%', name: 'Jenkins Residense', type: 'EMERGENCY', status: 'Priority #1' },
        { id: 2, x: '65%', y: '45%', name: 'Wilson Property', type: 'SCHEDULED', status: 'Pending' },
        { id: 3, x: '35%', y: '75%', name: 'Davis Home', type: 'MAINTENANCE', status: 'Pending' },
        { id: 4, x: '80%', y: '15%', name: 'Michael B.', type: 'EMERGENCY', status: 'Priority #2' },
    ];

    return (
        <div className="bg-slate-900 dark:bg-black rounded-3xl relative overflow-hidden shadow-2xl h-full border-4 border-slate-800">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Mock Roads */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
                <path d="M 0 150 Q 50% 200 100% 150" stroke="#3b82f6" strokeWidth="60" fill="none" />
                <path d="M 150 0 Q 200 50% 150 100%" stroke="#3b82f6" strokeWidth="50" fill="none" />
            </svg>

            {/* Optimized Route Path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity }}
                    d="M 20% 25% L 65% 45% L 80% 15%"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="10 5"
                    fill="none"
                />
            </svg>

            {/* Interactive Markers */}
            {locations.map((loc) => (
                <motion.div
                    key={loc.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute cursor-pointer group"
                    style={{ left: loc.x, top: loc.y }}
                >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <MapPin className={`${loc.type === 'EMERGENCY' ? 'text-red-500' : 'text-blue-500'} group-hover:scale-125 transition-transform`} size={28} />
                        {loc.type === 'EMERGENCY' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                        )}
                        <div className="absolute hidden group-hover:flex flex-col top-full mt-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3 py-2 rounded-xl shadow-2xl z-50 w-40 border border-slate-100">
                            <h5 className="font-black text-[10px] uppercase mb-0.5">{loc.name}</h5>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{loc.status}</p>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
                <div className="p-2 bg-slate-800/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center space-x-2 text-white">
                    <Navigation size={14} className="text-blue-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest italic">Route Opt Active</span>
                </div>
            </div>

            {/* Emergency Alerts Overlay */}
            <div className="absolute top-4 right-4 animate-pulse">
                <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 px-3 py-1.5 rounded-full flex items-center space-x-2 text-red-500">
                    <ShieldAlert size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Nearby Malfunction</span>
                </div>
            </div>

            {/* HUD Info */}
            <div className="absolute top-4 left-4 p-3 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 space-y-1">
                <div className="flex items-center space-x-2">
                    <TrafficCone size={12} className="text-amber-500" />
                    <span className="text-[8px] font-black text-white uppercase italic">Traffic delay: +4m</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Zap size={12} className="text-blue-500" />
                    <span className="text-[8px] font-black text-white uppercase italic">ETA: 11:45 AM</span>
                </div>
            </div>
        </div>
    );
};

export default FieldMap;
