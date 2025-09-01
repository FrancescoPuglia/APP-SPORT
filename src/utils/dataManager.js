// SISTEMA CENTRALE DI GESTIONE DATI REALI
// Tutti i dati dell'utente vengono salvati qui e utilizzati da Analytics

class DataManager {
    constructor() {
        this.storageKeys = {
            workouts: 'userData_workouts',
            measurements: 'userData_measurements', 
            nutrition: 'userData_nutrition',
            supplements: 'userData_supplements',
            recovery: 'userData_recovery'
        };
    }

    // ===== WORKOUT DATA =====
    saveWorkout(workoutData) {
        const workouts = this.getWorkouts();
        const newWorkout = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...workoutData
        };
        workouts.unshift(newWorkout);
        localStorage.setItem(this.storageKeys.workouts, JSON.stringify(workouts));
        return newWorkout;
    }

    getWorkouts() {
        const saved = localStorage.getItem(this.storageKeys.workouts);
        return saved ? JSON.parse(saved) : [];
    }

    // ===== MEASUREMENTS DATA =====
    saveMeasurement(measurementData) {
        const measurements = this.getMeasurements();
        const newMeasurement = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...measurementData
        };
        measurements.unshift(newMeasurement);
        localStorage.setItem(this.storageKeys.measurements, JSON.stringify(measurements));
        return newMeasurement;
    }

    getMeasurements() {
        const saved = localStorage.getItem(this.storageKeys.measurements);
        return saved ? JSON.parse(saved) : [];
    }

    // ===== NUTRITION DATA =====
    getNutritionData() {
        const completedMeals = JSON.parse(localStorage.getItem('completedMeals') || '{}');
        const nutritionStreak = parseInt(localStorage.getItem('nutritionStreak') || '0');
        
        // Calcola aderenza alla dieta basata sui pasti completati
        const today = new Date().toDateString();
        const last7Days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayString = date.toDateString();
            
            // Conta pasti completati per ogni giorno
            const dayMeals = Object.keys(completedMeals).filter(key => 
                key.startsWith(dayString)
            ).length;
            
            last7Days.push({
                date: dayString,
                mealsCompleted: dayMeals,
                adherence: Math.min((dayMeals / 4) * 100, 100) // Assumiamo 4 pasti al giorno
            });
        }

        return {
            completedMeals,
            nutritionStreak,
            weeklyAdherence: last7Days,
            avgAdherence: last7Days.reduce((sum, day) => sum + day.adherence, 0) / 7
        };
    }

    // ===== ANALYTICS DATA COMPILATION =====
    getAnalyticsData() {
        const workouts = this.getWorkouts();
        const measurements = this.getMeasurements();
        const nutrition = this.getNutritionData();
        const supplements = JSON.parse(localStorage.getItem('supplementsTaken') || '{}');
        const recovery = JSON.parse(localStorage.getItem('recoveryHistory') || '[]');

        return {
            workouts,
            measurements,
            nutrition,
            supplements,
            recovery,
            
            // Stats calcolate
            stats: {
                totalWorkouts: workouts.length,
                currentStreak: this.calculateWorkoutStreak(workouts),
                weightProgress: this.calculateWeightProgress(measurements),
                strengthProgress: this.calculateStrengthProgress(workouts),
                nutritionAdherence: nutrition.avgAdherence,
                supplementCompliance: this.calculateSupplementCompliance(supplements),
                recoveryFrequency: recovery.length
            }
        };
    }

    calculateWorkoutStreak(workouts) {
        if (!workouts.length) return 0;
        
        const today = new Date();
        let streak = 0;
        let currentDate = new Date(today);
        
        // Ordina workouts per data
        const sortedWorkouts = workouts
            .map(w => new Date(w.date))
            .sort((a, b) => b - a);

        for (let i = 0; i < 30; i++) { // Controlla ultimi 30 giorni
            const dayString = currentDate.toDateString();
            const hasWorkout = sortedWorkouts.some(date => 
                date.toDateString() === dayString
            );
            
            if (hasWorkout) {
                streak++;
            } else if (streak > 0) {
                break; // Fine streak
            }
            
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return streak;
    }

    calculateWeightProgress(measurements) {
        if (measurements.length < 2) return { change: 0, trend: 'stable' };
        
        const latest = measurements[0];
        const oldest = measurements[measurements.length - 1];
        
        const change = latest.weight - oldest.weight;
        const trend = change > 1 ? 'gaining' : change < -1 ? 'losing' : 'stable';
        
        return { change: change.toFixed(1), trend };
    }

    calculateStrengthProgress(workouts) {
        const exerciseProgress = {};
        
        workouts.forEach(workout => {
            if (workout.exercises) {
                workout.exercises.forEach(exercise => {
                    if (!exerciseProgress[exercise.name]) {
                        exerciseProgress[exercise.name] = [];
                    }
                    
                    exerciseProgress[exercise.name].push({
                        date: workout.date,
                        weight: exercise.weight,
                        reps: exercise.reps,
                        volume: exercise.weight * exercise.reps * exercise.sets
                    });
                });
            }
        });

        // Calcola progresso per ogni esercizio
        const progressSummary = {};
        Object.keys(exerciseProgress).forEach(exerciseName => {
            const sessions = exerciseProgress[exerciseName].sort((a, b) => 
                new Date(a.date) - new Date(b.date)
            );
            
            if (sessions.length >= 2) {
                const first = sessions[0];
                const last = sessions[sessions.length - 1];
                
                progressSummary[exerciseName] = {
                    initialWeight: first.weight,
                    currentWeight: last.weight,
                    improvement: ((last.weight - first.weight) / first.weight * 100).toFixed(1),
                    sessions: sessions.length
                };
            }
        });

        return progressSummary;
    }

    calculateSupplementCompliance(supplements) {
        const today = new Date().toDateString();
        const last7Days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayString = date.toDateString();
            
            const daySupplements = Object.keys(supplements).filter(key => 
                key.startsWith(dayString)
            ).length;
            
            last7Days.push(daySupplements);
        }
        
        const avgDaily = last7Days.reduce((sum, day) => sum + day, 0) / 7;
        return Math.round((avgDaily / 5) * 100); // Assumiamo 5 supplementi target
    }

    // ===== UTILITY METHODS =====
    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        
        // Pulisci anche altri storage
        localStorage.removeItem('completedMeals');
        localStorage.removeItem('nutritionStreak');
        localStorage.removeItem('supplementsTaken');
        localStorage.removeItem('recoveryHistory');
    }

    exportData() {
        return {
            workouts: this.getWorkouts(),
            measurements: this.getMeasurements(),
            nutrition: this.getNutritionData(),
            analytics: this.getAnalyticsData()
        };
    }
}

// Esporta istanza singleton
export const dataManager = new DataManager();
export default dataManager;