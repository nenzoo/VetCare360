// controllers/vetController.js
const Veterinarian = require('../models/Veterinarian');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get all veterinarians
// @route   GET /api/veterinarians
// @access  Public
const getVeterinarians = asyncHandler(async (req, res) => {
    const vets = await Veterinarian.find({}).sort({ lastName: 1, firstName: 1 });
    res.status(200).json(vets);
});

// @desc    Get veterinarian by ID
// @route   GET /api/veterinarians/:id
// @access  Public
const getVeterinarianById = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de vétérinaire invalide');
    }

    const vet = await Veterinarian.findById(req.params.id);

    if (!vet) {
        res.status(404);
        throw new Error('Vétérinaire non trouvé');
    }

    res.status(200).json(vet);
});

// @desc    Create a new veterinarian
// @route   POST /api/veterinarians
// @access  Public
const createVeterinarian = asyncHandler(async (req, res) => {
    const { firstName, lastName, specialties } = req.body;

    // Validation
    if (!firstName || !lastName) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Créer le vétérinaire
    const vet = await Veterinarian.create({
        firstName,
        lastName,
        specialties: specialties || []
    });

    res.status(201).json(vet);
});

// @desc    Update a veterinarian
// @route   PUT /api/veterinarians/:id
// @access  Public
const updateVeterinarian = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de vétérinaire invalide');
    }

    const vet = await Veterinarian.findById(req.params.id);

    if (!vet) {
        res.status(404);
        throw new Error('Vétérinaire non trouvé');
    }

    // Mettre à jour le vétérinaire
    const updatedVet = await Veterinarian.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedVet);
});

// @desc    Delete a veterinarian
// @route   DELETE /api/veterinarians/:id
// @access  Public
const deleteVeterinarian = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de vétérinaire invalide');
    }

    const vet = await Veterinarian.findById(req.params.id);

    if (!vet) {
        res.status(404);
        throw new Error('Vétérinaire non trouvé');
    }

    await vet.remove();

    res.status(200).json({ message: 'Vétérinaire supprimé' });
});

module.exports = {
    getVeterinarians,
    getVeterinarianById,
    createVeterinarian,
    updateVeterinarian,
    deleteVeterinarian
};