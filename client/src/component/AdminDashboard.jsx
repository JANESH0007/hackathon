import React, { useState } from 'react';
import Header from './Header';
import AdminInfoCard from './AdminInfoCard';
import WorkerManagement from './WorkerManagement';
import MinesDashboard from './MinesDashboard'; // Import Mines
import LocationsDashboard from './LocationsDashboard'; // Import Locations
import AnalyticsDashboard from './AnalyticsDashboard'; // Import Analytics

// Import icons for the info cards
import { FaUsers, FaChartLine, FaMapMarkedAlt, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('Workers');

    const renderContent = () => {
        switch (activeTab) {
            case 'Workers':
                return <WorkerManagement />;
            case 'Mines':
                return <MinesDashboard />;
            case 'Locations':
                return <LocationsDashboard />;
            case 'Analytics':
                return <AnalyticsDashboard />;
            default:
                return <WorkerManagement />;
        }
    };

    const tabs = ['Workers', 'Mines', 'Locations', 'Analytics'];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="p-6">
                <Header dashboardType="Admin" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
                    <AdminInfoCard title="Total Workers" value="74" trend="+5 from last week" icon={<FaUsers />} />
                    <AdminInfoCard title="Active Now" value="3" subtext="60% of total workforce" icon={<FaChartLine />} />
                    <AdminInfoCard title="Active Mines" value="3" subtext="All operational" icon={<FaMapMarkedAlt />} />
                    <AdminInfoCard title="Safety Score" value="96%" progress={96} icon={<FaShieldAlt />} />
                </div>

                <nav className="border-b border-gray-200">
                    <div className="flex space-x-2">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-5 font-semibold transition-colors duration-200 text-base ${
                                    activeTab === tab
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </nav>

                <main className="mt-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;