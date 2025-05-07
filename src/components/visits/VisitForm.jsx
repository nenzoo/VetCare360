import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VisitForm = () => {
    const { id } = useParams(); // id de l'animal
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [vets, setVets] = useState([]);
    const [previousVisits, setPreviousVisits] = useState([]);
    const [visit, setVisit] = useState({
        date: new Date().toISOString().substr(0, 10),
        description: '',
        pet: id,
        veterinarian: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ces fonctions doivent être implémentées dans votre API
                const [petData, vetsData, visitsData] = await Promise.all([
                    api.getPetById(id),
                    api.getVeterinarians(),
                    api.getVisitsByPetId(id)
                ]);

                setPet(petData);
                setVets(vetsData);
                setPreviousVisits(visitsData);

                // Si des vétérinaires sont disponibles, sélectionnez le premier par défaut
                if (vetsData.length > 0) {
                    setVisit(prev => ({ ...prev, veterinarian: vetsData[0]._id }));
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
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
            await api.createVisit(visit);
            alert("Visite ajoutée avec succès!");
            // Redirection vers la liste des propriétaires au lieu d'un propriétaire spécifique
            navigate('/owners');
        } catch (error) {
            console.error('Failed to create visit', error);
            alert("Erreur lors de l'ajout de la visite");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    if (!pet) {
        return <div className="alert alert-danger">Animal non trouvé</div>;
    }

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mb-4">Nouvelle visite</h4>

                <div className="mb-4 p-3 bg-light rounded">
                    <h5>Informations sur l'animal</h5>
                    <table className="table table-borderless">
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
                            <th scope="row">Âge</th>
                            <td>{pet.age ? `${pet.age} ans` : 'Non spécifié'}</td>
                        </tr>
                        <tr>
                            <th scope="row">Propriétaire</th>
                            <td>{pet.owner?.firstName} {pet.owner?.lastName}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Date</label>
                        <input
                            type="date"
                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                            id="date"
                            name="date"
                            value={visit.date}
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
                            value={visit.description}
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
                            value={visit.veterinarian}
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

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={() => navigate('/owners')}
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
                                'Ajouter la visite'
                            )}
                        </button>
                    </div>
                </form>

                {/* Liste des visites précédentes */}
                {previousVisits.length > 0 && (
                    <div className="mt-5">
                        <h5 className="mb-3">Visites précédentes</h5>
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Vétérinaire</th>
                                </tr>
                                </thead>
                                <tbody>
                                {previousVisits.map(visit => (
                                    <tr key={visit._id}>
                                        <td>{new Date(visit.date).toLocaleDateString()}</td>
                                        <td>{visit.description}</td>
                                        <td>
                                            {visit.veterinarian ?
                                                `Dr. ${visit.veterinarian.firstName} ${visit.veterinarian.lastName}` :
                                                'Non spécifié'}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitForm;