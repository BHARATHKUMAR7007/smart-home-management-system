import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle } from 'lucide-react';

const Notifications = () => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (token) fetchNotifications();
    }, [token]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:8081/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking read', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 max-w-4xl mx-auto"
        >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                <Bell className="text-blue-600" /> Notifications
            </h1>

            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">All caught up!</h3>
                            <p className="text-slate-500 dark:text-slate-400">You have no unread notifications.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-md border-l-4 border-l-red-500 border border-slate-100 dark:border-slate-700 flex justify-between items-start"
                            >
                                <div className="flex gap-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-500 h-fit">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-white mb-1">
                                            {notif.message}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(notif.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors rounded-lg"
                                    title="Mark as Read"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Notifications;
