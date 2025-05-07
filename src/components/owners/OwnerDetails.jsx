// src/components/owners/OwnerDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OwnerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [owner, setOwner] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOwnerAndPets = async () => {
            try {
                const ownerData = await api.getOwnerById(id);
                setOwner(ownerData);

                // Si le propriétaire a des animaux dans sa réponse, utilisez-les
                if (ownerData.pets && Array.isArray(ownerData.pets)) {
                    console.log("Animaux récupérés depuis ownerData:", ownerData.pets);
                    setPets(ownerData.pets);
                } else {
                    // Sinon, requête distincte pour les animaux
                    try {
                        console.log("Récupération des animaux par appel API distinct");
                        const petsData = await api.getPetsByOwnerId(id);
                        setPets(petsData);
                    } catch (petError) {
                        console.error('Failed to fetch pets', petError);
                        setPets([]);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch owner details', err);
                setError('Impossible de récupérer les informations du propriétaire');
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerAndPets();
    }, [id]);

    const handleDeleteOwner = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
            try {
                await api.deleteOwner(id);
                navigate('/owners');
            } catch (error) {
                console.error('Failed to delete owner', error);
                alert('Erreur lors de la suppression du propriétaire');
            }
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !owner) {
        return (
            <div className="container">
                <div className="alert alert-danger">
                    {error || "Propriétaire non trouvé"}
                    <div className="mt-3">
                        <Link to="/owners" className="btn btn-primary">Retour à la liste</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card mb-4">
                <div className="card-body">
                    <h4 className="card-title mb-4">Informations du propriétaire</h4>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Coordonnées</h5>
                                    <table className="table table-borderless">
                                        <tbody>
                                        <tr>
                                            <th scope="row">Nom</th>
                                            <td>{owner.firstName} {owner.lastName}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Adresse</th>
                                            <td>{owner.address}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Ville</th>
                                            <td>{owner.city}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">Téléphone</th>
                                            <td>{owner.telephone}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div className="d-flex gap-2">
                                        <Link to={`/owners/${id}/edit`} className="btn btn-primary">
                                            <i className="fas fa-edit me-1"></i> Modifier
                                        </Link>
                                        <Link to={`/owners/${id}/pets/new`} className="btn btn-success">
                                            <i className="fas fa-plus me-1"></i> Ajouter un animal
                                        </Link>
                                        <button onClick={handleDeleteOwner} className="btn btn-danger">
                                            <i className="fas fa-trash me-1"></i> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h5 className="mb-3">Animaux et visites</h5>

                    {pets.length === 0 ? (
                        <div className="alert alert-info">
                            <p>Ce propriétaire n'a pas encore d'animaux enregistrés.</p>
                            <Link to={`/owners/${id}/pets/new`} className="btn btn-success btn-sm">
                                Ajouter un animal
                            </Link>
                        </div>
                    ) : (
                        <div className="accordion" id="petsAccordion">
                            {pets.map((pet, index) => (
                                <div className="accordion-item" key={pet._id || index}>
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button
                                            className="accordion-button"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                            aria-expanded={index === 0 ? "true" : "false"}
                                            aria-controls={`collapse${index}`}
                                        >
                                            <span className="me-2">{pet.name}</span>
                                            <span className="badge bg-secondary me-2">{pet.type}</span>
                                            {pet.age && <span className="text-muted">{pet.age} ans</span>}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse${index}`}
                                        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                                        aria-labelledby={`heading${index}`}
                                        data-bs-parent="#petsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <div className="d-flex justify-content-end mb-3">
                                                <Link to={`/pets/${pet._id || pet.id}/edit`} className="btn btn-sm btn-primary me-2">
                                                    <i className="fas fa-edit"></i> Modifier
                                                </Link>
                                                <Link to={`/pets/${pet._id || pet.id}/visits/new`} className="btn btn-sm btn-success">
                                                    <i className="fas fa-plus"></i> Ajouter une visite
                                                </Link>
                                            </div>

                                            <h6 className="mb-3">Visites antérieures</h6>

                                            {pet.visits && pet.visits.length > 0 ? (
                                                <div className="table-responsive">
                                                    <table className="table table-sm table-hover">
                                                        <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Description</th>
                                                            <th>Vétérinaire</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {pet.visits.map((visit, visitIndex) => (
                                                            <tr key={visit._id || visitIndex}>
                                                                <td>{visit.date ? new Date(visit.date).toLocaleDateString() : 'N/A'}</td>
                                                                <td>{visit.description}</td>
                                                                <td>
                                                                    {visit.veterinarian ?
                                                                        `Dr. ${visit.veterinarian.firstName} ${visit.veterinarian.lastName}` :
                                                                        'Non spécifié'}
                                                                </td>
                                                                <td>
                                                                    <Link to={`/visits/${visit._id || visit.id}/edit`} className="btn btn-sm btn-outline-primary">
                                                                        <i className="fas fa-edit"></i>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-muted">Aucune visite enregistrée pour cet animal.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerDetails;