import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import http from 'http';

import { Server } from 'socket.io';

import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
////import trackingRoutes from './routes/trackingRoutes.js';
import orderTrackingRoutes from './routes/orderTrackingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
/* const io = new Server(server, {
    cors: {
        origin: '*',
    },
}); */
const io = new Server(server, {
    cors: {
        origin: [
            process.env.CLIENT_URL,
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

//app.use(cors());
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
    ],
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);

////app.use('/api/tracking', trackingRoutes);
app.use('/api/order-tracking', orderTrackingRoutes);

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.get('/', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'FleetNova Backend Running Successfully',
    });

});
let vehicles = [];

io.on('connection', (socket) => {

    console.log(`⚡ User Connected: ${socket.id}`);

    socket.on('send-location', (data) => {

        const existingVehicle = vehicles.find(
            (v) => v.id === data.id
        );

        if (existingVehicle) {

            existingVehicle.latitude = data.latitude;
            existingVehicle.longitude = data.longitude;
            existingVehicle.status = data.status;

        } else {

            vehicles.push(data);

        }

        io.emit('receive-vehicles', vehicles);

        io.emit('receive-location', data);

    });

    socket.on('disconnect', () => {

        console.log(`❌ User Disconnected: ${socket.id}`);

    });

});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});