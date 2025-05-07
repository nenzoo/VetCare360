// src/components/owners/OwnerForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const OwnerForm = () => {
    const [owner, setOwner] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOwner(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!owner.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!owner.lastName.trim()) newErrors.lastName = 'Le nom de famille est requis';
        if (!owner.telephone.trim()) newErrors.telephone = 'Le numéro de téléphone est requis';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const newOwner = await api.createOwner(owner);
            navigate(`/owners/${newOwner._id}`);
        } catch (error) {
            console.error('Failed to create owner', error);
            // Gérer les erreurs de validation du serveur
            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title mb-4">Nouveau propriétaire</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">Prénom</label>
                            <input
                                type="text"
                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                id="firstName"
                                name="firstName"
                                value={owner.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Nom de famille</label>
                            <input
                                type="text"
                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                id="lastName"
                                name="lastName"
                                value={owner.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Adresse</label>
                            <input
                                type="text"
                                className="form-control"
                                id="address"
                                name="address"
                                value={owner.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">Ville</label>
                            <input
                                type="text"
                                className="form-control"
                                id="city"
                                name="city"
                                value={owner.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="telephone" className="form-label">Téléphone</label>
                            <input
                                type="text"
                                className={`form-control ${errors.telephone ? 'is-invalid' : ''}`}
                                id="telephone"
                                name="telephone"
                                value={owner.telephone}
                                onChange={handleChange}
                            />
                            {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                        </div>

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button
                                type="button"
                                className="btn btn-secondary me-md-2"
                                onClick={() => navigate('/owners')}
                            >
                                Annuler
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Ajouter le propriétaire'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OwnerForm;