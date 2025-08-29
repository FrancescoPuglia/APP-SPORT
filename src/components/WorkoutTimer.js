import React from 'react';

const WorkoutTimer = ({ onSessionComplete }) => {
    const [isActive, setIsActive] = React.useState(false);
    const [currentExercise, setCurrentExercise] = React.useState('');
    const [sessionTime, setSessionTime] = React.useState(0);
    const [exerciseTime, setExerciseTime] = React.useState(0);
    const [exercises, setExercises] = React.useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = React.useState(0);

    React.useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSessionTime(time => time + 1);
                setExerciseTime(time => time + 1);
            }, 1000);
        } else if (!isActive && sessionTime !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, sessionTime]);

    const startSession = () => {
        setIsActive(true);
        setSessionTime(0);
        setExercises([]);
    };

    const pauseSession = () => {
        setIsActive(false);
    };

    const nextExercise = () => {
        if (currentExercise && exerciseTime > 0) {
            const exerciseData = {
                name: currentExercise,
                duration: exerciseTime,
                timestamp: new Date().toISOString()
            };
            setExercises([...exercises, exerciseData]);
        }
        
        setCurrentExercise('');
        setExerciseTime(0);
        setCurrentExerciseIndex(prev => prev + 1);
    };

    const completeSession = () => {
        if (currentExercise && exerciseTime > 0) {
            nextExercise();
        }
        
        const sessionData = {
            date: new Date().toISOString(),
            duration: sessionTime,
            exercises: exercises,
            id: Date.now()
        };
        
        // Salva la sessione
        const savedSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
        const updatedSessions = [sessionData, ...savedSessions];
        localStorage.setItem('workoutSessions', JSON.stringify(updatedSessions));
        
        // Aggiorna le statistiche del tempo
        const timeStats = JSON.parse(localStorage.getItem('timeStats') || '{}');
        const updatedTimeStats = {
            totalWorkoutTime: (timeStats.totalWorkoutTime || 0) + Math.floor(sessionTime / 60),
            weeklyTime: calculateWeeklyTime(updatedSessions),
            monthlyTime: calculateMonthlyTime(updatedSessions),
            sessionsCompleted: (timeStats.sessionsCompleted || 0) + 1
        };
        localStorage.setItem('timeStats', JSON.stringify(updatedTimeStats));
        
        // Reset
        setIsActive(false);
        setSessionTime(0);
        setExerciseTime(0);
        setCurrentExercise('');
        setExercises([]);
        setCurrentExerciseIndex(0);
        
        if (onSessionComplete) {
            onSessionComplete(sessionData);
        }
    };

    const calculateWeeklyTime = (sessions) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return sessions
            .filter(session => new Date(session.date) >= oneWeekAgo)
            .reduce((total, session) => total + Math.floor(session.duration / 60), 0);
    };

    const calculateMonthlyTime = (sessions) => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return sessions
            .filter(session => new Date(session.date) >= oneMonthAgo)
            .reduce((total, session) => total + Math.floor(session.duration / 60), 0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="workout-timer">
            <div className="timer-header">
                <h3>⏱️ Timer Sessione</h3>
                <div className="session-time">
                    <span>Tempo Totale: {formatTime(sessionTime)}</span>
                </div>
            </div>

            <div className="current-exercise">
                <input
                    type="text"
                    placeholder="Nome esercizio attuale..."
                    value={currentExercise}
                    onChange={(e) => setCurrentExercise(e.target.value)}
                    disabled={!isActive}
                />
                <div className="exercise-time">
                    Tempo Esercizio: {formatTime(exerciseTime)}
                </div>
            </div>

            <div className="timer-controls">
                {!isActive && sessionTime === 0 ? (
                    <button className="button start-btn" onClick={startSession}>
                        🚀 Inizia Sessione
                    </button>
                ) : (
                    <div className="control-buttons">
                        <button 
                            className="button" 
                            onClick={isActive ? pauseSession : () => setIsActive(true)}
                        >
                            {isActive ? '⏸️ Pausa' : '▶️ Riprendi'}
                        </button>
                        <button 
                            className="button next-btn" 
                            onClick={nextExercise}
                            disabled={!currentExercise}
                        >
                            ➡️ Prossimo Esercizio
                        </button>
                        <button 
                            className="button complete-btn" 
                            onClick={completeSession}
                        >
                            ✅ Completa Sessione
                        </button>
                    </div>
                )}
            </div>

            {exercises.length > 0 && (
                <div className="completed-exercises">
                    <h4>Esercizi Completati:</h4>
                    <ul>
                        {exercises.map((exercise, index) => (
                            <li key={index}>
                                {exercise.name} - {formatTime(exercise.duration)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WorkoutTimer;