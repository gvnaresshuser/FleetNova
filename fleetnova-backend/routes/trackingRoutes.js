import express from 'express';

import {
    addTrackingLog,
    getTrackingLogs,
    updateOrderTracking,
    getOrderTracking,
} from '../controllers/trackingController.js';

import {
    isAuthenticated,
} from '../middleware/authMiddleware.js';

import {
    getLiveVehicles,
} from '../controllers/trackingController.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    addTrackingLog
);

router.get(
    '/:vehicleId',
    isAuthenticated,
    getTrackingLogs
);

router.put(
    '/update',
    isAuthenticated,
    updateOrderTracking
);

router.get(
    '/:id',
    isAuthenticated,
    getOrderTracking
);

router.get(
    '/live-vehicles',
    isAuthenticated,
    getLiveVehicles
);

export default router;