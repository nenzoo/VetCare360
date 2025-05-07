// src/components/veterinarians/VeterinariansList.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Correction de l'import ici

const VeterinariansList = () => {
    const [veterinarians, setVeterinarians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVeterinarians = async () => {
            try {
                // Utiliser l'API importée correctement
                const data = await api.getVeterinarians();
                setVeterinarians(data);
            } catch (error) {
                console.error('Failed to fetch veterinarians', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVeterinarians();
    }, []);

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mb-4">Vétérinaires</h4>
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Spécialités</th>
                        </tr>
                        </thead>
                        <tbody>
                        {veterinarians.map(vet => (
                            <tr key={vet._id}>
                                <td>{vet.firstName} {vet.lastName}</td>
                                <td>{vet.specialties?.length ? vet.specialties.join(', ') : 'Aucune'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VeterinariansList;