import express from 'express';

import {
    createOrder,
    getOrders,
    deleteOrder,
    updateOrder,

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
router.put('/:id', updateOrder);

export default router;