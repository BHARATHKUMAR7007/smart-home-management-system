import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EnergyCharts = () => {
    const [data, setData] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:8081/api/energy/analytics/patterns?timeframe=weekly', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const formattedData = res.data.labels.map((label, index) => ({
                    name: label,
                    val: res.data.data[index]
                }));
                setData(formattedData);
            } catch (err) {
                console.error("Error fetching energy pattern:", err);
            }
        };
        if (token) {
            fetchData();
        }
    }, [token]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey="name"
                    hide={true}
                />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b', // darker background to contrast with white text if needed, or white with dark text
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)'
                    }}
                    cursor={{ stroke: '#ffffff', strokeWidth: 2 }}
                />
                <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#ffffff"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorVal)"
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default EnergyCharts;
