import { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, ChevronRight, MapPin, Smartphone, Activity, User, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AssignedHomes = ({ onSelectHome }) => {
    const [homes, setHomes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomes = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/technician/assigned-homes', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setHomes(response.data);
            } catch (error) {
                console.error('Error fetching homes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomes();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8ED6F4]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-800 uppercase italic">Your Assigned Properties</h3>
                <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 shadow-sm">
                    {homes.length} Active Accounts
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {homes.map((home, index) => (
                    <motion.div
                        key={home.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 cursor-pointer hover:shadow-2xl hover:shadow-blue-900/5 transition-all group overflow-hidden relative"
                        onClick={() => onSelectHome(home)}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Home size={100} />
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-[#8ED6F4]/10 flex items-center justify-center text-[#8ED6F4]">
                                <User size={28} />
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-600">+1</div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{home.fullName}</h3>
                            <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <MapPin size={12} className="mr-1.5 text-[#8ED6F4]" />
                                {home.address || 'Smart Residence'}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center text-[10px] font-black text-green-500 uppercase tracking-wider">
                                <ShieldCheck size={14} className="mr-1.5" />
                                Secured
                            </div>
                            <button className="p-2 bg-slate-50 rounded-xl text-slate-300 group-hover:bg-[#8ED6F4] group-hover:text-white transition-all">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {/* Add New Mock Card */}
                <button className="bg-transparent border-4 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-slate-300 hover:text-[#8ED6F4] hover:border-[#8ED6F4] transition-all group">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-200 flex items-center justify-center mb-4 group-hover:border-[#8ED6F4] transition-all">
                        <Users size={32} />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-xs">Assign New Home</span>
                </button>
            </div>

            {homes.length === 0 && !loading && (
                <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Home size={40} />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Awaiting Property Allocation</p>
                </div>
            )}
        </div>
    );
};

export default AssignedHomes;
