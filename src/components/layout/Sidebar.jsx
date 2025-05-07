import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="col-md-3 col-lg-2 d-md-block sidebar collapse">
            <div className="brand">
                <div className="brand-logo">
                    <i className="fas fa-paw text-white"></i>
                </div>
                <div className="brand-text text-white">VetCare 360</div>
            </div>

            <div className="d-flex flex-column p-3">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <i className="fas fa-home"></i> Accueil
                </Link>
                <Link to="/owners" className={`nav-link ${location.pathname.includes('/owners') || location.pathname.includes('/owners') ? 'active' : ''}`}>
                    <i className="fas fa-user-friends"></i> Propriétaires
                </Link>
                <Link to="/vets" className={`nav-link ${location.pathname.includes('/veterinarians') ? 'active' : ''}`}>
                    <i className="fas fa-user-md"></i> Vétérinaires
                </Link>

            </div>
        </div>
    );
};

export default Sidebar;