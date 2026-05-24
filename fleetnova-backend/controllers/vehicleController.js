import prisma from '../config/prisma.js';

export const createVehicle = async (req, res) => {

    try {

        const {

            vehicleNumber,
            vehicleType,
            fuelType,
            latitude,
            longitude,
            status,

        } = req.body;

        const vehicle = await prisma.vehicle.create({

            data: {

                vehicleNumber,

                vehicleType,

                fuelType,

                latitude: latitude
                    ? parseFloat(latitude)
                    : null,

                longitude: longitude
                    ? parseFloat(longitude)
                    : null,

                status,

            },

        });

        await prisma.notification.create({

            data: {

                title: 'Vehicle Added',

                message:
                    `Vehicle ${vehicle.vehicleNumber} added to fleet`,

                type: 'VEHICLE_CREATED',

            },

        });

        res.status(201).json({

            success: true,

            message: 'Vehicle created successfully',

            vehicle,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const getVehicles = async (req, res) => {

    try {

        const vehicles = await prisma.vehicle.findMany({
            orderBy: {
                createdAt: 'desc',
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

export const getSingleVehicle = async (req, res) => {

    try {

        const { id } = req.params;
        console.log('ID : ',id);

        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!vehicle) {

            return res.status(404).json({
                success: false,
                message: 'Vehicle not found',
            });

        }

        res.status(200).json({
            success: true,
            vehicle,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const updateVehicle = async (req, res) => {

    try {

        const { id } = req.params;

        const existingVehicle = await prisma.vehicle.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!existingVehicle) {

            return res.status(404).json({
                success: false,
                message: `Vehicle with ID ${id} not found`,
            });

        }

        const {
            vehicleNumber,
            vehicleType,
            fuelType,
            latitude,
            longitude,
            status,
        } = req.body;

        const updatedVehicle = await prisma.vehicle.update({

            where: {
                id: Number(id),
            },

            data: {
                vehicleNumber,
                vehicleType,
                fuelType,
                latitude: latitude
                    ? parseFloat(latitude)
                    : null,

                longitude: longitude
                    ? parseFloat(longitude)
                    : null,
                status,
            },

        });

        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            vehicle: updatedVehicle,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const deleteVehicle = async (req, res) => {

    try {

        const { id } = req.params;

        const existingVehicle = await prisma.vehicle.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!existingVehicle) {

            return res.status(404).json({
                success: false,
                message: `Vehicle with ID ${id} not found`,
            });

        }

        await prisma.vehicle.delete({
            where: {
                id: Number(id),
            },
        });

        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully',
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const assignDriverToVehicle = async (req, res) => {

    try {

        const { vehicleId, driverId } = req.body;

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

        const driver = await prisma.driver.findUnique({
            where: {
                id: Number(driverId),
            },
        });

        if (!driver) {

            return res.status(404).json({
                success: false,
                message: 'Driver not found',
            });

        }
        if (vehicle.driverId !== null) {

            return res.status(400).json({

                success: false,

                message:
                    'Vehicle already assigned to another driver',

            });

        }
        const existingAssignment =
            await prisma.vehicle.findFirst({

                where: {

                    driverId: Number(driverId),

                },

            });

        if (existingAssignment) {

            return res.status(400).json({

                success: false,

                message:
                    'Driver already assigned to another vehicle',

            });

        }

        const updatedVehicle = await prisma.vehicle.update({

            where: {
                id: Number(vehicleId),
            },

            data: {
                driverId: Number(driverId),
            },

            include: {
                driver: true,
            },

        });

        await prisma.notification.create({

            data: {

                title: 'Driver Assigned',

                message:
                    `${driver.name} assigned to ${vehicle.vehicleNumber}`,

                type: 'DRIVER_ASSIGNED',

            },

        });

        res.status(200).json({
            success: true,
            message: 'Driver assigned successfully',
            vehicle: updatedVehicle,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

}; export const updateVehicleLocation =
    async (req, res) => {

        try {

            const {
                vehicleId,
                latitude,
                longitude,
            } = req.body;

            // VALIDATION

            if (!vehicleId) {

                return res.status(400).json({

                    success: false,

                    message:
                        'Vehicle ID is required',

                });

            }

            const updatedVehicle =
                await prisma.vehicle.update({

                    where: {

                        id: Number(vehicleId),

                    },

                    data: {

                        latitude:
                            parseFloat(latitude),

                        longitude:
                            parseFloat(longitude),

                    },

                });

            await prisma.notification.create({

                data: {

                    title: 'Live Tracking Active',

                    message:
                        `Vehicle ${updatedVehicle.vehicleNumber} location updated`,

                    type: 'GPS_ACTIVE',

                },

            });

            res.status(200).json({

                success: true,

                vehicle: updatedVehicle,

            });

        } catch (error) {

            console.log(
                'Update Location Error:',
                error
            );

            res.status(500).json({

                success: false,

                message: error.message,

            });

        }

    };