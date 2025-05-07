// components/owners/OwnerEdit.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

const OwnerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [owner, setOwner] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: ''
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const data = await api.getOwnerById(id);
                setOwner(data);
            } catch (error) {
                console.error('Failed to fetch owner', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOwner();
    }, [id]);

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

        setSubmitting(true);

        try {
            await api.updateOwner(id, owner);
            navigate(`/owners/${id}`);
        } catch (error) {
            console.error('Failed to update owner', error);
            // Gérer les erreurs de validation du serveur
            if (error.response?.data?.errors) {
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>;
    }

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mb-4">Modifier le propriétaire</h4>

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
                                'Enregistrer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OwnerEdit;