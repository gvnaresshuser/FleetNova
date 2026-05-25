import express from 'express';

import {
    createDriver,
    getDrivers,
    updateDriver,
} from '../controllers/driverController.js';

import {
    isAuthenticated,
    authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    authorizeRoles('ADMIN'),
    createDriver
);

router.get(
    '/',
    isAuthenticated,
    getDrivers
);
router.put(
    '/:id',
    updateDriver
);

export default router;