// Advanced Analytics Dashboard - Data Visualization Enterprise
// Sistema completo di analytics con grafici interattivi e insights automatici

import React, { useState, useEffect, useMemo } from 'react';
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

import { progressRepo, workoutRepo, exerciseRepo, nutritionRepo, recoveryRepo } from '../firebase/firestore';
// import { useAuth } from './AuthProvider';
import { logger } from '../firebase/config';

// Registrazione componenti Chart.js
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
    // const { user } = useAuth();
    const [analyticsData, setAnalyticsData] = useState({
        progress: [],
        workouts: [],
        exercises: [],
        nutrition: [],
        recovery: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('3months');
    const [selectedMetric, setSelectedMetric] = useState('weight');

    // Carica tutti i dati per analytics
    useEffect(() => {
        // if (!user) return;
        loadAnalyticsData();
    }, [user, selectedPeriod]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            logger.info('Caricamento dati analytics...');

            const endDate = new Date();
            const startDate = getPeriodStartDate(selectedPeriod);

            // Carica dati paralleli per performance
            const [progressResult, workoutResult, exerciseResult, nutritionResult, recoveryResult] = await Promise.all([
                progressRepo.getUserProgress(
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                ),
                workoutRepo.getUserSessions(100),
                exerciseRepo.getWithQuery([]),
                nutritionRepo.getUserMeals(
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                ),
                recoveryRepo.getUserRecoverySessions(
                    startDate.toISOString().split('T')[0],
                    endDate.toISOString().split('T')[0]
                )
            ]);

            setAnalyticsData({
                progress: progressResult.success ? progressResult.data : [],
                workouts: workoutResult.success ? workoutResult.data : [],
                exercises: exerciseResult.success ? exerciseResult.data : [],
                nutrition: nutritionResult.success ? nutritionResult.data : [],
                recovery: recoveryResult.success ? recoveryResult.data : []
            });

            logger.success('Dati analytics caricati', {
                progress: progressResult.data?.length || 0,
                workouts: workoutResult.data?.length || 0,
                exercises: exerciseResult.data?.length || 0,
                nutrition: nutritionResult.data?.length || 0,
                recovery: recoveryResult.data?.length || 0
            });

        } catch (error) {
            logger.error('Errore caricamento analytics', error);
        } finally {
            setLoading(false);
        }
    };

    // Utility per calcolo date
    const getPeriodStartDate = (period) => {
        const now = new Date();
        switch (period) {
            case '1month': return subDays(now, 30);
            case '3months': return subDays(now, 90);
            case '6months': return subDays(now, 180);
            case '1year': return subDays(now, 365);
            default: return subDays(now, 90);
        }
    };

    // ========== PROGRESS ANALYTICS ==========
    
    const progressChartData = useMemo(() => {
        if (!analyticsData.progress.length) return null;

        const sortedData = [...analyticsData.progress].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        const labels = sortedData.map(item => 
            format(new Date(item.date), 'dd MMM', { locale: it })
        );

        const datasets = [];

        // Dataset peso
        if (selectedMetric === 'weight' || selectedMetric === 'all') {
            datasets.push({
                label: 'Peso (kg)',
                data: sortedData.map(item => item.weight || null),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6
            });
        }

        // Dataset massa muscolare
        if (selectedMetric === 'muscle' || selectedMetric === 'all') {
            datasets.push({
                label: 'Massa Muscolare (kg)',
                data: sortedData.map(item => item.muscleMass || null),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
                tension: 0.3,
                yAxisID: 'y'
            });
        }

        // Dataset massa grassa
        if (selectedMetric === 'fat' || selectedMetric === 'all') {
            datasets.push({
                label: 'Massa Grassa (%)',
                data: sortedData.map(item => item.bodyFat || null),
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                fill: false,
                tension: 0.3,
                yAxisID: selectedMetric === 'all' ? 'y1' : 'y'
            });
        }

        return { labels, datasets };
    }, [analyticsData.progress, selectedMetric]);

    // ========== WORKOUT ANALYTICS ==========
    
    const workoutVolumeData = useMemo(() => {
        if (!analyticsData.workouts.length) return null;

        const now = new Date();
        const last30Days = eachDayOfInterval({
            start: subDays(now, 29),
            end: now
        });

        const dailyVolume = last30Days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayWorkouts = analyticsData.workouts.filter(workout => 
                workout.date === dayStr && workout.status === 'completed'
            );
            
            const totalDuration = dayWorkouts.reduce((sum, workout) => 
                sum + (workout.totalDuration || 0), 0
            );

            return {
                date: dayStr,
                label: format(day, 'dd/MM'),
                duration: totalDuration,
                sessions: dayWorkouts.length
            };
        });

        return {
            labels: dailyVolume.map(d => d.label),
            datasets: [
                {
                    label: 'Durata (minuti)',
                    data: dailyVolume.map(d => d.duration),
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Numero Sessioni',
                    data: dailyVolume.map(d => d.sessions),
                    backgroundColor: 'rgba(255, 159, 64, 0.8)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        };
    }, [analyticsData.workouts]);

    // ========== EXERCISE DISTRIBUTION ==========
    
    const exerciseDistributionData = useMemo(() => {
        if (!analyticsData.exercises.length) return null;

        const exerciseCount = {};
        analyticsData.exercises.forEach(exercise => {
            const name = exercise.exerciseName || 'Sconosciuto';
            exerciseCount[name] = (exerciseCount[name] || 0) + 1;
        });

        // Top 8 esercizi più frequenti
        const sortedExercises = Object.entries(exerciseCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
        ];

        return {
            labels: sortedExercises.map(([name]) => name),
            datasets: [{
                label: 'Frequenza Esercizi',
                data: sortedExercises.map(([, count]) => count),
                backgroundColor: colors,
                borderColor: colors.map(color => color.replace('0.8', '1')),
                borderWidth: 2
            }]
        };
    }, [analyticsData.exercises]);

    // ========== NUTRITION ANALYTICS ==========
    
    const nutritionAdherenceData = useMemo(() => {
        if (!analyticsData.nutrition.length) return null;

        const now = new Date();
        const last30Days = eachDayOfInterval({
            start: subDays(now, 29),
            end: now
        });

        const dailyAdherence = last30Days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayMeals = analyticsData.nutrition.filter(meal => meal.date === dayStr);
            const completedMeals = dayMeals.filter(meal => meal.status === 'completed');
            
            const adherenceRate = dayMeals.length > 0 ? (completedMeals.length / dayMeals.length) * 100 : 0;
            const totalProteins = completedMeals.reduce((sum, meal) => sum + (meal.proteins || 0), 0);

            return {
                date: dayStr,
                label: format(day, 'dd/MM'),
                adherenceRate,
                totalProteins,
                completedMeals: completedMeals.length,
                totalMeals: dayMeals.length
            };
        });

        return {
            labels: dailyAdherence.map(d => d.label),
            datasets: [
                {
                    label: 'Aderenza Dieta (%)',
                    data: dailyAdherence.map(d => d.adherenceRate),
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    fill: true,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Proteine Giornaliere (g)',
                    data: dailyAdherence.map(d => d.totalProteins),
                    borderColor: 'rgb(168, 85, 247)',
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                    fill: false,
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        };
    }, [analyticsData.nutrition]);

    // ========== RECOVERY ANALYTICS ==========
    
    const recoveryDistributionData = useMemo(() => {
        if (!analyticsData.recovery.length) return null;

        const recoveryCount = {};
        const recoveryDuration = {};
        
        analyticsData.recovery.forEach(session => {
            const type = session.activityType;
            recoveryCount[type] = (recoveryCount[type] || 0) + 1;
            recoveryDuration[type] = (recoveryDuration[type] || 0) + (session.duration || 0);
        });

        const activities = {
            sauna: { name: '🔥 Sauna', color: '#ef4444' },
            steam_bath: { name: '💨 Bagno Turco', color: '#06b6d4' },
            ice_bath: { name: '🧊 Ice Bath', color: '#3b82f6' },
            cold_shower: { name: '🚿 Doccia Fredda', color: '#6366f1' },
            stretching: { name: '🤸 Stretching', color: '#8b5cf6' },
            meditation: { name: '🧘 Meditazione', color: '#a855f7' }
        };

        const sortedActivities = Object.entries(recoveryCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6);

        return {
            labels: sortedActivities.map(([type]) => activities[type]?.name || type),
            datasets: [{
                label: 'Sessioni Recovery',
                data: sortedActivities.map(([, count]) => count),
                backgroundColor: sortedActivities.map(([type]) => activities[type]?.color || '#6b7280'),
                borderColor: sortedActivities.map(([type]) => activities[type]?.color || '#6b7280'),
                borderWidth: 2
            }]
        };
    }, [analyticsData.recovery]);

    const weeklyRecoveryData = useMemo(() => {
        if (!analyticsData.recovery.length) return null;

        const now = new Date();
        const last4Weeks = [];
        
        for (let i = 3; i >= 0; i--) {
            const weekStart = startOfWeek(subDays(now, i * 7), { locale: it });
            const weekEnd = endOfWeek(weekStart, { locale: it });
            
            const weekSessions = analyticsData.recovery.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= weekStart && sessionDate <= weekEnd;
            });

            const totalDuration = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
            
            last4Weeks.push({
                label: format(weekStart, 'dd MMM', { locale: it }),
                sessions: weekSessions.length,
                duration: totalDuration
            });
        }

        return {
            labels: last4Weeks.map(w => w.label),
            datasets: [
                {
                    label: 'Sessioni Recovery',
                    data: last4Weeks.map(w => w.sessions),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Durata Totale (min)',
                    data: last4Weeks.map(w => w.duration),
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderColor: 'rgba(168, 85, 247, 1)',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        };
    }, [analyticsData.recovery]);

    // ========== STATISTICS COMPUTATION ==========
    
    const computedStats = useMemo(() => {
        const stats = {
            totalWorkouts: analyticsData.workouts.filter(w => w.status === 'completed').length,
            totalDuration: analyticsData.workouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0),
            averageWorkoutDuration: 0,
            totalExercises: analyticsData.exercises.length,
            uniqueExercises: new Set(analyticsData.exercises.map(e => e.exerciseName)).size,
            currentStreak: calculateCurrentStreak(),
            progressEntries: analyticsData.progress.length,
            nutritionAdherence: calculateNutritionAdherence(),
            recoverySessionsTotal: analyticsData.recovery.length,
            avgRecoveryDuration: calculateAvgRecoveryDuration()
        };

        stats.averageWorkoutDuration = stats.totalWorkouts > 0 
            ? Math.round(stats.totalDuration / stats.totalWorkouts) 
            : 0;

        // Trend calcoli
        stats.trends = calculateTrends();

        return stats;
    }, [analyticsData]);

    const calculateCurrentStreak = () => {
        const completedWorkouts = analyticsData.workouts
            .filter(w => w.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (!completedWorkouts.length) return 0;

        let streak = 0;
        const today = new Date();
        const workoutDates = [...new Set(completedWorkouts.map(w => w.date))];

        for (let i = 0; i < workoutDates.length; i++) {
            const workoutDate = new Date(workoutDates[i]);
            const daysDiff = Math.floor((today - workoutDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= i + 1) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    const calculateTrends = () => {
        const trends = {};

        // Trend peso
        if (analyticsData.progress.length >= 2) {
            const sortedProgress = [...analyticsData.progress].sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            
            const recent = sortedProgress.slice(-5); // Ultimi 5 punti
            if (recent.length >= 2) {
                const firstWeight = recent[0].weight;
                const lastWeight = recent[recent.length - 1].weight;
                trends.weight = lastWeight > firstWeight ? 'up' : 
                               lastWeight < firstWeight ? 'down' : 'stable';
                trends.weightChange = Math.abs(lastWeight - firstWeight).toFixed(1);
            }
        }

        // Trend volume allenamento
        const last14Days = analyticsData.workouts.filter(w => {
            const workoutDate = new Date(w.date);
            const daysDiff = (new Date() - workoutDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 14 && w.status === 'completed';
        });

        const first7Days = last14Days.filter(w => {
            const workoutDate = new Date(w.date);
            const daysDiff = (new Date() - workoutDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 7;
        });

        const second7Days = last14Days.filter(w => {
            const workoutDate = new Date(w.date);
            const daysDiff = (new Date() - workoutDate) / (1000 * 60 * 60 * 24);
            return daysDiff > 7 && daysDiff <= 14;
        });

        if (first7Days.length && second7Days.length) {
            const avgRecent = first7Days.reduce((sum, w) => sum + (w.totalDuration || 0), 0) / first7Days.length;
            const avgPrevious = second7Days.reduce((sum, w) => sum + (w.totalDuration || 0), 0) / second7Days.length;
            
            trends.volume = avgRecent > avgPrevious ? 'up' : 
                           avgRecent < avgPrevious ? 'down' : 'stable';
            trends.volumeChange = Math.abs(avgRecent - avgPrevious).toFixed(0);
        }

        return trends;
    };

    const calculateNutritionAdherence = () => {
        if (!analyticsData.nutrition.length) return 0;
        const completedMeals = analyticsData.nutrition.filter(meal => meal.status === 'completed');
        return Math.round((completedMeals.length / analyticsData.nutrition.length) * 100);
    };

    const calculateAvgRecoveryDuration = () => {
        if (!analyticsData.recovery.length) return 0;
        const totalDuration = analyticsData.recovery.reduce((sum, session) => sum + (session.duration || 0), 0);
        return Math.round(totalDuration / analyticsData.recovery.length);
    };

    // ========== CHART OPTIONS ==========
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                beginAtZero: false
            },
            y1: {
                type: 'linear',
                display: selectedMetric === 'all',
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Caricamento analytics avanzati...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="advanced-analytics">
            <div className="analytics-header">
                <h2>📊 Analytics Avanzati</h2>
                <div className="analytics-controls">
                    <select 
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="period-selector"
                    >
                        <option value="1month">Ultimo Mese</option>
                        <option value="3months">Ultimi 3 Mesi</option>
                        <option value="6months">Ultimi 6 Mesi</option>
                        <option value="1year">Ultimo Anno</option>
                    </select>
                    
                    <select 
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="metric-selector"
                    >
                        <option value="weight">Solo Peso</option>
                        <option value="muscle">Solo Massa Muscolare</option>
                        <option value="fat">Solo Massa Grassa</option>
                        <option value="all">Tutti i Parametri</option>
                    </select>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">🏋️</div>
                    <div className="stat-content">
                        <h3>{computedStats.totalWorkouts}</h3>
                        <p>Workout Completati</p>
                        {computedStats.trends.volume && (
                            <span className={`trend ${computedStats.trends.volume}`}>
                                {computedStats.trends.volume === 'up' ? '↗️' : 
                                 computedStats.trends.volume === 'down' ? '↘️' : '➡️'}
                                {computedStats.trends.volumeChange}min/avg
                            </span>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <h3>{Math.round(computedStats.totalDuration / 60)}h</h3>
                        <p>Tempo Totale</p>
                        <span className="sub-stat">
                            Avg: {computedStats.averageWorkoutDuration}min
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-content">
                        <h3>{computedStats.currentStreak}</h3>
                        <p>Giorni Consecutivi</p>
                        <span className="streak-indicator">
                            {computedStats.currentStreak >= 7 ? '🏆 Ottimo!' : 
                             computedStats.currentStreak >= 3 ? '💪 Bene!' : '🎯 Continua!'}
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>{computedStats.progressEntries}</h3>
                        <p>Misurazioni</p>
                        {computedStats.trends.weight && (
                            <span className={`trend ${computedStats.trends.weight}`}>
                                {computedStats.trends.weight === 'up' ? '↗️' : 
                                 computedStats.trends.weight === 'down' ? '↘️' : '➡️'}
                                {computedStats.trends.weightChange}kg
                            </span>
                        )}
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🥗</div>
                    <div className="stat-content">
                        <h3>{computedStats.nutritionAdherence}%</h3>
                        <p>Aderenza Dieta</p>
                        <span className="sub-stat">
                            {analyticsData.nutrition.filter(m => m.status === 'completed').length} pasti completati
                        </span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛁</div>
                    <div className="stat-content">
                        <h3>{computedStats.recoverySessionsTotal}</h3>
                        <p>Sessioni Recovery</p>
                        <span className="sub-stat">
                            Avg: {computedStats.avgRecoveryDuration}min
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Progress Chart */}
                {progressChartData && (
                    <div className="chart-container">
                        <h3>📈 Progressi Fisici</h3>
                        <div className="chart-wrapper">
                            <Line data={progressChartData} options={chartOptions} />
                        </div>
                    </div>
                )}

                {/* Workout Volume Chart */}
                {workoutVolumeData && (
                    <div className="chart-container">
                        <h3>💪 Volume Allenamenti (30 giorni)</h3>
                        <div className="chart-wrapper">
                            <Bar data={workoutVolumeData} options={{
                                ...chartOptions,
                                scales: {
                                    ...chartOptions.scales,
                                    y: { ...chartOptions.scales.y, beginAtZero: true }
                                }
                            }} />
                        </div>
                    </div>
                )}

                {/* Exercise Distribution */}
                {exerciseDistributionData && (
                    <div className="chart-container">
                        <h3>🎯 Distribuzione Esercizi</h3>
                        <div className="chart-wrapper">
                            <Doughnut 
                                data={exerciseDistributionData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                boxWidth: 12,
                                                padding: 10
                                            }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                )}

                {/* Nutrition Adherence Chart */}
                {nutritionAdherenceData && (
                    <div className="chart-container">
                        <h3>🥗 Aderenza Dieta & Proteine (30 giorni)</h3>
                        <div className="chart-wrapper">
                            <Line data={nutritionAdherenceData} options={{
                                ...chartOptions,
                                scales: {
                                    x: chartOptions.scales.x,
                                    y: {
                                        ...chartOptions.scales.y,
                                        beginAtZero: true,
                                        max: 100,
                                        title: {
                                            display: true,
                                            text: 'Aderenza (%)'
                                        }
                                    },
                                    y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Proteine (g)'
                                        },
                                        grid: {
                                            drawOnChartArea: false,
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                )}

                {/* Recovery Distribution */}
                {recoveryDistributionData && (
                    <div className="chart-container">
                        <h3>🛁 Distribuzione Pratiche Recovery</h3>
                        <div className="chart-wrapper">
                            <Doughnut 
                                data={recoveryDistributionData} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                boxWidth: 12,
                                                padding: 15
                                            }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                )}

                {/* Weekly Recovery Trends */}
                {weeklyRecoveryData && (
                    <div className="chart-container">
                        <h3>📊 Tendenze Recovery Settimanali</h3>
                        <div className="chart-wrapper">
                            <Bar data={weeklyRecoveryData} options={{
                                ...chartOptions,
                                scales: {
                                    x: chartOptions.scales.x,
                                    y: {
                                        ...chartOptions.scales.y,
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Sessioni'
                                        }
                                    },
                                    y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Durata (min)'
                                        },
                                        grid: {
                                            drawOnChartArea: false,
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Insights Section */}
            <div className="insights-section">
                <h3>💡 Insights Automatici</h3>
                <div className="insights-grid">
                    {generateInsights(computedStats, analyticsData).map((insight, index) => (
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
        </div>
    );
};

// Generazione insights automatici
const generateInsights = (stats, data) => {
    const insights = [];

    // Insight consistenza
    if (stats.currentStreak >= 7) {
        insights.push({
            type: 'success',
            icon: '🔥',
            title: 'Ottima Consistenza!',
            message: `${stats.currentStreak} giorni consecutivi di allenamento. Continua così!`
        });
    } else if (stats.totalWorkouts === 0) {
        insights.push({
            type: 'warning',
            icon: '🎯',
            title: 'Inizia il Tuo Percorso',
            message: 'È ora di registrare il tuo primo workout!'
        });
    }

    // Insight volume
    if (stats.averageWorkoutDuration < 30) {
        insights.push({
            type: 'info',
            icon: '⏰',
            title: 'Intensità Workout',
            message: 'Considera di aumentare la durata media degli allenamenti (30+ min).'
        });
    } else if (stats.averageWorkoutDuration > 90) {
        insights.push({
            type: 'warning',
            icon: '🚨',
            title: 'Workout Lunghi',
            message: 'Allenamenti molto lunghi: assicurati di mantenere l\'intensità.'
        });
    }

    // Insight varietà esercizi
    if (stats.uniqueExercises < 10 && stats.totalExercises > 20) {
        insights.push({
            type: 'info',
            icon: '🔄',
            title: 'Varietà Esercizi',
            message: 'Prova ad aggiungere più varietà ai tuoi allenamenti.'
        });
    }

    // Insight nutrition
    if (stats.nutritionAdherence >= 80) {
        insights.push({
            type: 'success',
            icon: '🥗',
            title: 'Ottima Aderenza Dieta!',
            message: `${stats.nutritionAdherence}% di aderenza alla dieta. Eccellente disciplina!`
        });
    } else if (stats.nutritionAdherence < 60) {
        insights.push({
            type: 'warning',
            icon: '🎯',
            title: 'Migliora l\'Aderenza',
            message: 'Prova a seguire più costantemente il piano alimentare per risultati ottimali.'
        });
    }

    // Insight recovery
    if (stats.recoverySessionsTotal >= 10) {
        insights.push({
            type: 'success',
            icon: '🛁',
            title: 'Ottimo Recovery!',
            message: `${stats.recoverySessionsTotal} sessioni di recupero. Il riposo è fondamentale!`
        });
    } else if (stats.recoverySessionsTotal === 0 && stats.totalWorkouts > 5) {
        insights.push({
            type: 'info',
            icon: '🧘',
            title: 'Aggiungi Recovery',
            message: 'Considera di integrare pratiche di recupero per migliorare le performance.'
        });
    }

    // Insight progressi
    if (data.progress.length >= 3) {
        const recent = data.progress.slice(0, 3);
        const weights = recent.map(p => p.weight).filter(w => w);
        if (weights.length >= 2) {
            const trend = weights[0] - weights[weights.length - 1];
            if (Math.abs(trend) < 0.5) {
                insights.push({
                    type: 'info',
                    icon: '⚖️',
                    title: 'Peso Stabile',
                    message: 'Il tuo peso è rimasto stabile. Ottimo per la ricomposizione corporea!'
                });
            }
        }
    }

    return insights.slice(0, 4); // Max 4 insights
};

export default AdvancedAnalytics;