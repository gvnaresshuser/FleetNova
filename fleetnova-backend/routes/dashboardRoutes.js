import express from 'express';

import {
    getDashboardStats,
} from '../controllers/dashboardController.js';

import {
    isAuthenticated,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/stats',
    isAuthenticated,
    getDashboardStats
);

export default router;