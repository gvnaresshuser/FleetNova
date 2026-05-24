import express from 'express';

import {

    updateOrderTracking,

    getOrderTracking,

    getLiveVehicles,

} from '../controllers/trackingController.js';

import {

    isAuthenticated,

} from '../middleware/authMiddleware.js';

const router = express.Router();

router.put(
    '/update',
    isAuthenticated,
    updateOrderTracking
);

router.get(
    '/live-vehicles',
    isAuthenticated,
    getLiveVehicles
);

router.get(
    '/:id',
    isAuthenticated,
    getOrderTracking
);

export default router;