// models/Visit.js
const mongoose = require('mongoose');

const visitSchema = mongoose.Schema({
    date: {
        type: Date,
        required: [true, 'La date est requise'],
        default: Date.now
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'L\'animal est requis']
    },
    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinarian'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Visit', visitSchema);