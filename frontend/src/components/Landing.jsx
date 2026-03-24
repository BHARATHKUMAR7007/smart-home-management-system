import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap, Shield, PieChart, Smartphone,
    ArrowRight, Github, Twitter, Instagram,
    Facebook, Globe, Battery, CloudLightning,
    Menu, X, Check, Star, Thermometer, Lightbulb
} from 'lucide-react';
import Navbar from './Navbar';

const Landing = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const floatAnimation = {
        y: [0, -20, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    };

    return (
        <div className="min-h-screen w-full bg-[#f0f2f5] dark:bg-slate-950 font-sans selection:bg-[#23bbab]/30 overflow-x-hidden relative transition-colors duration-500">
            {/* Global Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#23bbab]/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, delay: 2 }}
                    className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full"
                />
            </div>

            <Navbar />

            {/* Main Content Area - Full Screen Immersive Design */}
            <div className="relative z-10 flex min-h-screen items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
                        {/* Left Content Column */}
                        <div className="w-full lg:w-[45%] py-12 lg:py-0 flex flex-col justify-center relative z-20">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-8"
                            >
                                {/* Branding Tag */}
                                <motion.div variants={itemVariants} className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[#23bbab] rounded-2xl shadow-xl shadow-[#23bbab]/20">
                                        <Zap size={22} className="text-white fill-white" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-[0.3em] text-[#23bbab]">Eco-Home Intelligence</span>
                                </motion.div>

                                <div className="space-y-4">
                                    <motion.h1
                                        variants={itemVariants}
                                        className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter"
                                    >
                                        SMART <br />
                                        <span className="text-[#23bbab]">ENERGY</span>
                                    </motion.h1>
                                    <motion.p
                                        variants={itemVariants}
                                        className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed pt-2"
                                    >
                                        The next generation of home management. An intelligent ecosystem that tracks, optimizes, and secures your energy future.
                                    </motion.p>
                                </div>

                                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 pt-4">
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="px-10 py-5 bg-gradient-to-r from-[#10b981] to-[#23bbab] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#23bbab]/30 hover:scale-105 active:scale-95 transition-all text-center uppercase tracking-[0.1em] flex items-center justify-center gap-2 group"
                                    >
                                        Get Started
                                        <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-lg hover:shadow-xl transition-all text-center uppercase tracking-[0.1em]"
                                    >
                                        Sign In
                                    </button>
                                </motion.div>

                                {/* Trust Badge */}
                                <motion.div variants={itemVariants} className="pt-8 flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="user" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-xs font-bold text-slate-500">
                                        Trusted by <span className="text-slate-900 dark:text-white text-sm">2,000+</span> households
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right Side - Interactive App Preview Demo */}
                        <div className="w-full lg:w-[55%] relative flex items-center justify-center p-4 lg:p-8">
                            <motion.div
                                initial={{ opacity: 0, y: 50, rotateX: 20 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="relative w-full max-w-2xl bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group perspective-[2000px]"
                            >
                                {/* App Header Mockup */}
                                <div className="h-12 border-b border-white/5 bg-white/5 flex items-center justify-between px-6">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Dashboard v2.0</div>
                                    <div className="w-6 h-6 rounded-full bg-blue-500/20" />
                                </div>

                                {/* App Content Mockup */}
                                <div className="p-8 space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Consumption</div>
                                            <div className="text-4xl font-black text-white">4.2 <span className="text-blue-400">kWh</span></div>
                                        </div>
                                        <div className="h-12 w-24 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
                                            <div className="flex gap-1 items-end h-6">
                                                {[30, 60, 45, 80, 55, 90].map((h, i) => (
                                                    <motion.div
                                                        key={i}
                                                        animate={{ height: [`${h}%`, `${h - 20}%`, `${h}%`] }}
                                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                                        className="w-1.5 bg-blue-400 rounded-full"
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                                            <div className="flex justify-between items-center text-indigo-400"><Smartphone size={16} /> <span className="text-[8px] font-black uppercase">Nodes</span></div>
                                            <div className="text-xl font-bold text-white">14 Active</div>
                                        </div>
                                        <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                                            <div className="flex justify-between items-center text-emerald-400"><Shield size={16} /> <span className="text-[8px] font-black uppercase">Secure</span></div>
                                            <div className="text-xl font-bold text-white">99.9% Up</div>
                                        </div>
                                    </div>

                                    {/* Device List Mockup */}
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Devices</div>
                                        {[
                                            { label: 'Living Room AC', power: '1.2kW', color: 'bg-blue-500' },
                                            { label: 'Smart Kitchen', power: '0.4kW', color: 'bg-[#23bbab]' }
                                        ].map((device, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${device.color} shadow-[0_0_10px_${device.color}] animate-pulse`} />
                                                    <span className="text-sm font-bold text-slate-300">{device.label}</span>
                                                </div>
                                                <span className="text-xs font-black text-white">{device.power}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Holographic Overlay Effects */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />
                                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
                            </motion.div>

                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -top-4 -right-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-white/10 z-20 flex items-center gap-3 backdrop-blur-xl"
                            >
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                                    <PieChart size={20} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Monthly Saving</div>
                                    <div className="text-sm font-black text-slate-900 dark:text-white">₹2,450.00</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-32 px-6 md:px-12 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20 space-y-4"
                    >
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#23bbab]">Core Capabilities</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Everything you need to <span className="text-[#23bbab]">save power</span></h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="text-[#23bbab]" />,
                                title: "Smart Automation",
                                desc: "Automate your devices based on energy tariffs and your daily routine to maximize savings."
                            },
                            {
                                icon: <PieChart className="text-indigo-500" />,
                                title: "Energy Analytics",
                                desc: "Visualize your consumption patterns with granular detail and identify power-hungry appliances."
                            },
                            {
                                icon: <Shield className="text-emerald-500" />,
                                title: "Advanced Security",
                                desc: "Keep your home network safe with enterprise-grade encryption and real-time threat detection."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border border-transparent hover:border-[#23bbab]/30 transition-all hover:shadow-2xl hover:shadow-[#23bbab]/10"
                            >
                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h4 className="text-2xl font-black mb-4">{feature.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative z-10 py-32 px-6 md:px-12 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#23bbab]">Our Mission</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">Driving the <span className="text-[#23bbab]">Green Revolution</span> through Intelligence</h3>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            At Eco-Home Tech, we believe that every watt saved brings us closer to a sustainable future. Our platform empowers homeowners to take full control of their carbon footprint without sacrificing comfort.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-black text-[#23bbab]">99.9%</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Uptime SLA</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-indigo-500">2026</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Launch Year</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="aspect-square bg-gradient-to-br from-[#23bbab]/20 to-indigo-500/20 rounded-[4rem] blur-3xl absolute inset-0" />
                        <div className="relative z-10 p-4 bg-white dark:bg-slate-950 rounded-[4rem] shadow-2xl border border-white/20">
                            <img src="https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Eco Home" className="rounded-[3rem] w-full" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="relative z-10 py-32 px-6 md:px-12 bg-white dark:bg-slate-950 overflow-hidden">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20 space-y-4"
                    >
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-[#23bbab]">Get in Touch</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">We're here to help you <span className="text-[#23bbab]">optimize</span></h3>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black">Contact Information</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Have questions? Reach out to our team of energy experts.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#23bbab]"><Globe size={24} /></div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</div>
                                        <div className="font-bold">123 Eco Valley, Silicon Gardens</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-[#23bbab]"><Twitter size={24} /></div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Social</div>
                                        <div className="font-bold">@EcoHomeTech_Support</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 dark:bg-slate-900 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-white/5"
                        >
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Name</label>
                                    <input type="text" className="w-full bg-white dark:bg-slate-950 border-0 rounded-2xl p-5 focus:ring-2 focus:ring-[#23bbab] transition-all outline-none font-bold" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <input type="email" className="w-full bg-white dark:bg-slate-950 border-0 rounded-2xl p-5 focus:ring-2 focus:ring-[#23bbab] transition-all outline-none font-bold" placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Message</label>
                                    <textarea className="w-full bg-white dark:bg-slate-950 border-0 rounded-2xl p-5 focus:ring-2 focus:ring-[#23bbab] transition-all outline-none font-bold min-h-[150px]" placeholder="How can we help?"></textarea>
                                </div>
                                <button type="submit" className="w-full py-5 bg-[#23bbab] text-white rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#23bbab]/30 uppercase tracking-widest">Send Message</button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default Landing;
