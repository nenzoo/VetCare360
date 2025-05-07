// routes/visitRoutes.js
const express = require('express');
const router = express.Router();
const {
    getVisits,
    getVisitById,
    getVisitsByPetId,
    createVisit,
    updateVisit,
    deleteVisit
} = require('../controllers/visitController');

// Route /api/visits
router.route('/')
    .get(getVisits)
    .post(createVisit);

// Route /api/visits/:id
router.route('/:id')
    .get(getVisitById)
    .put(updateVisit)
    .delete(deleteVisit);

// Route /api/visits/pets/:petId
router.route('/pets/:petId')
    .get(getVisitsByPetId);

module.exports = router;