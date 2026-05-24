import prisma from '../config/prisma.js';

export const getNotifications = async (
    req,
    res
) => {

    try {

        const notifications =
            await prisma.notification.findMany({

                orderBy: {
                    createdAt: 'desc',
                },

            });

        res.status(200).json({

            success: true,

            notifications,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const markNotificationRead = async (
    req,
    res
) => {

    try {

        const notification =
            await prisma.notification.update({

                where: {
                    id: Number(req.params.id),
                },

                data: {
                    isRead: true,
                },

            });

        res.status(200).json({

            success: true,

            notification,

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};