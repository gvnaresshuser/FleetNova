import prisma from '../config/prisma.js';

export const getDashboardStats = async (req, res) => {

    try {

        // TOTAL VEHICLES

        const totalVehicles =
            await prisma.vehicle.count();

        // TOTAL DRIVERS

        const totalDrivers =
            await prisma.driver.count();

        // ACTIVE VEHICLES

        const activeVehicles =
            await prisma.vehicle.count({

                where: {
                    status: 'ACTIVE',
                },

            });

        // INACTIVE VEHICLES

        const inactiveVehicles =
            await prisma.vehicle.count({

                where: {
                    status: 'INACTIVE',
                },

            });

        // TRACKING LOGS

        const totalTrackingLogs =
            await prisma.trackingLog.count();

        res.status(200).json({

            success: true,

            stats: {

                totalVehicles,

                totalDrivers,

                activeVehicles,

                inactiveVehicles,

                totalTrackingLogs,

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