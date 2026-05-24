import express from 'express';

import {

    createOrder,
    getOrders,
    deleteOrder,

} from '../controllers/orderController.js';

import {

    isAuthenticated,

} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    createOrder
);

router.get(
    '/',
    isAuthenticated,
    getOrders
);
router.delete(
    '/:id',
    isAuthenticated,
    deleteOrder
);

export default router;