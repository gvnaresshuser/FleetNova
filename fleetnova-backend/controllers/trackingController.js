import prisma from '../config/prisma.js';

export const addTrackingLog = async (req, res) => {

    try {

        const {
            vehicleId,
            latitude,
            longitude,
            speed,
            location,
        } = req.body;

        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId),
            },
        });

        if (!vehicle) {

            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });

        }

        const trackingLog = await prisma.trackingLog.create({

            data: {
                vehicleId: Number(vehicleId),
                latitude,
                longitude,
                speed,
                location,
            },

        });

        await prisma.vehicle.update({

            where: {
                id: Number(vehicleId),
            },

            data: {
                latitude,
                longitude,
            },

        });

        res.status(201).json({
            success: true,
            message: 'Tracking log added successfully',
            trackingLog,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
export const getTrackingLogs = async (req, res) => {

    try {

        const { vehicleId } = req.params;

        const trackingLogs = await prisma.trackingLog.findMany({

            where: {
                vehicleId: Number(vehicleId),
            },

            orderBy: {
                createdAt: 'desc',
            },

            include: {
                vehicle: true,
            },

        });

        res.status(200).json({
            success: true,
            trackingLogs,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};
export const updateOrderTracking = async (
    req,
    res
) => {

    try {

        const {

            orderId,

            latitude,

            longitude,

            status,

            estimatedDeliveryTime,

        } = req.body;

        const updatedOrder =
            await prisma.order.update({

                where: {
                    id: Number(orderId),
                },

                data: {

                    currentLatitude:
                        parseFloat(latitude),

                    currentLongitude:
                        parseFloat(longitude),

                    status,

                    estimatedDeliveryTime,

                },

            });

        await prisma.notification.create({

            data: {

                title: 'Delivery Completed',

                message:
                    `Order ${order.orderNumber} delivered successfully`,

                type: 'DELIVERY_COMPLETED',

            },

        });

        res.status(200).json({

            success: true,

            updatedOrder,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const getOrderTracking = async (
    req,
    res
) => {

    try {

        const order =
            await prisma.order.findUnique({

                where: {
                    id: Number(req.params.id),
                },

                include: {
                    vehicle: true,
                    driver: true,
                },

            });

        res.status(200).json({

            success: true,

            order,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};
export const getLiveVehicles = async (
    req,
    res
) => {

    try {

        const vehicles =
            await prisma.vehicle.findMany({

                include: {

                    driver: true,

                    orders: {
                        take: 1,
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },

                },

            });

        res.status(200).json({

            success: true,

            vehicles,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};