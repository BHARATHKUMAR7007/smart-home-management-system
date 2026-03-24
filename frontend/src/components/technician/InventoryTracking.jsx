import { useState } from 'react';
import { Package, Plus, Minus, AlertCircle, ShoppingCart, RefreshCw, Box } from 'lucide-react';

const InventoryTracking = () => {
    const [parts, setParts] = useState([
        { id: 1, name: 'Zigbee Hub v4', stock: 12, category: 'Gateways', status: 'Normal' },
        { id: 2, name: 'Smart Lock Plate', stock: 5, category: 'Security', status: 'Low' },
        { id: 3, name: 'Motion Sensor X1', stock: 48, category: 'Sensors', status: 'Normal' },
        { id: 4, name: 'HVAC Control Board', stock: 2, category: 'Appliance', status: 'Critical' },
    ]);

    return (
        <div className="bg-white dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                        <Box size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic">Inventory Manager</h3>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Spare Parts Status</p>
                    </div>
                </div>
                <button className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-400 hover:text-blue-500 transition-all">
                    <ShoppingCart size={18} />
                </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2 mb-6">
                {parts.map((part) => (
                    <div key={part.id} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 group flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${part.status === 'Critical' ? 'bg-red-100 text-red-600' : part.status === 'Low' ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 dark:bg-white/10 text-slate-500'}`}>
                                {part.stock}
                            </div>
                            <div>
                                <h5 className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{part.name}</h5>
                                <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">{part.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            {part.status === 'Low' || part.status === 'Critical' ? (
                                <AlertCircle size={14} className="text-orange-500 animate-pulse" />
                            ) : (
                                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-all text-slate-300">
                                    <Plus size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-blue-600 transition-all flex items-center justify-center">
                <RefreshCw size={14} className="mr-3" /> Reorder Low Stock
            </button>
        </div>
    );
};

export default InventoryTracking;
