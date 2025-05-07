// controllers/petController.js
const Pet = require('../models/Pet');
const Visit = require('../models/Visit');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find({})
        .populate('owner', 'firstName lastName')
        .sort({ name: 1 });

    res.status(200).json(pets);
});

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Public
const getPetById = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID d\'animal invalide');
    }

    const pet = await Pet.findById(req.params.id)
        .populate('owner', 'firstName lastName');

    if (!pet) {
        res.status(404);
        throw new Error('Animal non trouvé');
    }

    // Récupérer les visites associées
    await pet.populate({
        path: 'visits',
        populate: {
            path: 'veterinarian'
        }
    });

    res.status(200).json(pet);
});

// @desc    Get pets by owner ID
// @route   GET /api/pets/owner/:ownerId
// @access  Public
const getPetsByOwnerId = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.ownerId)) {
        res.status(400);
        throw new Error('ID de propriétaire invalide');
    }

    const pets = await Pet.find({ owner: req.params.ownerId })
        .populate({
            path: 'visits',
            populate: {
                path: 'veterinarian'
            }
        })
        .sort({ name: 1 });

    res.status(200).json(pets);
});

// @desc    Create a new pet
// @route   POST /api/pets
// @access  Public
const createPet = asyncHandler(async (req, res) => {
    const { name, type, age, birthDate, owner } = req.body;

    // Validation
    if (!name || !type || !owner) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Vérifier que l'ID du propriétaire est valide
    if (!mongoose.Types.ObjectId.isValid(owner)) {
        res.status(400);
        throw new Error('ID de propriétaire invalide');
    }

    // Créer l'animal
    const pet = await Pet.create({
        name,
        type,
        age: age || undefined,
        birthDate: birthDate || undefined,
        owner
    });

    // Peupler le propriétaire pour la réponse
    await pet.populate('owner', 'firstName lastName');

    res.status(201).json(pet);
});

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Public
const updatePet = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID d\'animal invalide');
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
        res.status(404);
        throw new Error('Animal non trouvé');
    }

    // Mettre à jour l'animal
    const updatedPet = await Pet.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName');

    res.status(200).json(updatedPet);
});

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Public
const deletePet = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID d\'animal invalide');
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
        res.status(404);
        throw new Error('Animal non trouvé');
    }

    // Supprimer d'abord les visites associées
    await Visit.deleteMany({ pet: pet._id });

    // Puis supprimer l'animal
    await pet.remove();

    res.status(200).json({ message: 'Animal supprimé' });
});

module.exports = {
    getPets,
    getPetById,
    getPetsByOwnerId,
    createPet,
    updatePet,
    deletePet
};