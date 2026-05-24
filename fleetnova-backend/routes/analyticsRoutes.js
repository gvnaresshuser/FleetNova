import express from 'express';

import {
    getAdvancedAnalytics,
} from '../controllers/analyticsController.js';

import {
    isAuthenticated,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/',
    isAuthenticated,
    getAdvancedAnalytics
);

export default router;