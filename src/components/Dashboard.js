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
    
    // FUNZIONI PER IL CALENDARIO COMPLETO
    const generateFullCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const calendar = [];
        
        // Giorni vuoti all'inizio
        for (let i = 0; i < startingDay; i++) {
            calendar.push(null);
        }
        
        // Giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(day);
        }
        
        return calendar;
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate();
    };

    const isDayCompleted = (day) => {
        if (!day) return false;
        // Simula giorni completati basati su workout sessions
        const completedWorkouts = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
        const date = new Date();
        date.setDate(day);
        const dayString = date.toDateString();
        
        return completedWorkouts.some(workout => 
            new Date(workout.date).toDateString() === dayString
        );
    };
    
    const getNutritionStreak = () => {
        const saved = localStorage.getItem('nutritionStreak');
        return saved ? parseInt(saved) : 0;
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

            {/* CALENDARIO COMPLETO CON STREAK */}
            <div style={{
                background: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
                borderRadius: '20px',
                padding: '30px',
                margin: '30px 0',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                    <h2 style={{ 
                        fontSize: '1.8rem',
                        color: '#ff9500',
                        margin: 0
                    }}>
                        📅 {new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </h2>
                    
                    {/* STREAK COUNTER PROMINENTE */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 100%)',
                        padding: '20px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        boxShadow: '0 5px 15px rgba(255, 149, 0, 0.3)',
                        minWidth: '120px'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔥</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px', color: 'white' }}>
                            {Math.max(dashboardData.currentStreak, getNutritionStreak())}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'white', opacity: 0.9 }}>STREAK</div>
                    </div>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    {['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'].map(day => (
                        <div key={day} style={{
                            padding: '10px',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#ff9500',
                            fontSize: '0.9rem'
                        }}>
                            {day}
                        </div>
                    ))}
                    
                    {generateFullCalendar().map((day, index) => (
                        <div key={index} style={{
                            padding: '12px',
                            textAlign: 'center',
                            borderRadius: '10px',
                            cursor: day ? 'pointer' : 'default',
                            background: day ? (
                                isToday(day) ? '#ff9500' :
                                isDayCompleted(day) ? '#22c55e' : 
                                'rgba(255, 255, 255, 0.05)'
                            ) : 'transparent',
                            color: day ? (
                                isToday(day) || isDayCompleted(day) ? 'white' : '#ccc'
                            ) : 'transparent',
                            fontWeight: isToday(day) ? 'bold' : 'normal',
                            border: isToday(day) ? '2px solid white' : '1px solid transparent',
                            transform: isToday(day) ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.3s ease',
                            fontSize: '0.9rem'
                        }}>
                            {day}
                            {isDayCompleted(day) && !isToday(day) && (
                                <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>✅</div>
                            )}
                            {isToday(day) && (
                                <div style={{ fontSize: '0.6rem', marginTop: '2px' }}>OGGI</div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'rgba(255, 149, 0, 0.1)',
                    padding: '15px 20px',
                    borderRadius: '15px'
                }}>
                    <div style={{ color: '#aaa', fontSize: '0.9rem' }}>
                        🟠 Oggi • 🟢 Giorno completato • ⚪ Da completare
                    </div>
                    <div style={{ color: '#ff9500', fontWeight: 'bold' }}>
                        📊 {calendarHook.monthlyStats?.monthlyWorkouts || 0} workout questo mese
                    </div>
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
                <Link to="/measurements" className="action-card measurements">
                    <span className="action-icon">📏</span>
                    <h4>Misurazioni</h4>
                    <p>Peso & corpo</p>
                </Link>
                <Link to="/nutrition" className="action-card nutrition">
                    <span className="action-icon">🥗</span>
                    <h4>Dieta</h4>
                    <p>Piano settimanale</p>
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