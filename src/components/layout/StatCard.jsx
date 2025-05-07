// src/components/StatCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StatCard.css';

const StatCard = ({ title, count, growth, icon, color, bgColorClass, link }) => {
    const navigate = useNavigate();

    // On définit des couleurs personnalisées en fonction de la classe bgColorClass
    const getFrontColor = () => {
        switch (bgColorClass) {
            case 'stat-card-primary': return '#4e73df';
            case 'stat-card-success': return '#1cc88a';
            case 'stat-card-warning': return '#f6c23e';
            case 'stat-card-info': return '#36b9cc';
            default: return '#6A2C70';
        }
    };

    const getBackColor = () => {
        switch (bgColorClass) {
            case 'stat-card-primary': return '#3a57c0';
            case 'stat-card-success': return '#17a673';
            case 'stat-card-warning': return '#e4ad2c';
            case 'stat-card-info': return '#2ca0b1';
            default: return '#F08A5D';
        }
    };

    const frontStyle = {
        backgroundColor: getFrontColor(),
        borderColor: getFrontColor()
    };

    const backStyle = {
        backgroundColor: getBackColor(),
        borderColor: getBackColor()
    };

    const handleClick = () => {
        if (link) {
            navigate(link);
        }
    };

    return (
        <div className={`stat-card ${link ? 'clickable' : ''}`} onClick={handleClick}>
            <div className="stat-card-inner">
                <div className="stat-card-front" style={frontStyle}>
                    <div className="icon-container">
                        <i className={`${icon} fa-3x`}></i>
                        <div className="title">{title}</div>
                    </div>
                </div>
                <div className="stat-card-back" style={backStyle}>
                    <div className="content">
                        <h4 className="count">{count}</h4>
                        {growth && <div className="growth">{growth}</div>}
                        {link && <div className="link-hint">Cliquer pour voir</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;