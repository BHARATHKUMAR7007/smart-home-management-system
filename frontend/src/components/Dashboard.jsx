import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Dashboard = () => {
    return (
        <div className="flex bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 dashboard-main-content">
                <main className="dashboard-page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
