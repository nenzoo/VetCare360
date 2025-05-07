import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PetForm = () => {
    const { id } = useParams(); // id du propriétaire
    const navigate = useNavigate();

    const [owner, setOwner] = useState(null);
    const [pet, setPet] = useState({
        name: '',
        type: 'chien',
        age: '',
        owner: null // On initialisera cela correctement après avoir récupéré les données du propriétaire
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const petTypes = ['chien', 'chat', 'oiseau', 'lapin', 'rongeur', 'reptile', 'autre'];

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                console.log("ID du propriétaire depuis les paramètres:", id);

                if (!id) {
                    console.error("ID du propriétaire manquant");
                    setErrors(prev => ({ ...prev, general: "ID du propriétaire manquant" }));
                    setLoading(false);
                    return;
                }

                const ownerData = await api.getOwnerById(id);
                console.log("Données du propriétaire récupérées:", ownerData);

                setOwner(ownerData);

                // Mettre à jour le pet avec l'ID du propriétaire
                setPet(prev => ({
                    ...prev,
                    owner: ownerData._id || id // Utiliser l'_id du propriétaire si disponible, sinon l'ID des paramètres
                }));

                console.log("Pet mis à jour avec l'ID propriétaire:", {
                    ...pet,
                    owner: ownerData._id || id
                });
            } catch (error) {
                console.error('Failed to fetch owner', error);
                setErrors(prev => ({ ...prev, general: "Échec du chargement du propriétaire" }));
            } finally {
                setLoading(false);
            }
        };

        fetchOwner();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPet(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!pet.name.trim()) newErrors.name = 'Le nom est requis';
        if (!pet.type) newErrors.type = 'Le type d\'animal est requis';
        if (pet.age && (isNaN(pet.age) || pet.age < 0)) {
            newErrors.age = 'L\'âge doit être un nombre positif';
        }

        if (!pet.owner) {
            newErrors.owner = 'Le propriétaire est requis';
            console.error("Validation: owner manquant", pet);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Données du pet avant validation:", pet);
        console.log("ID propriétaire actuel:", id);
        console.log("Objet owner actuel:", owner);

        if (!validate()) {
            console.error("Validation échouée:", errors);
            return;
        }

        setSubmitting(true);

        try {
            // Assurez-vous que l'owner est correctement défini
            const finalPetData = {
                ...pet,
                owner: pet.owner || (owner?._id) || id,
                age: pet.age ? Number(pet.age) : undefined
            };

            console.log("Données finales envoyées au serveur:", finalPetData);

            const response = await api.createPet(finalPetData);
            console.log("Réponse du serveur:", response);

            navigate(`/owners/${id}`);
        } catch (error) {
            console.error('Failed to create pet', error);
            console.log("Détails de l'erreur:", error.response?.data);

            // Gérer les erreurs de validation du serveur
            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            } else if (error.response?.data?.error || error.response?.data?.details) {
                // Pour gérer les messages d'erreur généraux du serveur
                const errorMessage = error.response?.data?.details || error.response?.data?.error;
                setErrors(prev => ({ ...prev, general: errorMessage }));
            } else {
                setErrors(prev => ({ ...prev, general: "Une erreur s'est produite lors de la création de l'animal" }));
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    if (!owner && !loading) {
        return <div className="alert alert-danger">Propriétaire non trouvé</div>;
    }

    // Affichage des erreurs générales en haut du formulaire
    const generalError = errors.general ? (
        <div className="alert alert-danger mb-4">{errors.general}</div>
    ) : null;

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mb-4">Ajouter un animal</h4>
                {generalError}
                {owner && (
                    <p className="text-muted mb-4">
                        Propriétaire : {owner.firstName} {owner.lastName}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nom</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            name="name"
                            value={pet.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Type d'animal</label>
                        <select
                            className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                            id="type"
                            name="type"
                            value={pet.type}
                            onChange={handleChange}
                        >
                            {petTypes.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="age" className="form-label">Âge (en années)</label>
                        <input
                            type="number"
                            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                            id="age"
                            name="age"
                            value={pet.age}
                            onChange={handleChange}
                            min="0"
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                    </div>

                    {/* Champ caché pour le propriétaire */}
                    <input
                        type="hidden"
                        name="owner"
                        value={owner?._id || id}
                    />

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => navigate(`/owners/${id}`)}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                'Ajouter l\'animal'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PetForm;