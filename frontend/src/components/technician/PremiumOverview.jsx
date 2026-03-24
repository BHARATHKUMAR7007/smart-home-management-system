import { useState } from 'react';
import { Thermometer, Droplets, Tv, Wind, Lightbulb, Play, Plus, ChevronRight, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const PremiumOverview = () => {
    const [devices, setDevices] = useState([
        { id: 1, name: 'Smart Tv', icon: <Tv size={24} />, status: 'On', color: 'bg-white' },
        { id: 2, name: 'Air Humidifier', icon: <Droplets size={24} />, status: 'On', color: 'bg-[#8ED6F4]' },
        { id: 3, name: 'Air Conditioner', icon: <Wind size={24} />, status: 'Off', color: 'bg-white' },
        { id: 4, name: 'Lights', icon: <Lightbulb size={24} />, status: 'On', color: 'bg-[#8ED6F4]' },
    ]);

    const energyData = [
        { name: 'Mon', value: 200 },
        { name: 'Tue', value: 150 },
        { name: 'Wed', value: 300 },
        { name: 'Thu', value: 250 },
        { name: 'Fri', value: 400 },
        { name: 'Sat', value: 350 },
        { name: 'Sun', value: 380 },
    ];

    const rooms = ['Living Room', 'Bed Room', 'Bath Room', 'Dining Room', 'Kitchen', 'Entrance', 'Backyard'];
    const [activeRoom, setActiveRoom] = useState('Living Room');
    const [dialValue, setDialValue] = useState(75);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 h-full">
            {/* Left Side: Environment & Controls (60%) */}
            <div className="lg:col-span-3 space-y-10">
                {/* Room Selector */}
                <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar pb-2">
                    {rooms.map(room => (
                        <button
                            key={room}
                            onClick={() => setActiveRoom(room)}
                            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeRoom === room ? 'bg-[#8ED6F4] text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {room}
                        </button>
                    ))}
                    <button className="text-slate-300 hover:text-[#8ED6F4] transition-colors">
                        <Plus size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Environment Stats */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center space-x-4">
                                <Thermometer className="text-[#8ED6F4]" size={28} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temperature</p>
                                    <p className="text-xl font-black text-slate-800">+28° C</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center space-x-4">
                                <Droplets className="text-[#8ED6F4]" size={28} />
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Humidity</p>
                                    <p className="text-xl font-black text-slate-800">35%</p>
                                </div>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="relative rounded-[3rem] overflow-hidden group shadow-2xl shadow-blue-900/10">
                            <img
                                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
                                alt="Living Room"
                                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute top-4 left-6 flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full border border-white/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Live</span>
                            </div>
                            <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
                                    <Play fill="currentColor" size={24} />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Device Controls Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {devices.map(device => (
                            <div
                                key={device.id}
                                className={`${device.color} p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`${device.status === 'On' && device.color === 'bg-white' ? 'text-[#8ED6F4]' : 'text-slate-400'} ${device.color !== 'bg-white' ? 'text-white' : ''}`}>
                                        {device.icon}
                                    </div>
                                    <div className={`w-10 h-6 rounded-full relative p-1 ${device.status === 'On' ? (device.color === 'bg-white' ? 'bg-[#8ED6F4]' : 'bg-white') : 'bg-slate-200'}`}>
                                        <div className={`absolute w-4 h-4 rounded-full shadow-sm transition-all ${device.status === 'On' ? 'right-1 bg-white' : 'left-1 bg-white'} ${device.color !== 'bg-white' && device.status === 'On' ? 'bg-[#8ED6F4]' : ''}`} />
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${device.color === 'bg-white' ? 'text-slate-400' : 'text-white/60'}`}>{device.status}</p>
                                    <h4 className={`text-sm font-black uppercase tracking-tight ${device.color === 'bg-white' ? 'text-slate-800' : 'text-white'}`}>{device.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Energy & Dial (40%) */}
            <div className="lg:col-span-2 flex flex-col space-y-10">
                {/* Energy Chart */}
                <div className="bg-transparent h-1/2 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white text-xs font-black uppercase tracking-[0.2em]">Electricity consumed</h3>
                        <div className="flex items-center text-white/40 text-[9px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
                            Last week <ChevronRight size={14} />
                        </div>
                    </div>
                    <div className="flex-1 -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={energyData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8ED6F4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8ED6F4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', background: '#202136', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#8ED6F4', strokeWidth: 1 }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8ED6F4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <span key={day} className="text-[9px] font-black text-white/30 uppercase tracking-tighter">{day}</span>
                        ))}
                    </div>
                </div>

                {/* Dial Widget */}
                <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 flex flex-col items-center justify-center border border-white/10 relative">
                    <div className="absolute top-8 left-10 flex items-center text-white">
                        <Droplets size={20} className="text-[#8ED6F4] mr-3" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Air Humidifier</h4>
                    </div>

                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="stroke-white/10 fill-none"
                                strokeWidth="8"
                            />
                            <circle
                                cx="50%"
                                cy="50%"
                                r="45%"
                                className="stroke-[#8ED6F4] fill-none transition-all duration-1000"
                                strokeWidth="8"
                                strokeDasharray="300"
                                strokeDashoffset={300 - (300 * dialValue) / 100}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-white tracking-tighter">{dialValue}%</span>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Intensity</span>
                        </div>

                        {/* Interactive Markers */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[0, 25, 50, 75, 100].map(m => (
                                <div key={m} className="absolute w-1 h-3 bg-white/10" style={{ transform: `rotate(${m * 3.6}deg) translateY(-85px)` }} />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-10">
                        <button
                            onClick={() => setDialValue(Math.max(0, dialValue - 5))}
                            className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-[#8ED6F4] transition-all flex items-center justify-center text-white border border-white/10"
                        >
                            <Minus size={20} />
                        </button>
                        <button
                            onClick={() => setDialValue(Math.min(100, dialValue + 5))}
                            className="w-12 h-12 rounded-2xl bg-[#FFE169] hover:scale-110 transition-all flex items-center justify-center text-[#202136] shadow-xl shadow-yellow-500/10"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Target Humidity</p>
                        <p className="text-xl font-black text-[#8ED6F4] mt-1">50%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumOverview;
