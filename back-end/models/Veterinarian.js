// models/Veterinarian.js
const mongoose = require('mongoose');

const veterinarianSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est requis']
    },
    lastName: {
        type: String,
        required: [true, 'Le nom de famille est requis']
    },
    specialties: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Méthode pour récupérer le nom complet
veterinarianSchema.methods.getFullName = function() {
    return `Dr. ${this.firstName} ${this.lastName}`;
};

module.exports = mongoose.model('Veterinarian', veterinarianSchema);