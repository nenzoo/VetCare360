// models/Pet.js
const mongoose = require('mongoose');

const petSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de l\'animal est requis']
    },
    type: {
        type: String,
        required: [true, 'Le type d\'animal est requis'],
        enum: ['chien', 'chat', 'oiseau', 'lapin', 'rongeur', 'reptile', 'autre']
    },
    age: {
        type: Number,
        min: [0, 'L\'âge ne peut pas être négatif']
    },
    birthDate: {
        type: Date
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: [true, 'Le propriétaire est requis']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuel pour récupérer les visites d'un animal
petSchema.virtual('visits', {
    ref: 'Visit',
    localField: '_id',
    foreignField: 'pet'
});

// Middleware pour supprimer toutes les visites associées à un animal lors de sa suppression
petSchema.pre('remove', async function(next) {
    await this.model('Visit').deleteMany({ pet: this._id });
    next();
});

module.exports = mongoose.model('Pet', petSchema);