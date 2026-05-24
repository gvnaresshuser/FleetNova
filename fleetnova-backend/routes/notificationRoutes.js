import express from 'express';

import {

    getNotifications,

    markNotificationRead,

} from '../controllers/notificationController.js';

import {

    isAuthenticated,

} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/',
    isAuthenticated,
    getNotifications
);

router.put(
    '/:id',
    isAuthenticated,
    markNotificationRead
);

export default router;