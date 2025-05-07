import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VisitEdit = () => {
    const { id } = useParams(); // id de la visite
    const navigate = useNavigate();

    const [visit, setVisit] = useState({
        date: new Date().toISOString().substr(0, 10),
        description: '',
        pet: '',
        veterinarian: ''
    });

    const [pet, setPet] = useState(null);
    const [vets, setVets] = useState([]);
    const [ownerId, setOwnerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les informations de la visite
                const visitData = await api.getVisitById(id);
                setVisit(visitData);

                // Récupérer les informations de l'animal associé à la visite
                const petData = await api.getPetById(visitData.pet._id || visitData.pet);
                setPet(petData);

                // Récupérer l'ID du propriétaire
                if (petData.owner) {
                    if (typeof petData.owner === 'object') {
                        setOwnerId(petData.owner._id);
                    } else {
                        setOwnerId(petData.owner);
                    }
                }

                // Récupérer la liste des vétérinaires
                const vetsData = await api.getVeterinarians();
                setVets(vetsData);

            } catch (error) {
                console.error('Failed to fetch data', error);
                setErrors({ general: "Erreur lors du chargement des données" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVisit(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!visit.date) newErrors.date = 'La date est requise';
        if (!visit.description.trim()) newErrors.description = 'La description est requise';
        if (!visit.veterinarian) newErrors.veterinarian = 'Le vétérinaire est requis';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setSubmitting(true);

        try {
            await api.updateVisit(id, visit);
            alert("Visite modifiée avec succès!");

            // Redirection vers la page du propriétaire
            if (ownerId) {
                navigate(`/owners/${ownerId}`);
            } else {
                navigate('/owners');
            }
        } catch (error) {
            console.error('Failed to update visit', error);
            setErrors({ general: "Erreur lors de la mise à jour de la visite" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette visite ?')) {
            return;
        }

        try {
            await api.deleteVisit(id);
            alert("Visite supprimée avec succès!");

            // Redirection vers la page du propriétaire
            if (ownerId) {
                navigate(`/owners/${ownerId}`);
            } else {
                navigate('/owners');
            }
        } catch (error) {
            console.error('Failed to delete visit', error);
            alert('Erreur lors de la suppression de la visite');
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
                <h4 className="card-title mb-4">Modifier la visite</h4>
                {generalError}

                {pet && (
                    <div className="mb-4 p-3 bg-light rounded">
                        <h5>Informations sur l'animal</h5>
                        <table className="table table-borderless mb-0">
                            <tbody>
                            <tr>
                                <th scope="row">Nom</th>
                                <td>{pet.name}</td>
                            </tr>
                            <tr>
                                <th scope="row">Type</th>
                                <td>{pet.type}</td>
                            </tr>
                            <tr>
                                <th scope="row">Propriétaire</th>
                                <td>
                                    {pet.owner && typeof pet.owner === 'object'
                                        ? `${pet.owner.firstName} ${pet.owner.lastName}`
                                        : 'Non spécifié'}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                            id="date"
                            name="date"
                            value={visit.date ? visit.date.substring(0, 10) : ''}
                            onChange={handleChange}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            id="description"
                            name="description"
                            rows="3"
                            value={visit.description || ''}
                            onChange={handleChange}
                        ></textarea>
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="veterinarian" className="form-label">Vétérinaire</label>
                        <select
                            className={`form-select ${errors.veterinarian ? 'is-invalid' : ''}`}
                            id="veterinarian"
                            name="veterinarian"
                            value={visit.veterinarian && (visit.veterinarian._id || visit.veterinarian) || ''}
                            onChange={handleChange}
                        >
                            <option value="">Sélectionnez un vétérinaire</option>
                            {vets.map(vet => (
                                <option key={vet._id} value={vet._id}>
                                    Dr. {vet.firstName} {vet.lastName} {vet.specialties?.length > 0 ? `(${vet.specialties.join(', ')})` : ''}
                                </option>
                            ))}
                        </select>
                        {errors.veterinarian && <div className="invalid-feedback">{errors.veterinarian}</div>}
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

export default VisitEdit;