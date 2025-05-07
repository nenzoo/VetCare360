// routes/vetRoutes.js
const express = require('express');
const router = express.Router();
const {
    getVeterinarians,
    getVeterinarianById,
    createVeterinarian,
    updateVeterinarian,
    deleteVeterinarian
} = require('../controllers/vetController');

// Route /api/veterinarians
router.route('/')
    .get(getVeterinarians)
    .post(createVeterinarian);

// Route /api/veterinarians/:id
router.route('/:id')
    .get(getVeterinarianById)
    .put(updateVeterinarian)
    .delete(deleteVeterinarian);

module.exports = router;