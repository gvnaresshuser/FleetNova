import prisma from '../config/prisma.js';

export const getAdvancedAnalytics = async (req, res) => {

    try {

        // TOTAL REVENUE

        const revenueData =
            await prisma.order.aggregate({

                _sum: {
                    amount: true,
                },

            });

        // COMPLETED ORDERS

        const completedOrders =
            await prisma.order.count({

                where: {
                    status: 'COMPLETED',
                },

            });

        // PENDING ORDERS

        const pendingOrders =
            await prisma.order.count({

                where: {
                    status: 'PENDING',
                },

            });

        // TOTAL ORDERS

        const totalOrders =
            await prisma.order.count();

        // TOP DRIVERS

        const orders = await prisma.order.findMany({

            include: {
                driver: true,
                vehicle: true,
            },

        });

        // DRIVER REVENUE

        const driverRevenueMap = {};

        orders.forEach((order) => {

            if (order.driver) {

                const name = order.driver.name;

                if (!driverRevenueMap[name]) {

                    driverRevenueMap[name] = 0;

                }

                driverRevenueMap[name] += order.amount;

            }

        });

        const topDrivers = Object.entries(
            driverRevenueMap
        ).map(([name, revenue]) => ({

            name,

            revenue,

        }));

        // VEHICLE REVENUE

        const vehicleRevenueMap = {};

        orders.forEach((order) => {

            if (order.vehicle) {

                const number =
                    order.vehicle.vehicleNumber;

                if (!vehicleRevenueMap[number]) {

                    vehicleRevenueMap[number] = 0;

                }

                vehicleRevenueMap[number] += order.amount;

            }

        });

        const topVehicles = Object.entries(
            vehicleRevenueMap
        ).map(([vehicle, revenue]) => ({

            vehicle,

            revenue,

        }));

        // MONTHLY REVENUE SIMULATION

        const monthlyRevenue = [

            {
                month: 'Jan',
                revenue: 50000,
            },

            {
                month: 'Feb',
                revenue: 85000,
            },

            {
                month: 'Mar',
                revenue: 120000,
            },

            {
                month: 'Apr',
                revenue: 95000,
            },

            {
                month: 'May',
                revenue:
                    revenueData._sum.amount || 0,
            },

        ];

        res.status(200).json({

            success: true,

            analytics: {

                totalRevenue:
                    revenueData._sum.amount || 0,

                completedOrders,

                pendingOrders,

                totalOrders,

                topDrivers,

                topVehicles,

                monthlyRevenue,

            },

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};