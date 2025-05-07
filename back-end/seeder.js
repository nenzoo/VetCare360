// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Owner = require('./models/Owner');
const Pet = require('./models/Pet');
const Veterinarian = require('./models/Veterinarian');
const Visit = require('./models/Visit');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI);

// Données de test
const owners = [
    {
        firstName: 'George',
        lastName: 'Franklin',
        address: '110 W. Liberty St.',
        city: 'Madison',
        telephone: '6085551023'
    },
    {
        firstName: 'Betty',
        lastName: 'Davis',
        address: '638 Cardinal Ave.',
        city: 'Sun Prairie',
        telephone: '6085551749'
    },
    {
        firstName: 'Eduardo',
        lastName: 'Rodriguez',
        address: '2693 Commerce St.',
        city: 'McFarland',
        telephone: '6085558763'
    },
    {
        firstName: 'Harold',
        lastName: 'Davis',
        address: '563 Friendly St.',
        city: 'Windsor',
        telephone: '6085553198'
    },
    {
        firstName: 'Peter',
        lastName: 'McTavish',
        address: '2387 S. Fair Way',
        city: 'Madison',
        telephone: '6085552765'
    },
    {
        firstName: 'Jean',
        lastName: 'Coleman',
        address: '105 N. Lake St.',
        city: 'Monona',
        telephone: '6085552654'
    },
    {
        firstName: 'Jeff',
        lastName: 'Black',
        address: '1450 Oak Blvd.',
        city: 'Monona',
        telephone: '6085555387'
    },
    {
        firstName: 'Maria',
        lastName: 'Escobito',
        address: '345 Maple St.',
        city: 'Madison',
        telephone: '6085557683'
    },
    {
        firstName: 'David',
        lastName: 'Schroeder',
        address: '2749 Blackhawk Trail',
        city: 'Madison',
        telephone: '6085559435'
    },
    {
        firstName: 'Carlos',
        lastName: 'Estaban',
        address: '2335 Independence La.',
        city: 'Waunakee',
        telephone: '6085555487'
    }
];

const vets = [
    {
        firstName: 'James',
        lastName: 'Carter',
        specialties: []
    },
    {
        firstName: 'Linda',
        lastName: 'Douglas',
        specialties: ['dentistry', 'surgery']
    },
    {
        firstName: 'Sharon',
        lastName: 'Jenkins',
        specialties: []
    },
    {
        firstName: 'Helen',
        lastName: 'Leary',
        specialties: ['radiology']
    },
    {
        firstName: 'Rafael',
        lastName: 'Ortega',
        specialties: ['surgery']
    },
    {
        firstName: 'Henry',
        lastName: 'Stevens',
        specialties: ['radiology']
    }
];

// Fonction pour importer les données
const importData = async () => {
    try {
        // Effacer les données existantes
        await Owner.deleteMany();
        await Pet.deleteMany();
        await Veterinarian.deleteMany();
        await Visit.deleteMany();

        console.log('Données effacées...');

        // Insérer les vétérinaires
        const createdVets = await Veterinarian.insertMany(vets);
        console.log(`${createdVets.length} vétérinaires insérés`);

        // Insérer les propriétaires
        const createdOwners = await Owner.insertMany(owners);
        console.log(`${createdOwners.length} propriétaires insérés`);

        // Créer quelques animaux
        const pets = [
            {
                name: 'Leo',
                type: 'chien',
                age: 3,
                owner: createdOwners[0]._id
            },
            {
                name: 'Basil',
                type: 'chat',
                age: 2,
                owner: createdOwners[1]._id
            },
            {
                name: 'Jewel',
                type: 'oiseau',
                age: 1,
                owner: createdOwners[2]._id
            },
            {
                name: 'Iggy',
                type: 'reptile',
                age: 2,
                owner: createdOwners[3]._id
            },
            {
                name: 'George',
                type: 'reptile',
                age: 5,
                owner: createdOwners[4]._id
            },
            {
                name: 'Max',
                type: 'chat',
                age: 1,
                owner: createdOwners[5]._id
            },
            {
                name: 'Lucky',
                type: 'chien',
                birthDate: new Date('2010-06-24'),
                owner: createdOwners[9]._id
            },
            {
                name: 'Sly',
                type: 'chat',
                birthDate: new Date('2012-06-08'),
                owner: createdOwners[9]._id
            }
        ];

        const createdPets = await Pet.insertMany(pets);
        console.log(`${createdPets.length} animaux insérés`);

        // Créer quelques visites
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const visits = [
            {
                date: oneMonthAgo,
                description: 'Analyse complète',
                pet: createdPets[6]._id, // Lucky
                veterinarian: createdVets[0]._id // Dr. Carter
            },
            {
                date: twoMonthsAgo,
                description: 'Vaccination annuelle',
                pet: createdPets[6]._id, // Lucky
                veterinarian: createdVets[1]._id // Dr. Douglas
            },
            {
                date: new Date(),
                description: 'Contrôle de routine',
                pet: createdPets[0]._id, // Leo
                veterinarian: createdVets[2]._id // Dr. Jenkins
            },
            {
                date: new Date(),
                description: 'Problème respiratoire',
                pet: createdPets[1]._id, // Basil
                veterinarian: createdVets[3]._id // Dr. Leary
            }
        ];

        const createdVisits = await Visit.insertMany(visits);
        console.log(`${createdVisits.length} visites insérées`);

        console.log('Importation terminée !');
        process.exit();
    } catch (error) {
        console.error(`Erreur : ${error.message}`);
        process.exit(1);
    }
};

// Fonction pour supprimer les données
const destroyData = async () => {
    try {
        await Owner.deleteMany();
        await Pet.deleteMany();
        await Veterinarian.deleteMany();
        await Visit.deleteMany();

        console.log('Données supprimées !');
        process.exit();
    } catch (error) {
        console.error(`Erreur : ${error.message}`);
        process.exit(1);
    }
};

// Exécuter la fonction correspondante selon l'argument
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}