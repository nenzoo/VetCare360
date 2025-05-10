// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard.jsx';

import api from '../../services/api.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        ownerCount: 0,
        petCount: 0,
        visitCount: 0,
        vetCount: 0,
        recentVisits: [],
        petTypes: {}
    });

    const [monthlyVisits, setMonthlyVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Récupérer les statistiques générales
                const data = await api.getDashboardStatsIncremental();
                setStats(data);

                // Récupérer les statistiques mensuelles des visites
                const visitsData = await api.getMonthlyVisitsStats();
                setMonthlyVisits(visitsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statsData = [
        {
            title: 'Propriétaires',
            count: stats.ownerCount,
            growth: 'Totale de propriétaires',
            icon: 'fas fa-user-friends',
            color: 'primary',
            bgColorClass: 'stat-card-primary',
            link: '/owners'
        },
        {
            title: 'Animaux',
            count: stats.petCount,
            growth: 'Totale d animaux',
            icon: 'fas fa-dog',
            color: 'success',
            bgColorClass: 'stat-card-success'
        },
        {
            title: 'Visites',
            count: stats.visitCount,
            growth: 'Totale de visites',
            icon: 'fas fa-calendar-alt',
            color: 'warning',
            bgColorClass: 'stat-card-warning'
        },
        {
            title: 'Vétérinaires',
            count: stats.vetCount,
            growth: 'Totale de vétérinaires',
            icon: 'fas fa-user-md',
            color: 'info',
            bgColorClass: 'stat-card-info',
            link: '/vets'
        }
    ];

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Statistics Cards */}
            <div className="stat-cards">
                <div className="row mb-4">
                    {statsData.map((stat, index) => (
                        <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
                            <StatCard {...stat} />
                        </div>
                    ))}
                </div>
            </div>
            {/* Charts Row */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Statistiques des visites</h5>
                            <p className="card-text text-muted">Visites mensuelles au cours des 12 derniers mois</p>
                            <div className="chart-container" style={{ height: 300 }}>
                                {monthlyVisits.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={monthlyVisits}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 12 }}
                                                interval={0}
                                                angle={-45}
                                                textAnchor="end"
                                                height={70}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" name="Nombre de visites" fill="#027a6a" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <p>Aucune donnée de visite disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Types d'animaux</h5>
                            <p className="card-text text-muted">Répartition par espèce</p>
                            <div className="chart-container">
                                {Object.keys(stats.petTypes).length > 0 ? (
                                    <div className="p-3">
                                        {Object.entries(stats.petTypes).map(([type, count], index) => (
                                            <div className="mb-2" key={index}>
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-capitalize">{type}</span>
                                                    <span>{count}</span>
                                                </div>
                                                <div className="progress">
                                                    <div
                                                        className={`progress-bar bg-${['primary', 'success', 'info', 'warning', 'danger'][index % 5]}`}
                                                        role="progressbar"
                                                        style={{ width: `${(count / stats.petCount) * 100}%` }}
                                                        aria-valuenow={(count / stats.petCount) * 100}
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <p>Aucune donnée disponible</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;