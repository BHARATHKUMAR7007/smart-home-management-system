import { motion } from 'framer-motion';

const Rooms = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
        >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Rooms
            </h1>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <p className="text-slate-600 dark:text-slate-300">
                    Manage your rooms here. (Coming Soon)
                </p>
            </div>
        </motion.div>
    );
};

export default Rooms;
