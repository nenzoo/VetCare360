// controllers/visitController.js
const Visit = require('../models/Visit');
const Pet = require('../models/Pet');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get all visits
// @route   GET /api/visits
// @access  Public
const getVisits = asyncHandler(async (req, res) => {
    const visits = await Visit.find({})
        .populate('pet', 'name type')
        .populate('veterinarian', 'firstName lastName')
        .sort({ date: -1 });

    res.status(200).json(visits);
});

// @desc    Get visit by ID
// @route   GET /api/visits/:id
// @access  Public
const getVisitById = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visite invalide');
    }

    const visit = await Visit.findById(req.params.id)
        .populate('pet', 'name type')
        .populate('veterinarian', 'firstName lastName');

    if (!visit) {
        res.status(404);
        throw new Error('Visite non trouvée');
    }

    res.status(200).json(visit);
});

// @desc    Get visits by pet ID
// @route   GET /api/visits/pets/:petId
// @access  Public
const getVisitsByPetId = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.petId)) {
        res.status(400);
        throw new Error('ID d\'animal invalide');
    }

    const visits = await Visit.find({ pet: req.params.petId })
        .populate('veterinarian', 'firstName lastName')
        .sort({ date: -1 });

    res.status(200).json(visits);
});

// @desc    Create a new visit
// @route   POST /api/visits
// @access  Public
const createVisit = asyncHandler(async (req, res) => {
    const { date, description, pet, veterinarian } = req.body;

    // Validation
    if (!description || !pet) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Vérifier que l'ID de l'animal est valide
    if (!mongoose.Types.ObjectId.isValid(pet)) {
        res.status(400);
        throw new Error('ID d\'animal invalide');
    }

    // Vérifier que l'animal existe et récupérer ses informations avec owner
    const petExists = await Pet.findById(pet).populate('owner');
    if (!petExists) {
        res.status(404);
        throw new Error('Animal non trouvé');
    }

    // Vérifier que l'ID du vétérinaire est valide si fourni
    if (veterinarian && !mongoose.Types.ObjectId.isValid(veterinarian)) {
        res.status(400);
        throw new Error('ID de vétérinaire invalide');
    }

    // Créer la visite
    const visit = await Visit.create({
        date: date || new Date(),
        description,
        pet,
        veterinarian: veterinarian || null
    });

    // Peupler les relations pour la réponse
    await visit.populate('pet', 'name type');
    if (visit.veterinarian) {
        await visit.populate('veterinarian', 'firstName lastName');
    }

    // Ajouter l'ID du propriétaire à la réponse
    const responseData = {
        ...visit.toObject(),
        petOwner: petExists.owner._id
    };

    res.status(201).json(responseData);
});

// @desc    Update a visit
// @route   PUT /api/visits/:id
// @access  Public
const updateVisit = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visite invalide');
    }

    const visit = await Visit.findById(req.params.id);

    if (!visit) {
        res.status(404);
        throw new Error('Visite non trouvée');
    }

    // Mettre à jour la visite
    const updatedVisit = await Visit.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
        .populate('pet', 'name type')
        .populate('veterinarian', 'firstName lastName');

    res.status(200).json(updatedVisit);
});

// @desc    Delete a visit
// @route   DELETE /api/visits/:id
// @access  Public
const deleteVisit = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de visite invalide');
    }

    const visit = await Visit.findById(req.params.id);

    if (!visit) {
        res.status(404);
        throw new Error('Visite non trouvée');
    }

    await visit.remove();

    res.status(200).json({ message: 'Visite supprimée' });
});

module.exports = {
    getVisits,
    getVisitById,
    getVisitsByPetId,
    createVisit,
    updateVisit,
    deleteVisit
};