// src/components/StatCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StatCard.css';

function StatCard(props) {
    const navigate = useNavigate();

    // Je décompose les props
    const title = props.title;
    const count = props.count;
    const growth = props.growth;
    const icon = props.icon;
    const color = props.color;
    const bgColorClass = props.bgColorClass;
    const link = props.link;

    // Je choisis les couleurs pour le front
    function getFrontColor() {
        if (bgColorClass === 'stat-card-primary') return '#4e73df';
        if (bgColorClass === 'stat-card-success') return '#1cc88a';
        if (bgColorClass === 'stat-card-warning') return '#f6c23e';
        if (bgColorClass === 'stat-card-info') return '#36b9cc';
        return '#6A2C70';
    }

    // Je choisis les couleurs pour le back
    function getBackColor() {
        if (bgColorClass === 'stat-card-primary') return '#0539f8';
        if (bgColorClass === 'stat-card-success') return '#04dc8e';
        if (bgColorClass === 'stat-card-warning') return '#c18905';
        if (bgColorClass === 'stat-card-info') return '#009bae';
        return '#F08A5D';
    }

    // Je fais les styles
    const frontStyle = {
        backgroundColor: getFrontColor(),
        borderColor: getFrontColor()
    };

    const backStyle = {
        backgroundColor: getBackColor(),
        borderColor: getBackColor()
    };

    // Quand on clique
    function handleClick() {
        if (link) {
            navigate(link);
        }
    }

    return (
        <div className={link ? 'stat-card clickable' : 'stat-card'} onClick={handleClick}>
            <div className="stat-card-inner">
                <div className="stat-card-front" style={frontStyle}>
                    <div className="icon-container">
                        <i className={icon + ' fa-3x'}></i>
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
}

export default StatCard;