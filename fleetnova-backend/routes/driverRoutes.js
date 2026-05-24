import express from 'express';

import {
    createDriver,
    getDrivers,
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

export default router;