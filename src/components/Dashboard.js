import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = React.useState({
        currentWeight: 0,
        muscleGain: 0,
        workoutSessions: 0,
        totalWorkoutTime: 0,
        weeklyTime: 0,
        daysActive: 0,
        lastWorkout: null,
        currentStreak: 0
    });
    
    const loadDashboardData = () => {
        const progressData = JSON.parse(localStorage.getItem('progressData') || '[]');
        const timeStats = JSON.parse(localStorage.getItem('timeStats') || '{}');
        const workoutSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
        
        const latestProgress = progressData[0];
        const firstProgress = progressData[progressData.length - 1];
        
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentSessions = workoutSessions.filter(session => 
            new Date(session.date) >= oneWeekAgo
        );
        
        setDashboardData({
            currentWeight: latestProgress?.weight || 0,
            muscleGain: latestProgress && firstProgress ? 
                (parseFloat(latestProgress.muscleMass) - parseFloat(firstProgress.muscleMass)) : 0,
            workoutSessions: workoutSessions.length,
            totalWorkoutTime: timeStats.totalWorkoutTime || 0,
            weeklyTime: timeStats.weeklyTime || 0,
            daysActive: new Set(workoutSessions.map(s => s.date.split('T')[0])).size,
            lastWorkout: workoutSessions[0]?.date || null,
            currentStreak: calculateStreak(workoutSessions)
        });
    };
    
    const calculateStreak = (sessions) => {
        if (sessions.length === 0) return 0;
        
        const today = new Date();
        let streak = 0;
        const sortedDates = [...new Set(sessions.map(s => s.date.split('T')[0]))].sort().reverse();
        
        for (let i = 0; i < sortedDates.length; i++) {
            const sessionDate = new Date(sortedDates[i]);
            const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= i + 1) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    };
    
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };
    
    React.useEffect(() => {
        loadDashboardData();
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>💪 Fisico della Madonna - Dashboard</h1>
                <p>Benvenuto nel tuo percorso di crescita straordinaria!</p>
            </header>
            
            <nav className="quick-nav">
                <Link to="/workout" className="nav-card">
                    <h3>🏋️ Workout</h3>
                    <p>Inizia allenamento</p>
                </Link>
                <Link to="/progress" className="nav-card">
                    <h3>📈 Progressi</h3>
                    <p>Traccia misurazioni</p>
                </Link>
                <Link to="/nutrition" className="nav-card">
                    <h3>🍽️ Nutrizione</h3>
                    <p>Piano alimentare</p>
                </Link>
                <Link to="/recovery" className="nav-card">
                    <h3>😴 Recovery</h3>
                    <p>Riposo e recupero</p>
                </Link>
            </nav>
            
            <div className="stats-overview">
                <h2>🎯 I Tuoi Progressi</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>⚖️ Peso Attuale</h3>
                        <p className="stat-value">{dashboardData.currentWeight || '--'} kg</p>
                    </div>
                    <div className="stat-card">
                        <h3>💪 Guadagno Muscolare</h3>
                        <p className="stat-value">+{dashboardData.muscleGain.toFixed(1)} kg</p>
                    </div>
                    <div className="stat-card">
                        <h3>🏋️ Sessioni Completate</h3>
                        <p className="stat-value">{dashboardData.workoutSessions}</p>
                    </div>
                    <div className="stat-card">
                        <h3>⏱️ Tempo Totale</h3>
                        <p className="stat-value">{formatTime(dashboardData.totalWorkoutTime)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>📅 Giorni Attivi</h3>
                        <p className="stat-value">{dashboardData.daysActive}</p>
                    </div>
                    <div className="stat-card">
                        <h3>🔥 Streak Attuale</h3>
                        <p className="stat-value">{dashboardData.currentStreak} giorni</p>
                    </div>
                    <div className="stat-card">
                        <h3>📊 Tempo Settimanale</h3>
                        <p className="stat-value">{formatTime(dashboardData.weeklyTime)}</p>
                    </div>
                    <div className="stat-card">
                        <h3>🕒 Ultimo Workout</h3>
                        <p className="stat-value">
                            {dashboardData.lastWorkout ? 
                                new Date(dashboardData.lastWorkout).toLocaleDateString('it-IT') : 
                                'Mai'
                            }
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="motivation">
                <h2>🔥 Mantieni il Fuoco Acceso!</h2>
                <p>La crescita straordinaria richiede dedizione e consistenza. Ogni giorno è un'opportunità per diventare la versione migliore di te stesso.</p>
                {dashboardData.currentStreak > 0 && (
                    <p className="streak-motivation">
                        🎆 Fantastico! Hai un streak di {dashboardData.currentStreak} giorni. Continua così!
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;