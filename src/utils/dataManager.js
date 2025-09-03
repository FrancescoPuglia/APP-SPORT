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
        const nutritionHistory = JSON.parse(localStorage.getItem('nutritionHistory') || '[]');
        const nutritionCheats = JSON.parse(localStorage.getItem('nutritionCheats') || '{}');
        
        // Calcola aderenza alla dieta basata sui pasti completati
        const today = new Date().toDateString();
        const last7Days = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayString = date.toDateString();
            
            // Conta pasti completati per ogni giorno (assumendo 4 pasti/giorno)
            const dayMeals = Object.keys(completedMeals).filter(key => 
                key.startsWith(dayString)
            ).length;
            
            last7Days.push({
                date: dayString,
                mealsCompleted: dayMeals,
                adherence: Math.min((dayMeals / 4) * 100, 100)
            });
        }

        // 🍕 CALCOLI SGARRI
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyCheats = Object.values(nutritionCheats).filter(cheat => 
            cheat.month === currentMonth && cheat.year === currentYear
        ).length;

        const totalCheats = Object.keys(nutritionCheats).length;
        const last30DaysCheats = Object.values(nutritionCheats).filter(cheat => {
            const cheatDate = new Date(cheat.timestamp);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return cheatDate >= thirtyDaysAgo;
        }).length;

        // 📊 CALCOLI AVANZATI PER ANALYTICS
        const totalMealsCompleted = nutritionHistory.filter(n => n.completed).length;
        const avgProteinsDaily = this.calculateAvgProteins(completedMeals);
        const avgCaloriesDaily = this.calculateAvgCalories(completedMeals);

        return {
            completedMeals,
            nutritionStreak,
            nutritionHistory,
            nutritionCheats,
            weeklyAdherence: last7Days,
            avgAdherence: last7Days.reduce((sum, day) => sum + day.adherence, 0) / 7,
            totalMealsCompleted,
            avgProteinsDaily,
            avgCaloriesDaily,
            lastMealTime: nutritionHistory[0]?.timestamp || null,
            monthlyCheats,
            totalCheats,
            last30DaysCheats,
            cheatFrequency: totalCheats > 0 ? (totalCheats / Math.max(1, nutritionHistory.length / 30)) : 0
        };
    }

    calculateAvgProteins(completedMeals) {
        // Stima proteine basata sui pasti completati (media 35g per pasto)
        const completedCount = Object.values(completedMeals).filter(Boolean).length;
        return Math.round((completedCount * 35) / 7); // Media settimanale
    }

    calculateAvgCalories(completedMeals) {
        // Stima calorie basata sui pasti completati (media 450 kcal per pasto)
        const completedCount = Object.values(completedMeals).filter(Boolean).length;
        return Math.round((completedCount * 450) / 7); // Media settimanale
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
        console.log(`🚨 CALCOLO STREAK - Input workouts:`, workouts.length);
        
        if (!workouts.length) {
            console.log(`❌ NESSUN WORKOUT TROVATO`);
            return 0;
        }
        
        // 🔥 FIX CRITICO: Usa solo la data (yyyy-mm-dd) ignorando orario
        const workoutDates = workouts.map(w => {
            const date = new Date(w.date);
            return date.toISOString().split('T')[0]; // yyyy-mm-dd
        });
        
        console.log(`📅 Date workout trovate:`, workoutDates);
        
        // Rimuovi duplicati e ordina
        const uniqueDates = [...new Set(workoutDates)].sort().reverse();
        console.log(`📅 Date uniche ordinate:`, uniqueDates);
        
        if (uniqueDates.length === 0) return 0;
        
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        console.log(`📅 Oggi: ${todayString}, Ieri: ${yesterdayString}`);
        
        let streak = 0;
        let checkDate = new Date(today);
        
        // 🚨 ALGORITMO SEMPLIFICATO E CORRETTO
        for (let i = 0; i < 365; i++) {
            const checkString = checkDate.toISOString().split('T')[0];
            
            if (uniqueDates.includes(checkString)) {
                streak++;
                console.log(`✅ Workout trovato per ${checkString}, streak: ${streak}`);
            } else {
                // Se è il primo giorno (oggi) e non ha workout, controlla ieri
                if (i === 0) {
                    console.log(`⚠️ Oggi ${checkString} nessun workout, controllo ieri...`);
                } else {
                    console.log(`❌ Nessun workout per ${checkString}, streak interrotto a: ${streak}`);
                    break;
                }
            }
            
            // Vai al giorno precedente
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        console.log(`🔥 STREAK FINALE: ${streak} giorni`);
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