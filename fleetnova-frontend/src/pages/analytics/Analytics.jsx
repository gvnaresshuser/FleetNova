import { useEffect, useState } from 'react';

import API from '../../services/api';

import VehicleStatusChart from '../../charts/VehicleStatusChart';
import RevenueChart from "../../charts/RevenueChart";
import DriverPerformanceChart from '../../charts/DriverPerformanceChart';
import RevenueByDriverChart from '../../charts/RevenueByDriverChart';


import Loader from '../../components/common/Loader';
import PageTransition from '../../components/common/PageTransition';

const Analytics = ({ startLoading }) => {

    const [loading, setLoading] = useState(true);

    const [analytics, setAnalytics] = useState(null);

    const fetchAnalytics = async () => {

        try {
            const { data } = await API.get(
                '/analytics'
            );

            setAnalytics(data.analytics);
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }

    };

    useEffect(() => {
        startLoading();
        fetchAnalytics();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (

        <PageTransition>
            <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-6">
                    Fleet Analytics

                </h1>

                {/* ANALYTICS CARDS */}

               {/*  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Tracking Logs

                        </h2>

                        <p className="text-3xl font-bold text-blue-900 mt-3">

                            {analytics.totalTrackingLogs}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Active Vehicles

                        </h2>

                        <p className="text-3xl font-bold text-green-600 mt-3">

                            {analytics.activeVehicles.length}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Drivers Ranked

                        </h2>

                        <p className="text-3xl font-bold text-orange-500 mt-3">

                            {analytics.driverRanking.length}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Vehicle Status Groups

                        </h2>

                        <p className="text-3xl font-bold text-purple-600 mt-3">

                            {analytics.vehicleStatus.length}

                        </p>

                    </div>

                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Total Revenue

                        </h2>

                        <p className="text-3xl font-bold text-green-600 mt-3">

                            ₹{analytics.totalRevenue}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Total Orders

                        </h2>

                        <p className="text-3xl font-bold text-blue-900 mt-3">

                            {analytics.totalOrders}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Completed Orders

                        </h2>

                        <p className="text-3xl font-bold text-green-500 mt-3">

                            {analytics.completedOrders}

                        </p>

                    </div>

                    <div className="bg-white rounded-xl shadow p-6">

                        <h2 className="text-gray-500">

                            Pending Orders

                        </h2>

                        <p className="text-3xl font-bold text-orange-500 mt-3">

                            {analytics.pendingOrders}

                        </p>

                    </div>

                </div>

                {/* CHARTS */}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    <VehicleStatusChart />

                    <RevenueChart />

                    <DriverPerformanceChart />

                    <RevenueByDriverChart
                        data={analytics.topDrivers}
                    />

                </div>

            </div>

        </PageTransition>

    );

};

export default Analytics;