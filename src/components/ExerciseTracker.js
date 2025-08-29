import React from 'react';

const ExerciseTracker = () => {
    const [exerciseData, setExerciseData] = React.useState({});
    const [sessionProgress, setSessionProgress] = React.useState({});
    const [personalRecords, setPersonalRecords] = React.useState({});

    const loadExerciseData = () => {
        const saved = localStorage.getItem('exerciseData');
        if (saved) {
            setExerciseData(JSON.parse(saved));
        }
        
        const savedPR = localStorage.getItem('personalRecords');
        if (savedPR) {
            setPersonalRecords(JSON.parse(savedPR));
        }
    };

    const saveExerciseData = (data) => {
        localStorage.setItem('exerciseData', JSON.stringify(data));
        setExerciseData(data);
    };

    const savePersonalRecords = (data) => {
        localStorage.setItem('personalRecords', JSON.stringify(data));
        setPersonalRecords(data);
    };

    const markExerciseCompleted = (exerciseName, sets, reps, weight, notes = '', rir = null) => {
        const today = new Date().toISOString().split('T')[0];
        const exerciseId = `${exerciseName}_${today}`;
        
        const exerciseEntry = {
            id: exerciseId,
            exerciseName,
            date: today,
            sets: parseInt(sets),
            reps: parseInt(reps),
            weight: parseFloat(weight),
            notes,
            rir,
            timestamp: new Date().toISOString(),
            completed: true
        };

        const updated = {
            ...exerciseData,
            [exerciseId]: exerciseEntry
        };
        
        saveExerciseData(updated);
        
        // Aggiorna record personali se necessario
        updatePersonalRecord(exerciseName, weight, reps);
        
        // Aggiorna progresso sessione
        updateSessionProgress(exerciseName);
        
        return exerciseEntry;
    };

    const updatePersonalRecord = (exerciseName, weight, reps) => {
        const oneRepMax = calculateOneRepMax(weight, reps);
        const currentPR = personalRecords[exerciseName] || { weight: 0, reps: 0, oneRepMax: 0, date: null };
        
        if (oneRepMax > currentPR.oneRepMax || 
            (weight > currentPR.weight && reps >= currentPR.reps)) {
            
            const updatedPR = {
                ...personalRecords,
                [exerciseName]: {
                    weight: parseFloat(weight),
                    reps: parseInt(reps),
                    oneRepMax,
                    date: new Date().toISOString(),
                    previousRecord: currentPR.oneRepMax
                }
            };
            
            savePersonalRecords(updatedPR);
            
            // Notifica nuovo record
            return true;
        }
        
        return false;
    };

    const calculateOneRepMax = (weight, reps) => {
        // Formula Epley: 1RM = w * (1 + r/30)
        return Math.round(weight * (1 + reps / 30));
    };

    const updateSessionProgress = (exerciseName) => {
        const today = new Date().toISOString().split('T')[0];
        const todayExercises = Object.values(exerciseData).filter(ex => 
            ex.date === today && ex.completed
        );
        
        setSessionProgress(prev => ({
            ...prev,
            [exerciseName]: true,
            totalCompleted: todayExercises.length + 1
        }));
    };

    const getExerciseHistory = (exerciseName, limit = 10) => {
        return Object.values(exerciseData)
            .filter(ex => ex.exerciseName === exerciseName)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    };

    const getTodayProgress = (workoutExercises) => {
        const today = new Date().toISOString().split('T')[0];
        const completedToday = Object.values(exerciseData).filter(ex => 
            ex.date === today && ex.completed
        );
        
        const completed = completedToday.length;
        const total = workoutExercises ? workoutExercises.length : 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
            completed,
            total,
            percentage,
            remaining: Math.max(0, total - completed)
        };
    };

    const getWeeklyStats = () => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklyExercises = Object.values(exerciseData).filter(ex => 
            new Date(ex.date) >= oneWeekAgo && ex.completed
        );
        
        const totalSets = weeklyExercises.reduce((sum, ex) => sum + ex.sets, 0);
        const totalReps = weeklyExercises.reduce((sum, ex) => sum + (ex.sets * ex.reps), 0);
        const totalVolume = weeklyExercises.reduce((sum, ex) => sum + (ex.weight * ex.sets * ex.reps), 0);
        const uniqueExercises = new Set(weeklyExercises.map(ex => ex.exerciseName)).size;
        
        return {
            sessions: weeklyExercises.length,
            totalSets,
            totalReps,
            totalVolume: Math.round(totalVolume),
            uniqueExercises,
            averageWeight: weeklyExercises.length > 0 ? 
                Math.round(weeklyExercises.reduce((sum, ex) => sum + ex.weight, 0) / weeklyExercises.length) : 0
        };
    };

    const getMonthlyProgress = () => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const monthlyExercises = Object.values(exerciseData).filter(ex => 
            new Date(ex.date) >= oneMonthAgo && ex.completed
        );
        
        const workoutDays = new Set(monthlyExercises.map(ex => ex.date)).size;
        const totalVolume = monthlyExercises.reduce((sum, ex) => 
            sum + (ex.weight * ex.sets * ex.reps), 0
        );
        
        return {
            workoutDays,
            totalExercises: monthlyExercises.length,
            totalVolume: Math.round(totalVolume),
            averageVolume: workoutDays > 0 ? Math.round(totalVolume / workoutDays) : 0
        };
    };

    const isExerciseCompletedToday = (exerciseName) => {
        const today = new Date().toISOString().split('T')[0];
        return Object.values(exerciseData).some(ex => 
            ex.exerciseName === exerciseName && 
            ex.date === today && 
            ex.completed
        );
    };

    const getExerciseProgressColor = (exerciseName) => {
        if (isExerciseCompletedToday(exerciseName)) {
            return '#00ff88'; // Verde completato
        }
        
        const history = getExerciseHistory(exerciseName, 3);
        if (history.length === 0) {
            return '#ffffff'; // Bianco nuovo esercizio
        }
        
        // Analisi progressione
        const lastWeight = history[0]?.weight || 0;
        const avgWeight = history.reduce((sum, ex) => sum + ex.weight, 0) / history.length;
        
        if (lastWeight > avgWeight * 1.05) {
            return '#ff9500'; // Arancione in progressione
        } else if (lastWeight < avgWeight * 0.95) {
            return '#ff006e'; // Rosa in calo
        }
        
        return '#00ffff'; // Cyan stabile
    };

    React.useEffect(() => {
        loadExerciseData();
    }, []);

    return {
        exerciseData,
        sessionProgress,
        personalRecords,
        markExerciseCompleted,
        getExerciseHistory,
        getTodayProgress,
        getWeeklyStats,
        getMonthlyProgress,
        isExerciseCompletedToday,
        getExerciseProgressColor,
        updatePersonalRecord,
        calculateOneRepMax
    };
};

export default ExerciseTracker;