import React from 'react';
import { Link } from 'react-router-dom';
import MotivationalQuotes from './MotivationalQuotes';
import CalendarStreak from './CalendarStreak';
import ExerciseTracker from './ExerciseTracker';
import SupplementStack from './SupplementStack';
import RecoveryProtocol from './RecoveryProtocol';

const Dashboard = () => {
    const quotesHook = MotivationalQuotes();
    const calendarHook = CalendarStreak();
    const exerciseHook = ExerciseTracker();
    const supplementsHook = SupplementStack();
    const recoveryHook = RecoveryProtocol();
    
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
    
    const [todayWorkout, setTodayWorkout] = React.useState(null);
    const [goals12Week, setGoals12Week] = React.useState({
        startWeight: 75,
        targetWeight: 80,
        targetBench: 100,
        targetSquat: 140,
        targetDeadlift: 160,
        startDate: new Date(),
        weeksCompleted: 0
    });
    
    const getTodayWorkout = () => {
        const workoutPlan = {
            1: { name: 'Petto + Bicipiti', exercises: 7, focus: 'Upper Power' },
            2: { name: 'Dorso + Tricipiti + Collo (A)', exercises: 10, focus: 'Pull Strength' },
            3: { name: 'Gambe Complete', exercises: 7, focus: 'Lower Power' },
            4: { name: 'Recupero Attivo', exercises: 3, focus: 'Recovery' },
            5: { name: 'Spalle Complete + Collo (B)', exercises: 13, focus: 'Delts 3D' },
            6: { name: 'Posteriori + Conditioning', exercises: 7, focus: 'Athletic' },
            0: { name: 'Riposo Completo', exercises: 4, focus: 'Rest' }
        };
        
        const today = new Date().getDay();
        return workoutPlan[today];
    };
    
    const loadDashboardData = () => {
        const progressData = JSON.parse(localStorage.getItem('progressData') || '[]');
        const timeStats = JSON.parse(localStorage.getItem('timeStats') || '{}');
        const workoutSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
        const goals = JSON.parse(localStorage.getItem('goals12Week') || '{}');
        
        const latestProgress = progressData[0];
        const firstProgress = progressData[progressData.length - 1];
        
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentSessions = workoutSessions.filter(session => 
            new Date(session.date) >= oneWeekAgo
        );
        
        setDashboardData({
            currentWeight: latestProgress?.weight || goals.startWeight || 75,
            muscleGain: latestProgress && firstProgress ? 
                (parseFloat(latestProgress.muscleMass) - parseFloat(firstProgress.muscleMass)) : 0,
            workoutSessions: workoutSessions.length,
            totalWorkoutTime: timeStats.totalWorkoutTime || 0,
            weeklyTime: timeStats.weeklyTime || 0,
            daysActive: new Set(workoutSessions.map(s => s.date.split('T')[0])).size,
            lastWorkout: workoutSessions[0]?.date || null,
            currentStreak: calendarHook.calculateCurrentStreak()
        });
        
        setTodayWorkout(getTodayWorkout());
        
        if (goals.startDate) {
            const weeksCompleted = Math.floor((today - new Date(goals.startDate)) / (7 * 24 * 60 * 60 * 1000));
            setGoals12Week({...goals, weeksCompleted});
        }
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
    
    const todayQuote = quotesHook.getTodayQuote();
    const todayProgress = exerciseHook.getTodayProgress(todayWorkout?.exercises);
    const supplementProgress = supplementsHook.getSupplementProgress();
    const weeklyStats = exerciseHook.getWeeklyStats();
    const recoveryStats = recoveryHook.getRecoveryStats();
    
    React.useEffect(() => {
        loadDashboardData();
    }, []);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>🏆 FISICO DELLA MADONNA</h1>
                <p className="tagline">"L'eccellenza non è un atto, ma un'abitudine" - Aristotele</p>
            </header>

            {/* MOTIVATIONAL QUOTE OF THE DAY */}
            <div className="daily-motivation">
                <div className="quote-card">
                    <h3>💭 Frase del Giorno</h3>
                    <blockquote>
                        "{todayQuote.quote}"
                        <footer>— {todayQuote.author}</footer>
                    </blockquote>
                    <p className="quote-context">{todayQuote.context}</p>
                </div>
            </div>

            {/* TODAY'S WORKOUT PREVIEW */}
            <div className="today-workout-preview">
                <h3>🎯 Oggi: {todayWorkout?.name}</h3>
                <div className="workout-quick-stats">
                    <span className="workout-focus">{todayWorkout?.focus}</span>
                    <span className="workout-exercises">{todayWorkout?.exercises} esercizi</span>
                    <span className={`workout-progress ${todayProgress.percentage === 100 ? 'completed' : ''}`}>
                        {todayProgress.completed}/{todayProgress.total} completati ({todayProgress.percentage}%)
                    </span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{width: `${todayProgress.percentage}%`}}
                    ></div>
                </div>
                <Link to="/workout" className="start-workout-btn">
                    {todayProgress.percentage === 0 ? '🚀 INIZIA WORKOUT' : 
                     todayProgress.percentage === 100 ? '✅ COMPLETATO' : 
                     '▶️ CONTINUA WORKOUT'}
                </Link>
            </div>

            {/* STREAK CALENDAR */}
            <div className="streak-calendar-mini">
                <h3>📅 Calendario Streak</h3>
                <div className="calendar-grid">
                    {calendarHook.getDaysInMonth(calendarHook.currentDate).slice(-7).map((day, index) => (
                        <div key={index} className={`calendar-day-mini ${
                            day?.isCompleted ? 'completed' : day?.isToday ? 'today' : ''
                        }`}>
                            <span className="day-number">{day?.day || ''}</span>
                            {day?.isCompleted && <span className="workout-emoji">{calendarHook.getWorkoutTypeEmoji(day.workoutType)}</span>}
                        </div>
                    ))}
                </div>
                <div className="streak-stats">
                    <span className="current-streak" style={{color: calendarHook.getStreakColor(dashboardData.currentStreak)}}>
                        🔥 {dashboardData.currentStreak} giorni
                    </span>
                    <span className="monthly-total">
                        📊 {calendarHook.monthlyStats.monthlyWorkouts || 0} questo mese
                    </span>
                </div>
            </div>

            {/* PERFORMANCE DASHBOARD */}
            <div className="performance-dashboard">
                <h3>⚡ Performance Overview</h3>
                <div className="perf-grid">
                    <div className="perf-card strength">
                        <h4>💪 Forza</h4>
                        <p className="perf-value">{weeklyStats.totalVolume || 0}kg</p>
                        <p className="perf-label">Volume Settimanale</p>
                    </div>
                    <div className="perf-card volume">
                        <h4>🏋️ Volume</h4>
                        <p className="perf-value">{weeklyStats.totalSets || 0}</p>
                        <p className="perf-label">Serie Settimanali</p>
                    </div>
                    <div className="perf-card consistency">
                        <h4>🎯 Consistenza</h4>
                        <p className="perf-value">{Math.round(((dashboardData.currentStreak / 30) * 100))}%</p>
                        <p className="perf-label">Streak Rate</p>
                    </div>
                    <div className="perf-card supplements">
                        <h4>💊 Stack</h4>
                        <p className="perf-value">{supplementProgress.percentage}%</p>
                        <p className="perf-label">Integratori Oggi</p>
                    </div>
                </div>
            </div>

            {/* 12-WEEK GOALS PROGRESS */}
            <div className="goals-progress">
                <h3>🎯 Obiettivi 12 Settimane</h3>
                <div className="goals-grid">
                    <div className="goal-item">
                        <h4>Peso Target</h4>
                        <div className="goal-bar">
                            <div className="goal-progress" style={{
                                width: `${Math.min(100, ((dashboardData.currentWeight - goals12Week.startWeight) / (goals12Week.targetWeight - goals12Week.startWeight)) * 100)}%`
                            }}></div>
                        </div>
                        <p>{dashboardData.currentWeight}kg → {goals12Week.targetWeight}kg</p>
                    </div>
                    <div className="goal-item">
                        <h4>Settimane</h4>
                        <div className="goal-bar">
                            <div className="goal-progress" style={{
                                width: `${Math.min(100, (goals12Week.weeksCompleted / 12) * 100)}%`
                            }}></div>
                        </div>
                        <p>{goals12Week.weeksCompleted}/12 settimane</p>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <nav className="quick-actions">
                <Link to="/workout" className="action-card workout">
                    <span className="action-icon">🏋️</span>
                    <h4>Workout</h4>
                    <p>Inizia sessione</p>
                </Link>
                <Link to="/progress" className="action-card progress">
                    <span className="action-icon">📈</span>
                    <h4>Progressi</h4>
                    <p>Traccia misure</p>
                </Link>
                <Link to="/nutrition-tracker" className="action-card nutrition">
                    <span className="action-icon">🥗</span>
                    <h4>Dieta</h4>
                    <p>Finestra 8-16</p>
                </Link>
                <Link to="/recovery-timer" className="action-card recovery-timer">
                    <span className="action-icon">🔥</span>
                    <h4>Recovery</h4>
                    <p>Timer sauna/ice</p>
                </Link>
                <Link to="/supplements" className="action-card supplements">
                    <span className="action-icon">💊</span>
                    <h4>Integratori</h4>
                    <p>{supplementProgress.taken}/{supplementProgress.total} presi</p>
                </Link>
                <Link to="/recovery" className="action-card recovery">
                    <span className="action-icon">🧘</span>
                    <h4>Recovery Info</h4>
                    <p>{recoveryStats.totalTime || 0}min oggi</p>
                </Link>
                <Link to="/analytics" className="action-card analytics">
                    <span className="action-icon">📊</span>
                    <h4>Analytics</h4>
                    <p>Grafici avanzati</p>
                </Link>
            </nav>

            {/* LEGEND MINDSET */}
            <div className="legend-mindset">
                <h3>👑 Mentalità da Leggenda</h3>
                <p className="mindset-text">
                    "I campioni non nascono in palestra. I campioni nascono da qualcosa di più profondo: 
                    <strong>un desiderio, un sogno, una visione.</strong> Tu hai tutto questo. 
                    Oggi è il giorno per dimostrarlo."
                </p>
                <div className="power-stats">
                    <span>💀 Disciplina: {Math.min(100, dashboardData.currentStreak * 3)}%</span>
                    <span>⚡ Intensità: {Math.min(100, (weeklyStats.sessions || 0) * 20)}%</span>
                    <span>🔥 Dedizione: {Math.min(100, (goals12Week.weeksCompleted || 0) * 8)}%</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;