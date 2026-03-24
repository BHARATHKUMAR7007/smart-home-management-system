import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    MessageSquare,
    Info,
    LogOut,
    Send,
    CheckCircle,
    AlertCircle,
    Cpu,
    Shield,
    Zap,
    Clock,
    Globe
} from 'lucide-react';

const Settings = () => {
    const { user, logout, token } = useAuth();
    const [activeSection, setActiveSection] = useState('feedback');
    const [systemInfo, setSystemInfo] = useState(null);
    const [feedbackForm, setFeedbackForm] = useState({
        name: user?.fullName || '',
        email: user?.email || '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchSystemInfo = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/system/info');
                setSystemInfo(res.data);
            } catch (err) {
                console.error("Error fetching system info:", err);
            }
        };
        fetchSystemInfo();
    }, []);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:8081/api/feedback/submit', feedbackForm, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setStatus({ type: 'success', message: 'Thank you! Your feedback has been submitted.' });
            setFeedbackForm({ ...feedbackForm, message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: 'Failed to submit feedback. Please try again.' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setStatus({ type: '', message: '' }), 5000);
        }
    };

    const sections = [
        { id: 'feedback', name: 'Queries & Feedback', icon: <MessageSquare size={18} /> },
        { id: 'about', name: 'About System', icon: <Info size={18} /> },
        { id: 'account', name: 'Quick Actions', icon: <SettingsIcon size={18} /> },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <header className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold text-white tracking-tight">System Settings</h1>
                <p className="text-slate-400">Configure your preferences and get system information.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === section.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            {section.icon}
                            {section.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeSection === 'feedback' && (
                            <motion.div
                                key="feedback"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl">
                                        <MessageSquare size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Queries & Feedback</h3>
                                        <p className="text-sm text-slate-400">Send us your thoughts or ask a question.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={feedbackForm.name}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={feedbackForm.email}
                                                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Message</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={feedbackForm.message}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm shadow-xl shadow-blue-900/40 transition-all flex items-center gap-2 group disabled:opacity-50"
                                        >
                                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                            {isSubmitting ? 'Sending...' : 'Send Message'}
                                        </button>

                                        {status.message && (
                                            <div className={`flex items-center gap-2 text-sm font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                                {status.message}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {activeSection === 'about' && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl">
                                        <Info size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">About System</h3>
                                        <p className="text-sm text-slate-400">Technical details and application info.</p>
                                    </div>
                                </div>

                                {systemInfo ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Application</p>
                                                <p className="text-lg font-bold text-white">{systemInfo.appName}</p>
                                                <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
                                                    <Zap size={14} /> v{systemInfo.version}
                                                </div>
                                            </div>
                                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Developer</p>
                                                <p className="text-lg font-bold text-white">{systemInfo.developer}</p>
                                                <div className="flex items-center gap-2 text-xs text-purple-400 font-bold">
                                                    <Globe size={14} /> Global Distribution
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                                <Cpu size={16} className="text-emerald-400" /> Core Features
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {systemInfo.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-xl border border-white/5 text-slate-400 text-xs font-medium">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 text-slate-400 text-xs font-bold">
                                                <Shield size={16} className="text-blue-400" />
                                                End-to-End Encrypted
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <Clock size={16} className="text-amber-400" />
                                                Up-time 99.9%
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Contact: <span className="text-blue-400 underline cursor-pointer">{systemInfo.supportEmail}</span>
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeSection === 'account' && (
                            <motion.div
                                key="account"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-900/10">
                                    <div className="flex items-center gap-4 text-center md:text-left">
                                        <div className="p-4 bg-red-500/20 text-red-500 rounded-2xl">
                                            <LogOut size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Logout from System</h3>
                                            <p className="text-sm text-slate-400">Safely terminate your current session.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full md:w-auto px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-900/40 uppercase tracking-widest text-xs"
                                    >
                                        Confirm Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Settings;
