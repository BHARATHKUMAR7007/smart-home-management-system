import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, RefreshCw, Shield, User } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        password: '',
        role: 'HOMEOWNER'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
            setError('');
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                email: user.email || user.username, // some flexibility
                fullName: user.fullName || '',
                password: '', // Don't populate password on edit
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                email: '',
                fullName: '',
                password: '',
                role: 'HOMEOWNER'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingUser) {
                // Update
                const updateData = {
                    fullName: formData.fullName,
                    role: formData.role
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }

                await axios.put(`http://localhost:8081/api/admin/users/${editingUser.id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create
                await axios.post('http://localhost:8081/api/admin/users', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            closeModal();
            fetchUsers();
        } catch (err) {
            console.error("Failed to save user:", err);
            alert("Failed to save user: " + (err.response?.data || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8081/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            console.error("Failed to delete user:", err);
            alert("Failed to delete user.");
        }
    };

    const roles = ['HOMEOWNER', 'TECHNICIAN', 'ADMIN'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="flex gap-4">
                    <button
                        onClick={fetchUsers}
                        className="p-2 bg-[#1a1f2e] text-[#23bbab] rounded-xl hover:bg-[#23bbab]/10 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-[#23bbab] text-white px-4 py-2 rounded-xl hover:bg-[#1d9f91] transition-colors"
                    >
                        <Plus size={20} />
                        Add User
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 mb-6">{error}</div>}

            <div className="bg-[#1a1f2e] rounded-2xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#242b3d] text-gray-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Full Name</th>
                                <th className="px-6 py-4 font-medium">Email / Username</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading && users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-400">Loading...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-8 text-gray-400">No users found.</td></tr>
                            ) : (
                                users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 text-white">
                                                <div className="w-8 h-8 rounded-full bg-[#23bbab]/20 flex items-center justify-center text-[#23bbab]">
                                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User size={16} />}
                                                </div>
                                                {user.fullName || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{user.email || user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5
                                                ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' :
                                                    user.role === 'TECHNICIAN' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-gray-500/20 text-gray-400'}
                                            `}>
                                                {user.role === 'ADMIN' && <Shield size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1f2e] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/10">
                                <h3 className="text-xl font-bold text-white">
                                    {editingUser ? 'Edit User' : 'Add New User'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Email / Username {!editingUser && '*'}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!!editingUser}
                                        required={!editingUser}
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#23bbab] focus:ring-1 focus:ring-[#23bbab] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="user@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#23bbab] focus:ring-1 focus:ring-[#23bbab] transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">
                                        Password {editingUser ? '(Leave blank to keep current)' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required={!editingUser}
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#23bbab] focus:ring-1 focus:ring-[#23bbab] transition-all"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#23bbab] focus:ring-1 focus:ring-[#23bbab] transition-all"
                                    >
                                        {roles.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 rounded-xl text-gray-300 font-semibold hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 rounded-xl bg-[#23bbab] text-white font-semibold hover:bg-[#1d9f91] transition-colors"
                                    >
                                        {editingUser ? 'Save Changes' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
