import express from 'express';

import {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle,
    assignDriverToVehicle,
    updateVehicleLocation,
} from '../controllers/vehicleController.js';

import {
    isAuthenticated,
    authorizeRoles,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
    '/',
    isAuthenticated,
    authorizeRoles('ADMIN'),
    createVehicle
);

router.get(
    '/',
    isAuthenticated,
    getVehicles
);

router.get(
    '/:id',
    isAuthenticated,
    getSingleVehicle
);
//-------------
router.put(
    '/assign-driver',
    isAuthenticated,
    authorizeRoles('ADMIN'),
    assignDriverToVehicle
);
//-------------
router.put(
    '/:id',
    isAuthenticated,
    authorizeRoles('ADMIN'),
    updateVehicle
);

router.delete(
    '/:id',
    isAuthenticated,
    authorizeRoles('ADMIN'),
    deleteVehicle
);
router.put(
    '/update-location',
    isAuthenticated,
    updateVehicleLocation
);


export default router;
/*
IMPORTANT 🚀
Put this route BEFORE:
'/:id'
Otherwise Express thinks:
assign-driver
is an ID.
---------------------
CORRECT ROUTE ORDER
router.post('/'...)
router.get('/'...)
router.put('/assign-driver'...)
router.get('/:id'...)
router.put('/:id'...)
router.delete('/:id'...)
*/