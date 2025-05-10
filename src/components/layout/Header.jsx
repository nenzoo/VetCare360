import React from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();

    // Je trouve le titre de la page selon l'URL
    function getPageTitle() {
        if (location.pathname === '/') return 'Tableau de bord';
        if (location.pathname.includes('/find-owners')) return 'Recherche de propriétaires';
        if (location.pathname.includes('/owners/new')) return 'Nouveau propriétaire';
        if (location.pathname.includes('/owners/edit')) return 'Modifier un propriétaire';
        if (location.pathname.includes('/owners') && location.pathname.includes('/pets/new')) return 'Ajouter un animal';
        if (location.pathname.includes('/owners') && location.pathname.includes('/pets/edit')) return 'Modifier un animal';
        if (location.pathname.includes('/owners') && location.pathname.includes('/pets') && location.pathname.includes('/visits/new')) return 'Ajouter une visite';
        if (location.pathname.includes('/owners')) return 'Informations du propriétaire';
        if (location.pathname.includes('/vets')) return 'Vétérinaires';
        if (location.pathname.includes('/error')) return 'Erreur';
        return 'VetCare 360';
    }

    return (
        <div className="header d-flex justify-content-between align-items-center">
            <div>
                <h4 className="mb-0">{getPageTitle()}</h4>
                <p className="text-muted mb-0">Gestion de clinique vétérinaire</p>
            </div>
        </div>
    );
}

export default Header;