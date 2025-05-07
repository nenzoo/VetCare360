import axios from 'axios';

const API_URL = 'http://localhost:2000/api'; // Ajustez selon votre configuration

// Fonction pour vérifier si une chaîne est un ObjectId MongoDB valide
const isValidObjectId = (id) => {
    return id && /^[0-9a-fA-F]{24}$/.test(id);
};

// Ajout d'une fonction de gestion des erreurs
const handleApiError = (error) => {
    console.error('API Error:', error);

    if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
    } else if (error.request) {
        // La requête a été faite mais pas de réponse
        console.error('No response received:', error.request);
    } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Error message:', error.message);
    }

    throw error;
};

const api = {
    // Propriétaires
    getOwners: async () => {
        try {
            const response = await axios.get(`${API_URL}/owners`);

            // Récupérer le nombre d'animaux pour chaque propriétaire
            const ownersWithPetCount = await Promise.all(
                response.data.map(async (owner) => {
                    try {
                        const petsResponse = await axios.get(`${API_URL}/pets/owner/${owner._id}`);
                        return {
                            ...owner,
                            petCount: petsResponse.data.length,
                            hasPets: petsResponse.data.length > 0
                        };
                    } catch (err) {
                        return {
                            ...owner,
                            petCount: 0,
                            hasPets: false
                        };
                    }
                })
            );

            return ownersWithPetCount;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtenir un pet spécifique par son ID
    getPetById: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID d'animal invalide");
            }
            const response = await axios.get(`${API_URL}/pets/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtenir tous les pets
    getAllPets: async () => {
        try {
            const response = await axios.get(`${API_URL}/pets`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    searchOwnersByLastName: async (lastName) => {
        try {
            const response = await axios.get(`${API_URL}/owners?lastName=${lastName}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    getOwnerById: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de propriétaire invalide");
            }
            const response = await axios.get(`${API_URL}/owners/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    createOwner: async (ownerData) => {
        try {
            const response = await axios.post(`${API_URL}/owners`, ownerData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    updateOwner: async (id, ownerData) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de propriétaire invalide");
            }
            const response = await axios.put(`${API_URL}/owners/${id}`, ownerData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    deleteOwner: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de propriétaire invalide");
            }
            const response = await axios.delete(`${API_URL}/owners/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Animaux
    getPetsByOwnerId: async (ownerId) => {
        try {
            if (!isValidObjectId(ownerId)) {
                throw new Error("ID de propriétaire invalide");
            }
            const response = await axios.get(`${API_URL}/pets/owner/${ownerId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    createPet: async (petData) => {
        try {
            console.log("Création d'un animal avec les données:", petData);

            // Vérifier que le propriétaire est bien défini et est un ObjectId valide
            if (!petData.owner) {
                throw new Error("Le propriétaire (owner) est requis pour créer un animal");
            }

            if (!isValidObjectId(petData.owner)) {
                throw new Error("L'ID du propriétaire n'est pas un ObjectId MongoDB valide");
            }

            const response = await axios.post(`${API_URL}/pets`, petData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    updatePet: async (id, petData) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID d'animal invalide");
            }
            const response = await axios.put(`${API_URL}/pets/${id}`, petData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    deletePet: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID d'animal invalide");
            }
            const response = await axios.delete(`${API_URL}/pets/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Vétérinaires
    getVeterinarians: async () => {
        try {
            const response = await axios.get(`${API_URL}/veterinarians`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Visites
    getVisitsByPetId: async (petId) => {
        try {
            if (!isValidObjectId(petId)) {
                throw new Error("ID d'animal invalide");
            }
            const response = await axios.get(`${API_URL}/visits/pets/${petId}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Obtenir une visite par son ID
    getVisitById: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de visite invalide");
            }
            const response = await axios.get(`${API_URL}/visits/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Créer une visite
    createVisit: async (visitData) => {
        try {
            const response = await axios.post(`${API_URL}/visits`, visitData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Mettre à jour une visite
    updateVisit: async (id, visitData) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de visite invalide");
            }
            const response = await axios.put(`${API_URL}/visits/${id}`, visitData);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Supprimer une visite
    deleteVisit: async (id) => {
        try {
            if (!isValidObjectId(id)) {
                throw new Error("ID de visite invalide");
            }
            const response = await axios.delete(`${API_URL}/visits/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    // Récupérer les statistiques mensuelles de visites
    getMonthlyVisitsStats: async () => {
        try {
            // Récupérer toutes les visites
            const response = await axios.get(`${API_URL}/visits`);
            const visits = response.data;

            // Créer un objet pour stocker les comptages mensuels
            const monthlyData = {};

            // Obtenir la date d'il y a 12 mois
            const oneYearAgo = new Date();
            oneYearAgo.setMonth(oneYearAgo.getMonth() - 11);

            // Initialiser tous les mois des 12 derniers mois avec 0 visites
            for (let i = 0; i < 12; i++) {
                const date = new Date(oneYearAgo);
                date.setMonth(oneYearAgo.getMonth() + i);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                monthlyData[monthKey] = 0;
            }

            // Compter les visites par mois
            if (visits && visits.length > 0) {
                visits.forEach(visit => {
                    if (visit.date) {
                        const visitDate = new Date(visit.date);
                        // Seulement compter les visites des 12 derniers mois
                        if (visitDate >= oneYearAgo) {
                            const monthKey = `${visitDate.getFullYear()}-${(visitDate.getMonth() + 1).toString().padStart(2, '0')}`;
                            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
                        }
                    }
                });
            }

            // Convertir en tableau pour Recharts
            const chartData = Object.entries(monthlyData).map(([month, count]) => {
                // Convertir le format "YYYY-MM" en "MMM YYYY"
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                const monthName = date.toLocaleString('fr-FR', { month: 'short' });

                return {
                    month: `${monthName} ${year}`,
                    count: count
                };
            });

            // Trier par date
            chartData.sort((a, b) => {
                const dateA = new Date(a.month);
                const dateB = new Date(b.month);
                return dateA - dateB;
            });

            return chartData;
        } catch (error) {
            console.error('Error fetching monthly visits stats', error);

            // En cas d'erreur, renvoyer des données de démonstration
            const demoData = [];
            const currentDate = new Date();

            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(currentDate.getMonth() - i);
                const monthName = date.toLocaleString('fr-FR', { month: 'short' });
                const year = date.getFullYear();

                demoData.push({
                    month: `${monthName} ${year}`,
                    count: Math.floor(Math.random() * 20) + 5
                });
            }

            return demoData;
        }
    },

    // Dashboard data
    getDashboardStats: async () => {
        try {
            // Récupérer toutes les données nécessaires pour le tableau de bord
            const [owners, pets, vets, visits] = await Promise.all([
                axios.get(`${API_URL}/owners`),
                axios.get(`${API_URL}/pets`),
                axios.get(`${API_URL}/veterinarians`),
                axios.get(`${API_URL}/visits`) // Vous devrez ajouter cet endpoint côté backend
            ]);

            // Calculer les statistiques
            return {
                ownerCount: owners.data.length,
                petCount: pets.data.length,
                vetCount: vets.data.length,
                visitCount: visits.data ? visits.data.length : 0,
                recentVisits: visits.data ?
                    visits.data
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .slice(0, 5) :
                    []
            };
        } catch (error) {
            console.error('Error fetching dashboard stats', error);

            // En cas d'erreur, renvoyer des données par défaut
            return {
                ownerCount: 0,
                petCount: 0,
                vetCount: 0,
                visitCount: 0,
                recentVisits: []
            };
        }
    },

    // Méthode pour charger les statistiques de manière incrémentale
    // Utile si l'endpoint de statistiques combinées n'est pas disponible
    getDashboardStatsIncremental: async () => {
        try {
            let dashboardData = {
                ownerCount: 0,
                petCount: 0,
                vetCount: 0,
                visitCount: 0,
                recentVisits: [],
                petTypes: {}
            };

            // Récupérer le nombre de propriétaires
            const ownersResponse = await axios.get(`${API_URL}/owners`);
            dashboardData.ownerCount = ownersResponse.data.length;

            // Récupérer les animaux et calculer les statistiques
            const petsResponse = await axios.get(`${API_URL}/pets`);
            const pets = petsResponse.data;
            dashboardData.petCount = pets.length;

            // Calculer la répartition par type d'animal
            pets.forEach(pet => {
                const type = pet.type || 'non spécifié';
                dashboardData.petTypes[type] = (dashboardData.petTypes[type] || 0) + 1;
            });

            // Récupérer le nombre de vétérinaires
            const vetsResponse = await axios.get(`${API_URL}/veterinarians`);
            dashboardData.vetCount = vetsResponse.data.length;

            // Tenter de récupérer les visites si l'endpoint existe
            try {
                const visitsResponse = await axios.get(`${API_URL}/visits`);
                const visits = visitsResponse.data;
                dashboardData.visitCount = visits.length;

                // Récupérer les visites récentes
                dashboardData.recentVisits = visits
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);
            } catch (error) {
                console.log('Visits endpoint may not be available', error);
                // Définir des visites de démonstration si les vraies ne sont pas disponibles
                dashboardData.recentVisits = [
                    { pet: 'Lucky (Chien)', owner: 'Carlos Estaban', date: '24 Avr, 2025', vet: 'Dr. James Carter', status: 'Terminé' },
                    { pet: 'Max (Chat)', owner: 'Jean Coleman', date: '23 Avr, 2025', vet: 'Dr. Linda Douglas', status: 'Terminé' },
                    { pet: 'Jewel (Oiseau)', owner: 'Eduardo Rodriguez', date: '22 Avr, 2025', vet: 'Dr. Sharon Jenkins', status: 'Terminé' },
                    { pet: 'Freddy (Hamster)', owner: 'David Schneider', date: '21 Avr, 2025', vet: 'Dr. Rafael Ortega', status: 'Terminé' }
                ];
            }

            return dashboardData;
        } catch (error) {
            console.error('Error fetching dashboard stats incrementally', error);
            throw error;
        }
    }
};

export default api;