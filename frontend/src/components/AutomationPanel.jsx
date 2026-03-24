import { useState, useEffect } from 'react';
import { Workflow, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AutomationPanel = () => {
    const { token } = useAuth();
    const [rules, setRules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newRule, setNewRule] = useState({ name: '', triggerSensorId: 1, condition: '>', triggerValue: 25, actionDeviceId: 1, action: 'true' });

    // Mock initial data if backend is empty
    useEffect(() => {
        // fetchRules(); 
        setRules([
            { id: 1, name: 'Cool Down', trigger: 'Temp > 28°C', action: 'Turn AC ON' },
            { id: 2, name: 'Night Lights', trigger: 'Motion Detected', action: 'Turn Lights ON' }
        ]);
    }, []);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Workflow className="w-6 h-6 text-purple-600" /> Automation Rules
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus className="w-4 h-4" /> New Rule
                </button>
            </div>

            <div className="space-y-4">
                {rules.map(rule => (
                    <div key={rule.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">{rule.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">IF {rule.trigger} THEN {rule.action}</p>
                        </div>
                        <button className="text-slate-400 hover:text-red-600 transition">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AutomationPanel;
