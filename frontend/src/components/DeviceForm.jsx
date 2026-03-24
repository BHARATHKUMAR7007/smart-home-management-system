import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Save, X, Plus } from 'lucide-react';

const DeviceForm = ({ fetchDevices, editingDevice, setEditingDevice, closeForm }) => {
    const { token } = useAuth();
    const [name, setName] = useState('');
    const [type, setType] = useState('LIGHT');
    const [powerRating, setPowerRating] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (editingDevice) {
            setName(editingDevice.name);
            setType(editingDevice.type);
            setPowerRating(editingDevice.powerRating);
            setLocation(editingDevice.location);
        } else {
            setName('');
            setType('LIGHT');
            setPowerRating('');
            setLocation('');
        }
    }, [editingDevice]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name,
                type,
                powerRating: parseFloat(powerRating),
                location
            };

            if (editingDevice) {
                await axios.put(`http://localhost:8081/api/devices/${editingDevice.id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8081/api/devices', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            fetchDevices();
            if (setEditingDevice) setEditingDevice(null);
            if (closeForm) closeForm();

            // Reset if staying open (though we usually close)
            if (!closeForm) {
                setName('');
                setPowerRating('');
                setLocation('');
            }

        } catch (error) {
            console.error('Error saving device', error);
            alert('Failed to save device. Please try again.');
        }
    };

    const handleCancel = () => {
        if (setEditingDevice) setEditingDevice(null);
        if (closeForm) closeForm();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner mb-6 relative">
            <button
                type="button"
                onClick={handleCancel}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
                <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                {editingDevice ? <><Save className="w-5 h-5 text-blue-600" /> Edit Device</> : <><Plus className="w-5 h-5 text-emerald-600" /> Add New Device</>}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Device Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Living Room Lamp"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="LIGHT">Light</option>
                        <option value="AC">AC</option>
                        <option value="FAN">Fan</option>
                        <option value="FRIDGE">Fridge</option>
                        <option value="TV">TV</option>
                        <option value="HEATER">Heater</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Power (Watts)</label>
                    <input
                        type="number"
                        value={powerRating}
                        onChange={e => setPowerRating(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. 60"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Annual"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={`px-6 py-2 text-white rounded-lg font-medium shadow-lg transition flex items-center gap-2 ${editingDevice ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'}`}
                >
                    {editingDevice ? 'Update Device' : 'Add Device'}
                </button>
            </div>
        </form>
    );
};

export default DeviceForm;
