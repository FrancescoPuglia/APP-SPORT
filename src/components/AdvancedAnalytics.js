import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { it } from 'date-fns/locale';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const AdvancedAnalytics = () => {
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState('3months');
    const [selectedMetric, setSelectedMetric] = useState('weight');
    const [loading, setLoading] = useState(false);

    // DATI MOCK REALISTICI - ENTERPRISE LEVEL
    const mockData = {
        // Dati peso corporeo ultimi 3 mesi
        weightProgress: [
            { date: '2024-06-01', weight: 75.2, bodyFat: 15.5, muscleMass: 34.2 },
            { date: '2024-06-15', weight: 76.1, bodyFat: 15.2, muscleMass: 34.8 },
            { date: '2024-07-01', weight: 76.8, bodyFat: 14.8, muscleMass: 35.4 },
            { date: '2024-07-15', weight: 77.5, bodyFat: 14.5, muscleMass: 36.1 },
            { date: '2024-08-01', weight: 78.2, bodyFat: 14.1, muscleMass: 36.8 },
            { date: '2024-08-15', weight: 79.1, bodyFat: 13.8, muscleMass: 37.5 },
            { date: '2024-09-01', weight: 79.8, bodyFat: 13.5, muscleMass: 38.2 }
        ],
        
        // Dati allenamenti settimanali
        workoutData: [
            { week: 'Set 1', sessions: 5, volume: 12500, duration: 360 },
            { week: 'Set 2', sessions: 4, volume: 11800, duration: 280 },
            { week: 'Set 3', sessions: 6, volume: 14200, duration: 420 },
            { week: 'Set 4', sessions: 5, volume: 13600, duration: 380 },
            { week: 'Ago 1', sessions: 5, volume: 13200, duration: 350 },
            { week: 'Ago 2', sessions: 4, volume: 12100, duration: 300 },
            { week: 'Ago 3', sessions: 6, volume: 15800, duration: 450 },
            { week: 'Ago 4', sessions: 5, volume: 14400, duration: 400 }
        ],

        // Distribuzione gruppi muscolari
        muscleGroups: [
            { name: 'Petto', sessions: 24, percentage: 20 },
            { name: 'Dorso', sessions: 22, percentage: 18 },
            { name: 'Gambe', sessions: 18, percentage: 15 },
            { name: 'Spalle', sessions: 16, percentage: 13 },
            { name: 'Braccia', sessions: 20, percentage: 17 },
            { name: 'Core', sessions: 12, percentage: 10 },
            { name: 'Cardio', sessions: 8, percentage: 7 }
        ],

        // Performance principali esercizi
        exerciseProgress: [
            { exercise: 'Panca Piana', current: 95, start: 75, improvement: 26.7 },
            { exercise: 'Squat', current: 125, start: 100, improvement: 25.0 },
            { exercise: 'Deadlift', current: 155, start: 120, improvement: 29.2 },
            { exercise: 'Military Press', current: 65, start: 50, improvement: 30.0 },
            { exercise: 'Trazioni', current: 15, start: 8, improvement: 87.5 }
        ],

        // Dati nutrition
        nutritionStats: {
            avgProteinDaily: 145,
            avgCaloriesDaily: 2850,
            adherenceRate: 87,
            mealsPrepared: 156,
            cheatsThisMonth: 4
        },

        // Dati recovery
        recoveryData: [
            { date: '2024-08-01', type: 'Sauna', duration: 20, quality: 9 },
            { date: '2024-08-03', type: 'Ice Bath', duration: 5, quality: 8 },
            { date: '2024-08-05', type: 'Massage', duration: 60, quality: 10 },
            { date: '2024-08-08', type: 'Stretching', duration: 30, quality: 7 },
            { date: '2024-08-10', type: 'Sauna', duration: 25, quality: 9 },
            { date: '2024-08-12', type: 'Ice Bath', duration: 4, quality: 8 },
            { date: '2024-08-15', type: 'Yoga', duration: 45, quality: 8 }
        ]
    };

    // CONFIGURAZIONE GRAFICI
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#00ffff',
                    font: { size: 12, weight: 'bold' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 255, 255, 0.9)',
                titleColor: '#000',
                bodyColor: '#000',
                borderColor: '#00ffff',
                borderWidth: 2
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(0, 255, 255, 0.1)' },
                ticks: { color: '#00ffff', font: { weight: 'bold' } }
            },
            y: {
                grid: { color: 'rgba(0, 255, 255, 0.1)' },
                ticks: { color: '#00ffff', font: { weight: 'bold' } }
            }
        }
    };

    // GRAFICO PROGRESSO PESO
    const weightChartData = {
        labels: mockData.weightProgress.map(d => format(new Date(d.date), 'dd/MM')),
        datasets: [
            {
                label: 'Peso (kg)',
                data: mockData.weightProgress.map(d => d.weight),
                borderColor: '#00ffff',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff9500',
                pointBorderColor: '#00ffff',
                pointBorderWidth: 2,
                pointRadius: 6
            },
            {
                label: 'Massa Muscolare (kg)',
                data: mockData.weightProgress.map(d => d.muscleMass),
                borderColor: '#ff9500',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00ffff',
                pointBorderColor: '#ff9500',
                pointBorderWidth: 2,
                pointRadius: 6
            }
        ]
    };

    // GRAFICO VOLUME ALLENAMENTI
    const workoutChartData = {
        labels: mockData.workoutData.map(d => d.week),
        datasets: [
            {
                label: 'Volume (kg)',
                data: mockData.workoutData.map(d => d.volume),
                backgroundColor: 'rgba(0, 255, 255, 0.8)',
                borderColor: '#00ffff',
                borderWidth: 2
            },
            {
                label: 'Durata (min)',
                data: mockData.workoutData.map(d => d.duration),
                backgroundColor: 'rgba(255, 149, 0, 0.8)',
                borderColor: '#ff9500',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
    };

    const workoutChartOptions = {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                ticks: { color: '#ff9500', font: { weight: 'bold' } }
            }
        }
    };

    // GRAFICO DISTRIBUZIONE MUSCOLI
    const muscleChartData = {
        labels: mockData.muscleGroups.map(m => m.name),
        datasets: [
            {
                data: mockData.muscleGroups.map(m => m.percentage),
                backgroundColor: [
                    '#00ffff', '#ff9500', '#ff6b6b', '#4ecdc4', 
                    '#45b7d1', '#96ceb4', '#feca57'
                ],
                borderColor: '#000',
                borderWidth: 2
            }
        ]
    };

    // STATISTICHE CALCOLATE
    const stats = {
        totalWorkouts: mockData.workoutData.reduce((sum, w) => sum + w.sessions, 0),
        totalVolume: mockData.workoutData.reduce((sum, w) => sum + w.volume, 0),
        avgWorkoutDuration: Math.round(
            mockData.workoutData.reduce((sum, w) => sum + w.duration, 0) / 
            mockData.workoutData.reduce((sum, w) => sum + w.sessions, 0)
        ),
        weightGain: (mockData.weightProgress[mockData.weightProgress.length - 1].weight - mockData.weightProgress[0].weight).toFixed(1),
        muscleGain: (mockData.weightProgress[mockData.weightProgress.length - 1].muscleMass - mockData.weightProgress[0].muscleMass).toFixed(1),
        bodyFatLoss: (mockData.weightProgress[0].bodyFat - mockData.weightProgress[mockData.weightProgress.length - 1].bodyFat).toFixed(1),
        currentStreak: 12,
        bestLift: mockData.exerciseProgress.reduce((max, ex) => ex.current > max ? ex.current : max, 0)
    };

    return (
        <div className="analytics-premium">
            {/* HEADER CON BACK BUTTON */}
            <div className="analytics-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>
                
                <div className="header-title">
                    <h1>📊 ANALYTICS ENTERPRISE</h1>
                    <p className="subtitle">Dashboard avanzata per il monitoraggio dei progressi</p>
                </div>

                <div className="period-selector">
                    <select 
                        value={selectedPeriod} 
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="period-select"
                    >
                        <option value="1month">1 Mese</option>
                        <option value="3months">3 Mesi</option>
                        <option value="6months">6 Mesi</option>
                        <option value="1year">1 Anno</option>
                    </select>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="kpi-grid">
                <div className="kpi-card primary">
                    <div className="kpi-icon">💪</div>
                    <div className="kpi-data">
                        <span className="kpi-value">+{stats.weightGain}kg</span>
                        <span className="kpi-label">Peso Totale</span>
                    </div>
                    <div className="kpi-trend up">↗ +15%</div>
                </div>

                <div className="kpi-card success">
                    <div className="kpi-icon">🔥</div>
                    <div className="kpi-data">
                        <span className="kpi-value">+{stats.muscleGain}kg</span>
                        <span className="kpi-label">Massa Muscolare</span>
                    </div>
                    <div className="kpi-trend up">↗ +12%</div>
                </div>

                <div className="kpi-card warning">
                    <div className="kpi-icon">⚖️</div>
                    <div className="kpi-data">
                        <span className="kpi-value">-{stats.bodyFatLoss}%</span>
                        <span className="kpi-label">Grasso Corporeo</span>
                    </div>
                    <div className="kpi-trend down">↘ -13%</div>
                </div>

                <div className="kpi-card info">
                    <div className="kpi-icon">🏆</div>
                    <div className="kpi-data">
                        <span className="kpi-value">{stats.currentStreak}</span>
                        <span className="kpi-label">Giorni Consecutivi</span>
                    </div>
                    <div className="kpi-trend up">🔥 Streak!</div>
                </div>
            </div>

            {/* GRAFICI PRINCIPALI */}
            <div className="charts-grid">
                {/* Grafico Progresso Peso */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>📈 PROGRESSO COMPOSIZIONE CORPOREA</h3>
                        <div className="chart-controls">
                            <button 
                                className={`control-btn ${selectedMetric === 'weight' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric('weight')}
                            >
                                Peso
                            </button>
                            <button 
                                className={`control-btn ${selectedMetric === 'muscle' ? 'active' : ''}`}
                                onClick={() => setSelectedMetric('muscle')}
                            >
                                Muscoli
                            </button>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <Line data={weightChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Grafico Volume Allenamenti */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>🏋️ VOLUME & DURATA ALLENAMENTI</h3>
                        <div className="chart-stats">
                            <span>Volume Medio: {Math.round(stats.totalVolume / mockData.workoutData.length)}kg</span>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <Bar data={workoutChartData} options={workoutChartOptions} />
                    </div>
                </div>

                {/* Grafico Distribuzione Muscoli */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3>🎯 DISTRIBUZIONE GRUPPI MUSCOLARI</h3>
                        <div className="chart-stats">
                            <span>Sessioni Totali: {stats.totalWorkouts}</span>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <Doughnut data={muscleChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* PERFORMANCE ESERCIZI */}
            <div className="exercises-performance">
                <h3>🏆 TOP PERFORMANCE ESERCIZI</h3>
                <div className="exercises-grid">
                    {mockData.exerciseProgress.map((exercise, index) => (
                        <div key={index} className="exercise-card">
                            <div className="exercise-header">
                                <h4>{exercise.exercise}</h4>
                                <span className="improvement">+{exercise.improvement}%</span>
                            </div>
                            <div className="exercise-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${(exercise.current / 200) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="exercise-stats">
                                    <span>Attuale: <strong>{exercise.current}kg</strong></span>
                                    <span>Inizio: {exercise.start}kg</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* NUTRITION & RECOVERY STATS */}
            <div className="secondary-stats">
                <div className="stat-section">
                    <h3>🥗 NUTRITION INSIGHTS</h3>
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-icon">💪</div>
                            <div className="stat-info">
                                <span className="stat-value">{mockData.nutritionStats.avgProteinDaily}g</span>
                                <span className="stat-label">Proteine/Giorno</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-info">
                                <span className="stat-value">{mockData.nutritionStats.avgCaloriesDaily}</span>
                                <span className="stat-label">Calorie/Giorno</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <span className="stat-value">{mockData.nutritionStats.adherenceRate}%</span>
                                <span className="stat-label">Aderenza Dieta</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-section">
                    <h3>🛁 RECOVERY INSIGHTS</h3>
                    <div className="recovery-list">
                        {mockData.recoveryData.slice(0, 4).map((session, index) => (
                            <div key={index} className="recovery-item">
                                <div className="recovery-type">{session.type}</div>
                                <div className="recovery-duration">{session.duration}min</div>
                                <div className="recovery-quality">
                                    {'★'.repeat(Math.floor(session.quality / 2))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* INSIGHTS AI */}
            <div className="ai-insights">
                <h3>🤖 AI INSIGHTS & RACCOMANDAZIONI</h3>
                <div className="insights-grid">
                    <div className="insight-card success">
                        <div className="insight-icon">🎯</div>
                        <div className="insight-content">
                            <h4>Eccellente Progressione</h4>
                            <p>Il tuo aumento di massa muscolare è sopra la media! Continua con questo ritmo.</p>
                        </div>
                    </div>
                    <div className="insight-card warning">
                        <div className="insight-icon">⚡</div>
                        <div className="insight-content">
                            <h4>Aumenta Volume Gambe</h4>
                            <p>Le gambe rappresentano solo il 15% del volume. Considera di aggiungere una sessione.</p>
                        </div>
                    </div>
                    <div className="insight-card info">
                        <div className="insight-icon">🏆</div>
                        <div className="insight-content">
                            <h4>Recovery Ottimale</h4>
                            <p>Le tue sessioni di recupero sono bilanciate. Perfetto equilibrio allenamento-riposo!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedAnalytics;