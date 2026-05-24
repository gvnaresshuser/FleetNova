import { useEffect, useState } from 'react';

import API from '../../services/api';
import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';
import { useNavigate } from 'react-router-dom';
const Dashboard = ({ startLoading }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({

        totalVehicles: 0,

        totalDrivers: 0,

        activeVehicles: 0,

        inactiveVehicles: 0,

        totalTrackingLogs: 0,

    });

    const fetchStats = async () => {

        try {

            const { data } = await API.get(
                '/dashboard/stats'
            );

            setStats(data.stats);
            setLoading(false);

        } catch (error) {

            console.log(error);
            setLoading(false);

        }

    };
    useEffect(() => {

        startLoading();

    }, []);

    useEffect(() => {

        fetchStats();

    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <PageTransition>
        <div>

            <h1 className="text-2xl md:text-3xl font-bold mb-6">

                Dashboard

            </h1>

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

                    <div
                        onClick={() => navigate('/vehicles')}
                        className="
        bg-gradient-to-r
        from-blue-500
        to-blue-700
        text-white
        rounded-2xl
        shadow-lg
        p-6
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
    "
                    >

                        <p className="text-sm opacity-80">

                            Total Vehicles

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {stats.totalVehicles}

                        </h2>

                        <p className="mt-3 text-sm">

                            🚚 Fleet Active

                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/drivers')}
                        className="
        bg-gradient-to-r
        from-green-500
        to-green-700
        text-white
        rounded-2xl
        shadow-lg
        p-6
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
    "
                    >

                        <p className="text-sm opacity-80">

                            Total Drivers

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {stats.totalDrivers}

                        </h2>

                        <p className="mt-3 text-sm">

                            👨‍✈️ Driver Management

                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/tracking')}
                        className="
        bg-gradient-to-r
        from-orange-400
        to-orange-600
        text-white
        rounded-2xl
        shadow-lg
        p-6
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
    "
                    >

                        <p className="text-sm opacity-80">

                            Active Vehicles

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {stats.activeVehicles}

                        </h2>

                        <p className="mt-3 text-sm">

                            🟢 Live Fleet Tracking

                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/vehicles')}
                        className="
        bg-gradient-to-r
        from-red-500
        to-red-700
        text-white
        rounded-2xl
        shadow-lg
        p-6
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
    "
                    >

                        <p className="text-sm opacity-80">

                            Inactive Vehicles

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {stats.inactiveVehicles}

                        </h2>

                        <p className="mt-3 text-sm">

                            🔴 Maintenance Required

                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/tracking')}
                        className="
        bg-gradient-to-r
        from-purple-500
        to-purple-700
        text-white
        rounded-2xl
        shadow-lg
        p-6
        hover:scale-105
        transition-all
        duration-300
        cursor-pointer
    "
                    >

                        <p className="text-sm opacity-80">

                            Tracking Logs

                        </p>

                        <h2 className="text-4xl font-bold mt-2">

                            {stats.totalTrackingLogs}

                        </h2>

                        <p className="mt-3 text-sm">

                            📍 Live GPS Updates

                        </p>

                    </div>

            </div>

        </div>
        </PageTransition>

    );

};

export default Dashboard;