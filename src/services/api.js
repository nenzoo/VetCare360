import axios from 'axios';

// L'adresse de mon API
const API_URL = 'http://localhost:2000/api';

// Je vérifie si c'est un bon ID MongoDB
function checkId(id) {
    return id && /^[0-9a-fA-F]{24}$/.test(id);
}

// Pour gérer les erreurs
function handleError(error) {
    console.error('ERREUR API:', error);

    if (error.response) {
        // Le serveur a répondu avec une erreur
        console.error('Status code:', error.response.status);
        console.error('Données erreur:', error.response.data);
    } else if (error.request) {
        // J'ai fait la requête mais pas de réponse
        console.error('Pas de réponse reçue:', error.request);
    } else {
        // Une erreur quand je configure la requête
        console.error('Message erreur:', error.message);
    }

    throw error;
}

const api = {
    // Récupérer tous les propriétaires
    getOwners: async function() {
        try {
            const response = await axios.get(`${API_URL}/owners`);

            // Je compte les animaux pour chaque propriétaire
            const ownersWithPets = [];

            for (let i = 0; i < response.data.length; i++) {
                const owner = response.data[i];
                try {
                    const petsResponse = await axios.get(`${API_URL}/pets/owner/${owner._id}`);
                    const newOwner = {
                        ...owner,
                        petCount: petsResponse.data.length,
                        hasPets: petsResponse.data.length > 0
                    };
                    ownersWithPets.push(newOwner);
                } catch (err) {
                    const newOwner = {
                        ...owner,
                        petCount: 0,
                        hasPets: false
                    };
                    ownersWithPets.push(newOwner);
                }
            }

            return ownersWithPets;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer un animal par son ID
    getPetById: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID d'animal pas bon");
            }
            const response = await axios.get(`${API_URL}/pets/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer tous les animaux
    getAllPets: async function() {
        try {
            const response = await axios.get(`${API_URL}/pets`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Chercher propriétaires par nom de famille
    searchOwnersByLastName: async function(lastName) {
        try {
            const response = await axios.get(`${API_URL}/owners?lastName=${lastName}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer un propriétaire par ID
    getOwnerById: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID propriétaire pas bon");
            }
            const response = await axios.get(`${API_URL}/owners/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Créer un propriétaire
    createOwner: async function(ownerData) {
        try {
            const response = await axios.post(`${API_URL}/owners`, ownerData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Mettre à jour un propriétaire
    updateOwner: async function(id, ownerData) {
        try {
            if (!checkId(id)) {
                throw new Error("ID propriétaire pas bon");
            }
            const response = await axios.put(`${API_URL}/owners/${id}`, ownerData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Supprimer un propriétaire
    deleteOwner: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID propriétaire pas bon");
            }
            const response = await axios.delete(`${API_URL}/owners/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer les animaux d'un propriétaire
    getPetsByOwnerId: async function(ownerId) {
        try {
            if (!checkId(ownerId)) {
                throw new Error("ID propriétaire pas bon");
            }
            const response = await axios.get(`${API_URL}/pets/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Créer un animal
    createPet: async function(petData) {
        try {
            console.log("Je crée un animal avec:", petData);

            // Je vérifie que le propriétaire existe
            if (!petData.owner) {
                throw new Error("Il faut un propriétaire pour créer un animal");
            }

            if (!checkId(petData.owner)) {
                throw new Error("L'ID du propriétaire n'est pas bon");
            }

            const response = await axios.post(`${API_URL}/pets`, petData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Mettre à jour un animal
    updatePet: async function(id, petData) {
        try {
            if (!checkId(id)) {
                throw new Error("ID animal pas bon");
            }
            const response = await axios.put(`${API_URL}/pets/${id}`, petData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Supprimer un animal
    deletePet: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID animal pas bon");
            }
            const response = await axios.delete(`${API_URL}/pets/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer les vétérinaires
    getVeterinarians: async function() {
        try {
            const response = await axios.get(`${API_URL}/veterinarians`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer les visites d'un animal
    getVisitsByPetId: async function(petId) {
        try {
            if (!checkId(petId)) {
                throw new Error("ID animal pas bon");
            }
            const response = await axios.get(`${API_URL}/visits/pets/${petId}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Récupérer une visite par ID
    getVisitById: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID visite pas bon");
            }
            const response = await axios.get(`${API_URL}/visits/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Créer une visite
    createVisit: async function(visitData) {
        try {
            const response = await axios.post(`${API_URL}/visits`, visitData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Mettre à jour une visite
    updateVisit: async function(id, visitData) {
        try {
            if (!checkId(id)) {
                throw new Error("ID visite pas bon");
            }
            const response = await axios.put(`${API_URL}/visits/${id}`, visitData);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Supprimer une visite
    deleteVisit: async function(id) {
        try {
            if (!checkId(id)) {
                throw new Error("ID visite pas bon");
            }
            const response = await axios.delete(`${API_URL}/visits/${id}`);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    // Stats des visites par mois
    getMonthlyVisitsStats: async function() {
        try {
            // Je récupère toutes les visites
            const response = await axios.get(`${API_URL}/visits`);
            const visits = response.data;

            // Pour stocker les comptages par mois
            const monthlyData = {};

            // Date d'il y a 12 mois
            const oneYearAgo = new Date();
            oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);

            // Je mets 0 pour tous les mois
            for (let i = 0; i < 12; i++) {
                const date = new Date(oneYearAgo);
                date.setMonth(oneYearAgo.getMonth() + i);
                const monthKey = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2);
                monthlyData[monthKey] = 0;
            }

            // Je compte les visites par mois
            if (visits && visits.length > 0) {
                for (let i = 0; i < visits.length; i++) {
                    const visit = visits[i];
                    if (visit.date) {
                        const visitDate = new Date(visit.date);
                        // Seulement les visites des 12 derniers mois
                        if (visitDate >= oneYearAgo) {
                            const month = visitDate.getMonth() + 1;
                            const year = visitDate.getFullYear();
                            const monthKey = year + '-' + ('0' + month).slice(-2);

                            if (monthlyData[monthKey]) {
                                monthlyData[monthKey] = monthlyData[monthKey] + 1;
                            } else {
                                monthlyData[monthKey] = 1;
                            }
                        }
                    }
                }
            }

            // Je transforme pour le graphique
            const chartData = [];
            for (const month in monthlyData) {
                const count = monthlyData[month];
                // Format "YYYY-MM" en "MMM YYYY"
                const year = month.split('-')[0];
                const monthNum = month.split('-')[1];
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                const monthName = date.toLocaleString('fr-FR', { month: 'short' });

                chartData.push({
                    month: monthName + ' ' + year,
                    count: count
                });
            }

            // Je trie par date
            chartData.sort(function(a, b) {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA - dateB;
            });

            return chartData;
        } catch (error) {
            console.error('Erreur stats visites mensuelles', error);

            // Si erreur, données de démo
            const demoData = [];
            const currentDate = new Date();

            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(currentDate.getMonth() - i);
                const monthName = date.toLocaleString('fr-FR', { month: 'short' });
                const year = date.getFullYear();

                demoData.push({
                    month: monthName + ' ' + year,
                    count: Math.floor(Math.random() * 20) + 5
                });
            }

            return demoData;
        }
    },

    // Stats pour dashboard
    getDashboardStats: async function() {
        try {
            // Je récupère toutes les données pour le tableau de bord
            const ownersResponse = await axios.get(`${API_URL}/owners`);
            const petsResponse = await axios.get(`${API_URL}/pets`);
            const vetsResponse = await axios.get(`${API_URL}/veterinarians`);
            const visitsResponse = await axios.get(`${API_URL}/visits`);

            const owners = ownersResponse.data;
            const pets = petsResponse.data;
            const vets = vetsResponse.data;
            const visits = visitsResponse.data;

            // Je calcule les statistiques
            return {
                ownerCount: owners.length,
                petCount: pets.length,
                vetCount: vets.length,
                visitCount: visits ? visits.length : 0,
                recentVisits: visits ?
                    visits
                        .sort(function(a, b) {
                            return new Date(b.date) - new Date(a.date);
                        })
                        .slice(0, 5) :
                    []
            };
        } catch (error) {
            console.error('Erreur stats dashboard', error);

            // Si erreur, données par défaut
            return {
                ownerCount: 0,
                petCount: 0,
                vetCount: 0,
                visitCount: 0,
                recentVisits: []
            };
        }
    },

    // Stats dashboard incrémentales
    getDashboardStatsIncremental: async function() {
        try {
            let dashboardData = {
                ownerCount: 0,
                petCount: 0,
                vetCount: 0,
                visitCount: 0,
                recentVisits: [],
                petTypes: {}
            };

            // Nombre de propriétaires
            const ownersResponse = await axios.get(`${API_URL}/owners`);
            dashboardData.ownerCount = ownersResponse.data.length;

            // Les animaux et statistiques
            const petsResponse = await axios.get(`${API_URL}/pets`);
            const pets = petsResponse.data;
            dashboardData.petCount = pets.length;

            // Je calcule les types d'animaux
            for (let i = 0; i < pets.length; i++) {
                const pet = pets[i];
                const type = pet.type || 'non spécifié';

                if (dashboardData.petTypes[type]) {
                    dashboardData.petTypes[type] = dashboardData.petTypes[type] + 1;
                } else {
                    dashboardData.petTypes[type] = 1;
                }
            }

            // Nombre de vétérinaires
            const vetsResponse = await axios.get(`${API_URL}/veterinarians`);
            dashboardData.vetCount = vetsResponse.data.length;

            // Je récupère les visites si possible
            try {
                const visitsResponse = await axios.get(`${API_URL}/visits`);
                const visits = visitsResponse.data;
                dashboardData.visitCount = visits.length;

                // Visites récentes
                dashboardData.recentVisits = visits
                    .sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    })
                    .slice(0, 5);
            } catch (error) {
                console.log('Problème avec les visites', error);
            }

            return dashboardData;
        } catch (error) {
            console.error('Erreur stats dashboard incrémentielles', error);
            throw error;
        }
    }
};

export default api;