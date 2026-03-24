import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationList = () => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:8081/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [token]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:8081/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    const dismissAll = async () => {
        // Optimistically clear UI
        const ids = notifications.map(n => n.id);
        setNotifications([]);
        ids.forEach(id => markAsRead(id));
    };

    if (notifications.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="bg-white border-l-4 border-amber-500 rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 bg-amber-50/50 flex justify-between items-center border-b border-amber-100">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-600 animate-pulse" />
                        <span className="font-bold text-amber-900">System Alerts ({notifications.length})</span>
                    </div>
                    <button
                        onClick={dismissAll}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline transition"
                    >
                        Dismiss All
                    </button>
                </div>

                <div className="divide-y divide-amber-100">
                    <AnimatePresence>
                        {notifications.map(notification => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-4 flex justify-between items-center hover:bg-amber-50/30 transition"
                            >
                                <p className="text-sm text-slate-700">{notification.message}</p>
                                <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-100 rounded-full transition"
                                    title="Mark as read"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default NotificationList;
