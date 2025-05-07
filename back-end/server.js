// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Routes
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const visitRoutes = require('./routes/visitRoutes');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes API
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/veterinarians', vetRoutes);
app.use('/api/visits', visitRoutes);

// Middleware de gestion des erreurs
app.use(errorHandler);

// Définir le port et démarrer le serveur
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});