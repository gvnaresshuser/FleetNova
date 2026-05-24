import prisma from '../config/prisma.js';
export const createDriver = async (req, res) => {

    try {

        const {
            name,
            email,
            mobile,
            licenseNumber,
            experience,
            status,
        } = req.body;

        const existingDriver =
            await prisma.driver.findUnique({

                where: {
                    email,
                },

            });

        if (existingDriver) {

            return res.status(400).json({

                success: false,

                message:
                    'Driver already exists',

            });

        }

        const driver =
            await prisma.driver.create({

                data: {

                    name,

                    email,

                    mobile,

                    licenseNumber,

                    experience:
                        Number(experience),

                    status,

                },

            });

        await prisma.notification.create({

            data: {

                title: 'New Driver Added',

                message:
                    `Driver ${driver.name} added successfully`,

                type: 'DRIVER_CREATED',

            },

        });

        res.status(201).json({

            success: true,

            message:
                'Driver created successfully',

            driver,

        });

    } catch (error) {

        console.log(
            'Create Driver Error:',
            error
        );

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const getDrivers = async (req, res) => {

    try {

        const drivers = await prisma.driver.findMany({

            include: {
                vehicle: true,
            },

            orderBy: {
                createdAt: 'desc',
            },

        });

        res.status(200).json({
            success: true,
            drivers,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};