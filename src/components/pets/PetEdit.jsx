import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PetEdit = () => {
    const { id } = useParams(); // id de l'animal
    const navigate = useNavigate();

    const [pet, setPet] = useState({
        name: '',
        type: '',
        age: '',
        owner: ''
    });
    const [ownerId, setOwnerId] = useState(null); // Variable dédiée pour stocker l'ID du propriétaire
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const petTypes = ['chien', 'chat', 'oiseau', 'lapin', 'rongeur', 'reptile', 'autre'];

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const petData = await api.getPetById(id);
                setPet(petData);

                // Stocker l'ID du propriétaire de façon fiable
                if (petData.owner) {
                    if (typeof petData.owner === 'object') {
                        console.log("Owner is an object, storing ID:", petData.owner._id);
                        setOwnerId(petData.owner._id);
                    } else {
                        console.log("Owner is a string ID, storing:", petData.owner);
                        setOwnerId(petData.owner);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch pet', error);
                setErrors({ general: "Erreur lors du chargement des données de l'animal" });
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);

        try {
            // Utiliser l'ID du propriétaire stocké séparément
            const petData = {
                ...pet,
                owner: ownerId || pet.owner, // Utiliser ownerId en priorité
                age: pet.age ? Number(pet.age) : undefined
            };

            console.log("Envoi des données pour mise à jour:", petData);

            await api.updatePet(id, petData);
            alert("Animal modifié avec succès!");

            // Redirection simplifiée et sécurisée
            if (ownerId) {
                navigate(`/owners/${ownerId}`);
            } else {
                // Fallback vers la liste des propriétaires si l'ID n'est pas disponible
                navigate('/owners');
            }
        } catch (error) {
            console.error('Failed to update pet', error);
            setErrors({ general: "Erreur lors de la mise à jour de l'animal" });

            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(prev => ({ ...prev, ...serverErrors }));
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet animal ?')) {
            return;
        }

        try {
            await api.deletePet(id);

            // Utiliser ownerId pour la redirection après suppression
            if (ownerId) {
                navigate(`/owners/${ownerId}`);
            } else {
                navigate('/owners');
            }
        } catch (error) {
            console.error('Failed to delete pet', error);
            alert('Erreur lors de la suppression de l\'animal');
        }
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    // Affichage des erreurs générales
    const generalError = errors.general ? (
        <div className="alert alert-danger mb-4">{errors.general}</div>
    ) : null;

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mb-4">Modifier l'animal</h4>
                {generalError}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nom</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            name="name"
                            value={pet.name || ''}
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
                            value={pet.type || 'chien'}
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
                            value={pet.age || ''}
                            onChange={handleChange}
                            min="0"
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Supprimer
                        </button>

                        <div className="d-flex">
                            <button
                                type="button"
                                className="btn btn-secondary me-2"
                                onClick={() => ownerId ? navigate(`/owners/${ownerId}`) : navigate('/owners')}
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
                                    'Enregistrer'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PetEdit;