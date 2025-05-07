// src/components/owners/OwnerSearch.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// Ajout du CSS pour le nouveau champ de recherche et le background
const customStyles = `

`;

const OwnerSearch = () => {
    const [lastName, setLastName] = useState('');
    const [owners, setOwners] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Utilisez la fonction générique getOwners si vous n'avez pas d'endpoint de recherche spécifique
            const data = await api.getOwners();

            // Récupérer les animaux pour chaque propriétaire
            const ownersWithPets = await Promise.all(
                data.map(async (owner) => {
                    try {
                        const pets = await api.getPetsByOwnerId(owner._id);
                        return {
                            ...owner,
                            pets: pets
                        };
                    } catch (err) {
                        console.error(`Erreur lors de la récupération des animaux pour ${owner.firstName} ${owner.lastName}:`, err);
                        return {
                            ...owner,
                            pets: []
                        };
                    }
                })
            );

            // Filtrage côté client si le backend ne supporte pas la recherche
            const filteredOwners = lastName.trim()
                ? ownersWithPets.filter(owner => owner.lastName.toLowerCase().includes(lastName.toLowerCase()))
                : ownersWithPets;

            setOwners(filteredOwners);
            setSearched(true);
        } catch (error) {
            console.error('Failed to search owners', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Ajout du style inline pour le nouveau champ de recherche */}
            <style>{customStyles}</style>

            <div className="card mb-4 owner-search-card">
                <div className="card-body">
                    <h4 className="card-title mb-4">Recherche de propriétaires</h4>

                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-6">
                                {/* Nouveau design du champ de recherche */}
                                <div className="input-container">
                                    <input
                                        type="text"
                                        name="lastName"
                                        className="input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Rechercher un nom..."
                                    />
                                    <span className="icon">
                                        <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                            <g id="SVGRepo_iconCarrier">
                                                <path opacity="1" d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity="1" d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                <path opacity="1" d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </g>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-2 me-4">
                                <button type="submit" className="custom-button custom-button-search" disabled={loading}>
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <><i className="fas fa-search me-2"></i>Rechercher</>
                                    )}
                                </button>
                            </div>
                            <div className="col-md-3">
                                <button onClick={() => window.location.href = '/owners/new'} className="custom-button custom-button-search" style={{textDecoration: 'none', color: 'inherit'}}>
                                    <i className="fas fa-plus me-2"></i>Ajouter un propriétaire
                                </button>
                            </div>
                        </div>
                    </form>

                    {searched && (
                        <div className="owners-list">
                            <h5>{owners.length ? 'Résultats de la recherche' : 'Aucun propriétaire trouvé'}</h5>

                            {owners.length > 0 ? (
                                <div className="table-responsive mt-3">
                                    <table className="table table-hover">
                                        <thead>
                                        <tr>
                                            <th>Nom</th>
                                            <th>Adresse</th>
                                            <th>Ville</th>
                                            <th>Téléphone</th>
                                            <th>Animaux</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {owners.map(owner => (
                                            <tr key={owner._id || owner.id}>
                                                <td>
                                                    <Link to={`/owners/${owner._id || owner.id}`}>
                                                        {owner.firstName} {owner.lastName}
                                                    </Link>
                                                </td>
                                                <td>{owner.address}</td>
                                                <td>{owner.city}</td>
                                                <td>{owner.telephone}</td>
                                                <td>
                                                    {owner.pets && owner.pets.length > 0
                                                        ? owner.pets.map(pet => `${pet.name} (${pet.type})`).join(', ')
                                                        : 'Aucun animal'
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-info">
                                    Aucun propriétaire trouvé. Voulez-vous en <Link to="/owners/new">ajouter un nouveau</Link>?
                                </div>
                            )}
                        </div>
                    )}

                    {!searched && (
                        <div className="text-center p-5">
                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Utilisez le formulaire ci-dessus pour rechercher des propriétaires par nom de famille.</p>
                            <p>Ou <Link to="/owners/new" className="btn btn-outline-success btn-sm">ajoutez un nouveau propriétaire</Link></p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerSearch;