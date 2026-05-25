import prisma from '../config/prisma.js';

const getCoordinates = async (
    location
) => {

    try {

        const response = await fetch(

            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`

        );

        const data = await response.json();

        if (data.length > 0) {

            return {

                latitude:
                    parseFloat(data[0].lat),

                longitude:
                    parseFloat(data[0].lon),

            };

        }

        return null;

    } catch (error) {

        console.log(error);

        return null;

    }

};
export const createOrder = async (req, res) => {

    try {

        const {

            orderNumber,
            customerName,
            pickupLocation,
            dropLocation,
            pickupLatitude,
            pickupLongitude,
            dropLatitude,
            dropLongitude,
            amount,
            status,
            vehicleId,
            driverId,
        } = req.body;


        const pickupCoordinates =
            await getCoordinates(
                pickupLocation
            );

        const order = await prisma.order.create({

            data: {
                orderNumber,
                customerName,
                pickupLocation,
                dropLocation,
                pickupLatitude,
                pickupLongitude,
                dropLatitude,
                dropLongitude,
                amount: parseFloat(amount),
                status,
                vehicleId: vehicleId
                    ? Number(vehicleId)
                    : null,
                driverId: driverId
                    ? Number(driverId)
                    : null,
                currentLatitude:
                    pickupCoordinates?.latitude,
                currentLongitude:
                    pickupCoordinates?.longitude,
            },

        });
        console.log('Creating notification...');
        await prisma.notification.create({

            data: {

                title: 'New Order Created',

                message:
                    `Order ${order.orderNumber} created successfully`,

                type: 'ORDER_CREATED',

            },

        });
        console.log('Notification created');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
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

export const getOrders = async (req, res) => {

    try {
        const orders = await prisma.order.findMany({
            include: {
                vehicle: true,
                driver: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteOrder = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        await prisma.order.delete({

            where: {

                id: Number(id),

            },

        });

        res.status(200).json({

            success: true,

            message:
                'Order deleted successfully',

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

export const updateOrder = async (
    req,
    res
) => {

    try {

        const { id } = req.params;

        const {
            orderNumber,
            customerName,
            pickupLocation,
            dropLocation,
            pickupLatitude,
            pickupLongitude,
            dropLatitude,
            dropLongitude,
            amount,
            status,
            vehicleId,
            driverId,

        } = req.body;

        const updatedOrder =
            await prisma.order.update({

                where: {

                    id: Number(id),

                },

                data: {
                    orderNumber,
                    customerName,
                    pickupLocation,
                    dropLocation,
                    pickupLatitude,
                    pickupLongitude,
                    dropLatitude,
                    dropLongitude,
                    amount:
                        parseFloat(amount),
                    status,
                    vehicleId:
                        Number(vehicleId),
                    driverId:
                        Number(driverId),
                },
            });

        res.status(200).json({
            success: true,
            message:
                'Order updated successfully',
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