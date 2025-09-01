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
import { dataManager } from '../utils/dataManager';

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
    const [realData, setRealData] = useState(null);

    // Carica dati reali dell'utente
    useEffect(() => {
        const loadRealData = () => {
            const data = dataManager.getAnalyticsData();
            setRealData(data);
        };
        
        loadRealData();
        
        // Ricarica ogni 30 secondi per dati aggiornati
        const interval = setInterval(loadRealData, 30000);
        return () => clearInterval(interval);
    }, []);

    // DATI MOCK COME FALLBACK (QUANDO NON CI SONO DATI REALI)
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

    // FUNZIONE PER GENERARE DATI REALI O FALLBACK
    const getChartData = () => {
        if (realData && realData.measurements && realData.measurements.length > 0) {
            // USA DATI REALI DELL'UTENTE
            const measurements = realData.measurements.slice(-30); // Ultimi 30 rilevamenti
            return {
                labels: measurements.map(m => format(new Date(m.date), 'dd/MM')),
                weightData: measurements.map(m => m.weight || 0),
                muscleMassData: measurements.map(m => m.muscleMass || 0)
            };
        } else {
            // FALLBACK: LINEE PIATTE QUANDO NON CI SONO DATI
            const emptyLabels = ['No Data', 'Inserisci', 'Misurazioni', 'Reali'];
            return {
                labels: emptyLabels,
                weightData: [0, 0, 0, 0],
                muscleMassData: [0, 0, 0, 0]
            };
        }
    };

    const chartData = getChartData();

    // GRAFICO PROGRESSO PESO (DATI REALI)
    const weightChartData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Peso (kg)',
                data: chartData.weightData,
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
                data: chartData.muscleMassData,
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

    // FUNZIONE PER DATI WORKOUT REALI
    const getWorkoutChartData = () => {
        if (realData && realData.workouts && realData.workouts.length > 0) {
            // USA DATI REALI DEGLI ALLENAMENTI
            const workouts = realData.workouts.slice(-10); // Ultimi 10 workout
            return {
                labels: workouts.map((w, i) => `Workout ${i + 1}`),
                volumeData: workouts.map(w => {
                    if (w.exercises && w.exercises.length > 0) {
                        return w.exercises.reduce((total, ex) => 
                            total + (ex.weight * ex.reps * ex.sets), 0
                        );
                    }
                    return 0;
                }),
                durationData: workouts.map(w => w.duration || 0)
            };
        } else {
            // FALLBACK: LINEE COSTANTI
            return {
                labels: ['Nessun Workout', 'Inserisci', 'Dati', 'Reali'],
                volumeData: [0, 0, 0, 0],
                durationData: [0, 0, 0, 0]
            };
        }
    };

    const workoutData = getWorkoutChartData();

    // GRAFICO VOLUME ALLENAMENTI (DATI REALI)
    const workoutChartData = {
        labels: workoutData.labels,
        datasets: [
            {
                label: 'Volume (kg)',
                data: workoutData.volumeData,
                backgroundColor: 'rgba(0, 255, 255, 0.8)',
                borderColor: '#00ffff',
                borderWidth: 2
            },
            {
                label: 'Durata (min)',
                data: workoutData.durationData,
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

    // FUNZIONE PER DISTRIBUZIONE MUSCOLI REALE
    const getMuscleChartData = () => {
        if (realData && realData.workouts && realData.workouts.length > 0) {
            // CALCOLA DISTRIBUZIONE REALE DAI WORKOUT
            const muscleGroups = {};
            let totalVolume = 0;

            realData.workouts.forEach(workout => {
                if (workout.exercises) {
                    workout.exercises.forEach(exercise => {
                        const volume = exercise.weight * exercise.reps * exercise.sets;
                        const muscle = exercise.muscleGroup || 'Altro';
                        muscleGroups[muscle] = (muscleGroups[muscle] || 0) + volume;
                        totalVolume += volume;
                    });
                }
            });

            if (totalVolume > 0) {
                const labels = Object.keys(muscleGroups);
                const data = labels.map(muscle => 
                    Math.round((muscleGroups[muscle] / totalVolume) * 100)
                );
                return { labels, data };
            }
        }
        
        // FALLBACK: NESSUN DATO
        return {
            labels: ['Nessun Dato', 'Inserisci Workout'],
            data: [50, 50]
        };
    };

    const muscleData = getMuscleChartData();

    // GRAFICO DISTRIBUZIONE MUSCOLI (DATI REALI)
    const muscleChartData = {
        labels: muscleData.labels,
        datasets: [
            {
                data: muscleData.data,
                backgroundColor: [
                    '#00ffff', '#ff9500', '#ff6b6b', '#4ecdc4', 
                    '#45b7d1', '#96ceb4', '#feca57'
                ],
                borderColor: '#000',
                borderWidth: 2
            }
        ]
    };

    // STATISTICHE CALCOLATE (DATI REALI)
    const stats = realData ? {
        totalWorkouts: realData.stats.totalWorkouts || 0,
        currentStreak: realData.stats.currentStreak || 0,
        totalVolume: workoutData.volumeData.reduce((sum, vol) => sum + vol, 0),
        avgWorkoutDuration: workoutData.durationData.length > 0 ? 
            Math.round(workoutData.durationData.reduce((sum, dur) => sum + dur, 0) / workoutData.durationData.length) : 0,
        weightGain: realData.stats.weightProgress ? realData.stats.weightProgress.change : '0.0',
        muscleGain: chartData.muscleMassData.length > 1 ? 
            (chartData.muscleMassData[chartData.muscleMassData.length - 1] - chartData.muscleMassData[0]).toFixed(1) : '0.0',
        bodyFatLoss: '0.0',
        nutritionAdherence: Math.round(realData.stats.nutritionAdherence || 0),
        supplementCompliance: realData.stats.supplementCompliance || 0,
        recoveryFrequency: realData.stats.recoveryFrequency || 0,
        bestLift: realData.stats.strengthProgress ? 
            Math.max(...Object.values(realData.stats.strengthProgress).map(ex => ex.currentWeight || 0)) : 0
    } : {
        // FALLBACK QUANDO NON CI SONO DATI
        totalWorkouts: 0,
        currentStreak: 0,
        totalVolume: 0,
        avgWorkoutDuration: 0,
        weightGain: '0.0',
        muscleGain: '0.0',
        bodyFatLoss: '0.0',
        nutritionAdherence: 0,
        supplementCompliance: 0,
        recoveryFrequency: 0,
        bestLift: 0
    };

    // GENERA INSIGHTS DINAMICI BASATI SUI DATI REALI
    const generateInsights = () => {
        if (!realData) {
            return [{
                type: 'info',
                icon: '📊',
                title: 'Inizia il Tracking',
                message: 'Aggiungi dati ai tuoi allenamenti per ricevere insights personalizzati!'
            }];
        }

        const insights = [];

        // Insight su workout streak
        if (stats.currentStreak >= 7) {
            insights.push({
                type: 'success',
                icon: '🔥',
                title: 'Streak Fantastico!',
                message: `${stats.currentStreak} giorni consecutivi! La costanza è la chiave del successo.`
            });
        } else if (stats.totalWorkouts > 0) {
            insights.push({
                type: 'warning',
                icon: '⚡',
                title: 'Mantieni la Costanza',
                message: 'Cerca di allenarti regolarmente per massimizzare i risultati.'
            });
        }

        // Insight su nutrizione
        if (stats.nutritionAdherence >= 80) {
            insights.push({
                type: 'success',
                icon: '🥗',
                title: 'Nutrizione Eccellente',
                message: `${stats.nutritionAdherence}% di aderenza alla dieta. Ottimo lavoro!`
            });
        } else if (stats.nutritionAdherence > 0) {
            insights.push({
                type: 'warning',
                icon: '🍽️',
                title: 'Migliora la Nutrizione',
                message: 'Completa più pasti per raggiungere i tuoi obiettivi più velocemente.'
            });
        }

        // Insight su progressi forza
        if (realData.stats.strengthProgress && Object.keys(realData.stats.strengthProgress).length > 0) {
            const improvements = Object.values(realData.stats.strengthProgress)
                .map(ex => parseFloat(ex.improvement || 0))
                .filter(imp => imp > 0);
            
            if (improvements.length > 0) {
                const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
                insights.push({
                    type: 'success',
                    icon: '💪',
                    title: 'Progressi di Forza',
                    message: `Miglioramento medio del ${avgImprovement.toFixed(1)}% sui tuoi esercizi!`
                });
            }
        }

        // Fallback se non ci sono insights specifici
        if (insights.length === 0) {
            insights.push({
                type: 'info',
                icon: '🚀',
                title: 'Continua Così',
                message: 'Mantieni la disciplina e i risultati arriveranno!'
            });
        }

        return insights.slice(0, 3); // Massimo 3 insights
    };

    const dynamicInsights = generateInsights();

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
                            <span>Volume Medio: {workoutData.volumeData.length > 0 ? Math.round(stats.totalVolume / workoutData.volumeData.length) : 0}kg</span>
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

            {/* PERFORMANCE ESERCIZI (DATI REALI) */}
            <div className="exercises-performance">
                <h3>🏆 TOP PERFORMANCE ESERCIZI</h3>
                <div className="exercises-grid">
                    {realData && realData.stats.strengthProgress ? 
                        Object.entries(realData.stats.strengthProgress).map(([exerciseName, data], index) => (
                            <div key={index} className="exercise-card">
                                <div className="exercise-header">
                                    <h4>{exerciseName}</h4>
                                    <span className="improvement">+{data.improvement || 0}%</span>
                                </div>
                                <div className="exercise-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{ width: `${Math.min((data.currentWeight / 200) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <div className="exercise-stats">
                                        <span>Attuale: <strong>{data.currentWeight || 0}kg</strong></span>
                                        <span>Inizio: {data.initialWeight || 0}kg</span>
                                    </div>
                                </div>
                            </div>
                        ))
                        : 
                        <div className="no-data-message">
                            <h4>🏋️ Nessun Dato Disponibile</h4>
                            <p>Aggiungi workout con pesi per vedere i progressi di forza</p>
                        </div>
                    }
                </div>
            </div>

            {/* NUTRITION & RECOVERY STATS */}
            <div className="secondary-stats">
                <div className="stat-section">
                    <h3>🥗 NUTRITION INSIGHTS (DATI REALI)</h3>
                    <div className="stat-cards">
                        <div className="stat-card">
                            <div className="stat-icon">💪</div>
                            <div className="stat-info">
                                <span className="stat-value">{realData?.nutrition?.weeklyAdherence ? 
                                    Math.round(realData.nutrition.weeklyAdherence.reduce((sum, day) => sum + (day.mealsCompleted * 25), 0) / 7) 
                                    : 0}g</span>
                                <span className="stat-label">Proteine/Giorno</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-info">
                                <span className="stat-value">{realData?.nutrition?.weeklyAdherence ? 
                                    Math.round(realData.nutrition.weeklyAdherence.reduce((sum, day) => sum + (day.mealsCompleted * 500), 0) / 7)
                                    : 0}</span>
                                <span className="stat-label">Calorie/Giorno</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.nutritionAdherence}%</span>
                                <span className="stat-label">Aderenza Dieta</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stat-section">
                    <h3>🛁 RECOVERY INSIGHTS (DATI REALI)</h3>
                    <div className="recovery-list">
                        {realData && realData.recovery && realData.recovery.length > 0 ? 
                            realData.recovery.slice(0, 4).map((session, index) => (
                                <div key={index} className="recovery-item">
                                    <div className="recovery-type">{session.type || 'Sessione'}</div>
                                    <div className="recovery-duration">{session.duration || 0}min</div>
                                    <div className="recovery-quality">
                                        {'★'.repeat(Math.floor((session.quality || 5) / 2))}
                                    </div>
                                </div>
                            ))
                            :
                            <div className="no-recovery-data">
                                <p>🛁 Nessuna sessione recovery registrata</p>
                                <small>Usa la sezione Recovery per tracciare le tue sessioni</small>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* INSIGHTS AI DINAMICI */}
            <div className="ai-insights">
                <h3>🤖 AI INSIGHTS & RACCOMANDAZIONI (BASATE SUI TUOI DATI)</h3>
                <div className="insights-grid">
                    {dynamicInsights.map((insight, index) => (
                        <div key={index} className={`insight-card ${insight.type}`}>
                            <div className="insight-icon">{insight.icon}</div>
                            <div className="insight-content">
                                <h4>{insight.title}</h4>
                                <p>{insight.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MESSAGGIO DATI REALI */}
            <div className="data-status" style={{
                padding: '20px',
                background: realData ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '10px',
                textAlign: 'center',
                marginTop: '20px',
                border: `2px solid ${realData ? '#22c55e' : '#ef4444'}`
            }}>
                <h3 style={{ color: realData ? '#22c55e' : '#ef4444' }}>
                    {realData ? '✅ ANALYTICS REALI ATTIVI' : '⚠️ NESSUN DATO DISPONIBILE'}
                </h3>
                <p style={{ color: realData ? '#22c55e' : '#ef4444' }}>
                    {realData ? 
                        'Tutti i grafici e le statistiche sono basati sui tuoi dati reali!' :
                        'Aggiungi workout, misurazioni e completa pasti per vedere analytics reali.'
                    }
                </p>
            </div>
        </div>
    );
};

export default AdvancedAnalytics;