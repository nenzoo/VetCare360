// controllers/ownerController.js
const Owner = require('../models/Owner');
const Pet = require('../models/Pet');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Get all owners
// @route   GET /api/owners
// @access  Public
const getOwners = asyncHandler(async (req, res) => {
    // Recherche par nom de famille si le paramètre est fourni
    const filter = {};

    if (req.query.lastName) {
        filter.lastName = { $regex: req.query.lastName, $options: 'i' };
    }

    const owners = await Owner.find(filter).sort({ lastName: 1, firstName: 1 });
    res.status(200).json(owners);
});

// @desc    Get owner by ID
// @route   GET /api/owners/:id
// @access  Public
const getOwnerById = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de propriétaire invalide');
    }

    const owner = await Owner.findById(req.params.id);

    if (!owner) {
        res.status(404);
        throw new Error('Propriétaire non trouvé');
    }

    // Récupérer les animaux associés directement (au lieu d'utiliser populate)
    const pets = await Pet.find({ owner: owner._id }).populate({
        path: 'visits',
        populate: {
            path: 'veterinarian'
        }
    });

    // Créer un objet de réponse qui inclut le propriétaire et ses animaux
    const response = {
        ...owner.toObject(),
        pets: pets
    };

    res.status(200).json(response);
});

// @desc    Create a new owner
// @route   POST /api/owners
// @access  Public
const createOwner = asyncHandler(async (req, res) => {
    const { firstName, lastName, address, city, telephone } = req.body;

    // Validation
    if (!firstName || !lastName || !telephone) {
        res.status(400);
        throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    // Créer le propriétaire
    const owner = await Owner.create({
        firstName,
        lastName,
        address: address || '',
        city: city || '',
        telephone
    });

    res.status(201).json(owner);
});

// @desc    Update an owner
// @route   PUT /api/owners/:id
// @access  Public
const updateOwner = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de propriétaire invalide');
    }

    const owner = await Owner.findById(req.params.id);

    if (!owner) {
        res.status(404);
        throw new Error('Propriétaire non trouvé');
    }

    // Mettre à jour le propriétaire
    const updatedOwner = await Owner.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json(updatedOwner);
});

// @desc    Delete an owner
// @route   DELETE /api/owners/:id
// @access  Public
const deleteOwner = asyncHandler(async (req, res) => {
    // Vérifier que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('ID de propriétaire invalide');
    }

    const owner = await Owner.findById(req.params.id);

    if (!owner) {
        res.status(404);
        throw new Error('Propriétaire non trouvé');
    }

    // Supprimer d'abord les animaux associés
    await Pet.deleteMany({ owner: owner._id });

    // Puis supprimer le propriétaire
    await owner.remove();

    res.status(200).json({ message: 'Propriétaire supprimé' });
});

module.exports = {
    getOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner
};