// models/Owner.js
const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis']
    },
    lastName: {
        type: String,
        required: [true, 'Le nom de famille est requis']
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    telephone: {
        type: String,
        required: [true, 'Le numéro de téléphone est requis']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuel pour récupérer les animaux d'un propriétaire
ownerSchema.virtual('pets', {
    ref: 'Pet',
    localField: '_id',
    foreignField: 'owner'
});

// Méthode pour récupérer le nom complet
ownerSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

// Middlware pour supprimer tous les animaux associés à un propriétaire lors de sa suppression
ownerSchema.pre('remove', async function(next) {
    await this.model('Pet').deleteMany({ owner: this._id });
    next();
});

module.exports = mongoose.model('Owner', ownerSchema);