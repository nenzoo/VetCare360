// routes/ownerRoutes.js
const express = require('express');
const router = express.Router();
const {
    getOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner
} = require('../controllers/ownerController');

// Route /api/owners
router.route('/')
    .get(getOwners)
    .post(createOwner);

// Route /api/owners/:id
router.route('/:id')
    .get(getOwnerById)
    .put(updateOwner)
    .delete(deleteOwner);

module.exports = router;