import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Camera, Trash2, Lock, Phone, MapPin, Calendar, CheckCircle, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user: authUser, token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        avatarUrl: '',
        createdAt: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchUserData();
    }, [token]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userData = response.data;
            setFormData({
                fullName: userData.fullName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || '',
                address: userData.address || '',
                avatarUrl: userData.avatarUrl || '',
                createdAt: userData.createdAt || ''
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
            showFeedback('error', 'Failed to load profile data.');
        } finally {
            setLoading(false);
        }
    };

    const showFeedback = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:8081/api/users/me', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            showFeedback('success', 'Profile updated successfully!');
        } catch (error) {
            console.error("Failed to update profile", error);
            showFeedback('error', error.response?.data || 'Failed to update profile.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showFeedback('error', 'New passwords do not match!');
            return;
        }
        try {
            await axios.post('http://localhost:8081/api/users/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowPasswordSection(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showFeedback('success', 'Password changed successfully!');
        } catch (error) {
            console.error("Failed to change password", error);
            showFeedback('error', error.response?.data || 'Failed to change password.');
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                showFeedback('error', 'Image size exceeds 2MB limit.');
                return;
            }
            // Real implementation would upload to backend
            // Simulating by converting to base64 for demo persistence
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatarUrl: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setFormData({ ...formData, avatarUrl: '' });
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Feedback Message */}
            <AnimatePresence>
                {message.text && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                            } backdrop-blur-md`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="h-32 bg-gradient-to-r from-blue-600/80 to-purple-600/80 relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                </div>

                <div className="px-8 pb-8 relative">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center -translate-y-16">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-700/50">
                                        <User className="w-16 h-16" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full cursor-pointer shadow-lg transition-all scale-90 group-hover:scale-100">
                                <Camera className="w-5 h-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                            {formData.avatarUrl && (
                                <button
                                    onClick={removeAvatar}
                                    className="absolute -top-2 -right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
                                    title="Remove Avatar"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="text-center mt-4">
                            <h2 className="text-2xl font-bold text-white">{formData.fullName || authUser?.username}</h2>
                            <p className="text-slate-400 font-medium flex items-center justify-center gap-2 mt-1 lowercase">
                                <Shield className="w-4 h-4 text-blue-400" /> {authUser?.role}
                            </p>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> Email address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    disabled={!isEditing}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="City, State, Country"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Account Created
                                </label>
                                <div className="w-full bg-slate-900/30 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-sm font-medium">
                                    {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    }) : 'Unknown'}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
                            <button
                                type="button"
                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                className="text-blue-400 hover:text-blue-300 transition text-sm font-bold uppercase tracking-wider flex items-center gap-2"
                            >
                                <Lock className="w-4 h-4" /> Change Password
                            </button>

                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition font-bold text-sm uppercase"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition font-bold text-sm uppercase shadow-lg shadow-blue-900/40 flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" /> Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="px-8 py-2.5 bg-slate-100 text-slate-900 rounded-xl hover:bg-white transition font-bold text-sm uppercase"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Password Change Section */}
            <AnimatePresence>
                {showPasswordSection && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Security Settings</h3>
                                    <p className="text-sm text-slate-400">Manage your password and account security</p>
                                </div>
                            </div>

                            <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPass ? "text" : "password"}
                                                required
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white pr-12 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPass(!showCurrentPass)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                            >
                                                {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPass ? "text" : "password"}
                                                required
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white pr-12 focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPass(!showNewPass)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                                            >
                                                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-red-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-900/20"
                                    >
                                        Update Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordSection(false)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
