// routes/petRoutes.js
const express = require('express');
const router = express.Router();
const {
    getPets,
    getPetById,
    getPetsByOwnerId,
    createPet,
    updatePet,
    deletePet
} = require('../controllers/petController');

// Route /api/pets
router.route('/')
    .get(getPets)
    .post(createPet);

// Route /api/pets/:id
router.route('/:id')
    .get(getPetById)
    .put(updatePet)
    .delete(deletePet);

// Route /api/pets/owner/:ownerId
router.route('/owner/:ownerId')
    .get(getPetsByOwnerId);

module.exports = router;