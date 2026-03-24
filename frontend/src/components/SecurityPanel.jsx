import { Shield, Camera, Bell, Lock } from 'lucide-react';

const SecurityPanel = () => {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" /> Security Hub
                </h2>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> System Armed
                </span>
            </div>

            <div className="space-y-6">
                {/* CCTV Feed Mockup */}
                <div className="bg-slate-900/50 rounded-2xl overflow-hidden relative group h-48 border border-white/5">
                    <div className="absolute top-3 left-3 bg-red-600 text-[10px] font-bold text-white px-2 py-0.5 rounded shadow-lg z-10 flex items-center gap-1 tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                    </div>
                    <div className="absolute bottom-3 left-3 text-white text-[10px] font-medium bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 tracking-wide">Front Door Camera</div>

                    {/* Placeholder for Video Feed */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                        <Camera className="w-10 h-10 text-slate-700 group-hover:text-slate-600 transition-colors" />
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                                <Bell className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Motion Detected</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">Backyard • 2 mins ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                                <Lock className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">Main Door Armed</p>
                                <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">Entrance • 15 mins ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityPanel;
