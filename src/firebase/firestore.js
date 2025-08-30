// Firestore Database Service - Enterprise Architecture
// Gestione dati fitness con pattern Repository e caching intelligente

import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    onSnapshot,
    serverTimestamp,
    increment,
    arrayUnion,
    arrayRemove,
    writeBatch,
    runTransaction
} from 'firebase/firestore';

import { db, logger } from './config';
import authService from './auth';

// Base Repository Class per operazioni CRUD standardizzate
class BaseRepository {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.collectionRef = collection(db, collectionName);
        this.cache = new Map(); // Cache locale per performance
        this.listeners = new Map(); // Gestione listener real-time
    }

    // Ottieni documento per ID
    async getById(id, useCache = true) {
        try {
            // Controlla cache prima
            if (useCache && this.cache.has(id)) {
                const cached = this.cache.get(id);
                // Cache valida per 5 minuti
                if (Date.now() - cached.timestamp < 5 * 60 * 1000) {
                    logger.info(`Cache hit per ${this.collectionName}/${id}`);
                    return { success: true, data: cached.data, fromCache: true };
                }
            }

            const docRef = doc(db, this.collectionName, id);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() };
                
                // Aggiorna cache
                if (useCache) {
                    this.cache.set(id, { data, timestamp: Date.now() });
                }
                
                return { success: true, data, fromCache: false };
            } else {
                return { success: false, error: 'Documento non trovato', data: null };
            }
            
        } catch (error) {
            logger.error(`Errore getById ${this.collectionName}`, error);
            return { success: false, error: error.message, data: null };
        }
    }

    // Crea nuovo documento
    async create(data, customId = null) {
        try {
            const userId = authService.getCurrentUser()?.uid;
            if (!userId) {
                throw new Error('Utente non autenticato');
            }

            const docData = {
                ...data,
                userId,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            let docRef;
            if (customId) {
                docRef = doc(db, this.collectionName, customId);
                await setDoc(docRef, docData);
            } else {
                docRef = await addDoc(this.collectionRef, docData);
            }

            const newId = customId || docRef.id;
            
            // Invalida cache
            this.invalidateCache();
            
            logger.success(`Documento creato in ${this.collectionName}`, { id: newId });
            return { success: true, id: newId, data: { id: newId, ...docData } };
            
        } catch (error) {
            logger.error(`Errore create ${this.collectionName}`, error);
            return { success: false, error: error.message, id: null };
        }
    }

    // Aggiorna documento
    async update(id, data, merge = true) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const updateData = {
                ...data,
                updatedAt: serverTimestamp()
            };

            if (merge) {
                await updateDoc(docRef, updateData);
            } else {
                await setDoc(docRef, updateData);
            }

            // Invalida cache per questo documento
            this.cache.delete(id);
            
            logger.success(`Documento aggiornato in ${this.collectionName}`, { id });
            return { success: true, id };
            
        } catch (error) {
            logger.error(`Errore update ${this.collectionName}`, error);
            return { success: false, error: error.message };
        }
    }

    // Elimina documento
    async delete(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
            
            // Rimuovi da cache
            this.cache.delete(id);
            
            logger.success(`Documento eliminato da ${this.collectionName}`, { id });
            return { success: true };
            
        } catch (error) {
            logger.error(`Errore delete ${this.collectionName}`, error);
            return { success: false, error: error.message };
        }
    }

    // Query personalizzata
    async getWithQuery(queryConstraints = [], useCache = false) {
        try {
            const q = query(this.collectionRef, ...queryConstraints);
            const querySnapshot = await getDocs(q);
            
            const docs = [];
            querySnapshot.forEach((doc) => {
                docs.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: docs, count: docs.length };
            
        } catch (error) {
            logger.error(`Errore query ${this.collectionName}`, error);
            return { success: false, error: error.message, data: [], count: 0 };
        }
    }

    // Listener real-time
    subscribeToChanges(queryConstraints = [], callback = () => {}) {
        try {
            const q = query(this.collectionRef, ...queryConstraints);
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ id: doc.id, ...doc.data() });
                });
                callback(docs);
            });

            return unsubscribe;
            
        } catch (error) {
            logger.error(`Errore subscription ${this.collectionName}`, error);
            return () => {};
        }
    }

    // Invalidazione cache
    invalidateCache() {
        this.cache.clear();
        logger.info(`Cache invalidata per ${this.collectionName}`);
    }
}

// Repository specializzato per Progress Data
class ProgressRepository extends BaseRepository {
    constructor() {
        super('progress');
    }

    // Ottieni progressi utente corrente
    async getUserProgress(startDate = null, endDate = null) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        const constraints = [
            where('userId', '==', userId),
            orderBy('date', 'desc')
        ];

        if (startDate) {
            constraints.push(where('date', '>=', startDate));
        }

        if (endDate) {
            constraints.push(where('date', '<=', endDate));
        }

        return this.getWithQuery(constraints);
    }

    // Aggiungi misurazione
    async addMeasurement(measurementData) {
        const data = {
            ...measurementData,
            date: measurementData.date || new Date().toISOString().split('T')[0],
            type: 'measurement'
        };
        
        return this.create(data);
    }

    // Ottieni statistiche periodo
    async getPeriodStats(days = 30) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

        const result = await this.getUserProgress(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );

        if (result.success && result.data.length > 0) {
            const data = result.data;
            const latest = data[0];
            const oldest = data[data.length - 1];

            return {
                success: true,
                stats: {
                    totalEntries: data.length,
                    weightChange: latest.weight - oldest.weight,
                    muscleMassChange: latest.muscleMass - oldest.muscleMass,
                    bodyFatChange: latest.bodyFat - oldest.bodyFat,
                    averageWeight: data.reduce((sum, entry) => sum + (entry.weight || 0), 0) / data.length,
                    period: { startDate, endDate, days }
                }
            };
        }

        return { success: false, error: 'Dati insufficienti per calcolare statistiche' };
    }
}

// Repository per Workout Sessions
class WorkoutRepository extends BaseRepository {
    constructor() {
        super('workouts');
    }

    // Inizio sessione workout
    async startSession(workoutData) {
        const sessionData = {
            ...workoutData,
            status: 'in_progress',
            startTime: serverTimestamp(),
            exercises: workoutData.exercises || [],
            totalDuration: 0
        };
        
        return this.create(sessionData);
    }

    // Completa sessione
    async completeSession(sessionId, completionData) {
        const updateData = {
            ...completionData,
            status: 'completed',
            endTime: serverTimestamp(),
            completedAt: serverTimestamp()
        };
        
        return this.update(sessionId, updateData);
    }

    // Ottieni sessioni utente
    async getUserSessions(limit = 50) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        return this.getWithQuery([
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limit)
        ]);
    }

    // Statistiche workout
    async getWorkoutStats(days = 7) {
        const sessions = await this.getUserSessions(100);
        
        if (!sessions.success) return sessions;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
        
        const recentSessions = sessions.data.filter(session => {
            const sessionDate = session.createdAt?.toDate?.() || new Date(session.createdAt);
            return sessionDate >= weekAgo && session.status === 'completed';
        });

        const totalSessions = recentSessions.length;
        const totalDuration = recentSessions.reduce((sum, session) => sum + (session.totalDuration || 0), 0);
        const averageDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
        
        const exerciseStats = {};
        recentSessions.forEach(session => {
            session.exercises?.forEach(exercise => {
                if (!exerciseStats[exercise.name]) {
                    exerciseStats[exercise.name] = { count: 0, totalVolume: 0 };
                }
                exerciseStats[exercise.name].count++;
                exerciseStats[exercise.name].totalVolume += (exercise.sets * exercise.reps * exercise.weight) || 0;
            });
        });

        return {
            success: true,
            stats: {
                totalSessions,
                totalDuration,
                averageDuration,
                exerciseStats,
                period: { days, startDate: weekAgo, endDate: now }
            }
        };
    }
}

// Repository per Exercise Tracking
class ExerciseRepository extends BaseRepository {
    constructor() {
        super('exercises');
    }

    // Aggiungi esercizio completato
    async logExercise(exerciseData) {
        const data = {
            ...exerciseData,
            date: exerciseData.date || new Date().toISOString().split('T')[0],
            volume: (exerciseData.sets * exerciseData.reps * exerciseData.weight) || 0,
            oneRepMax: this.calculateOneRepMax(exerciseData.weight, exerciseData.reps)
        };
        
        return this.create(data);
    }

    // Calcola 1RM stimato (formula Epley)
    calculateOneRepMax(weight, reps) {
        if (!weight || !reps || reps <= 0) return 0;
        if (reps === 1) return weight;
        return Math.round(weight * (1 + reps / 30));
    }

    // Ottieni PR per esercizio
    async getPersonalRecords(exerciseName = null) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };

        const constraints = [
            where('userId', '==', userId),
            orderBy('weight', 'desc')
        ];

        if (exerciseName) {
            constraints.unshift(where('exerciseName', '==', exerciseName));
        }

        const result = await this.getWithQuery(constraints);
        
        if (result.success) {
            // Raggruppa per esercizio e prendi il massimo
            const prs = {};
            result.data.forEach(exercise => {
                const name = exercise.exerciseName;
                if (!prs[name] || exercise.weight > prs[name].weight) {
                    prs[name] = exercise;
                }
            });
            
            return { success: true, data: Object.values(prs) };
        }
        
        return result;
    }
}

// Repository per User Settings
class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    // Ottieni profilo utente corrente
    async getCurrentUserProfile() {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };
        
        return this.getById(userId);
    }

    // Aggiorna impostazioni utente
    async updateSettings(settings) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };
        
        return this.update(userId, { settings }, true);
    }

    // Aggiorna profilo utente
    async updateProfile(profileData) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };
        
        return this.update(userId, { profile: profileData }, true);
    }
}

// Repository per Nutrition Tracking
class NutritionRepository extends BaseRepository {
    constructor() {
        super('nutrition');
    }

    // Registra pasto completato/saltato
    async logMeal(mealData) {
        const data = {
            ...mealData,
            date: mealData.date || new Date().toISOString().split('T')[0],
            completedAt: mealData.status === 'completed' ? new Date() : null
        };
        
        return this.create(data);
    }

    // Aggiorna stato pasto
    async updateMealStatus(mealId, status, notes = null) {
        const updateData = {
            status,
            notes,
            completedAt: status === 'completed' ? new Date() : null
        };
        
        return this.update(mealId, updateData);
    }

    // Ottieni pasti utente per data/range
    async getUserMeals(startDate = null, endDate = null) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        const constraints = [
            where('userId', '==', userId),
            orderBy('date', 'desc')
        ];

        if (startDate) {
            constraints.push(where('date', '>=', startDate));
        }

        if (endDate) {
            constraints.push(where('date', '<=', endDate));
        }

        return this.getWithQuery(constraints);
    }

    // Ottieni pasti per giorno specifico
    async getDayMeals(date) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        return this.getWithQuery([
            where('userId', '==', userId),
            where('date', '==', date),
            orderBy('mealType', 'asc')
        ]);
    }

    // Statistiche nutrizionali periodo
    async getNutritionStats(days = 30) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

        const result = await this.getUserMeals(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );

        if (!result.success) return result;

        const meals = result.data;
        const completedMeals = meals.filter(m => m.status === 'completed');
        const totalMeals = meals.length;
        const adherenceRate = totalMeals > 0 ? (completedMeals.length / totalMeals) * 100 : 0;

        // Calcola proteine totali (se tracked)
        const totalProteins = completedMeals.reduce((sum, meal) => sum + (meal.proteins || 0), 0);
        const avgProteinsPerDay = days > 0 ? totalProteins / days : 0;

        // Calcola streak
        const streak = this.calculateNutritionStreak(meals);

        return {
            success: true,
            stats: {
                totalMeals,
                completedMeals: completedMeals.length,
                adherenceRate: Math.round(adherenceRate),
                totalProteins,
                avgProteinsPerDay: Math.round(avgProteinsPerDay),
                currentStreak: streak,
                period: { startDate, endDate, days }
            }
        };
    }

    // Calcola streak nutrizionale
    calculateNutritionStreak(meals) {
        if (!meals.length) return 0;

        // Raggruppa pasti per giorno
        const mealsByDay = {};
        meals.forEach(meal => {
            if (!mealsByDay[meal.date]) {
                mealsByDay[meal.date] = [];
            }
            mealsByDay[meal.date].push(meal);
        });

        // Calcola streak giorni consecutivi con adherence > 66%
        let streak = 0;
        const sortedDates = Object.keys(mealsByDay).sort().reverse();

        for (const date of sortedDates) {
            const dayMeals = mealsByDay[date];
            const completedMeals = dayMeals.filter(m => m.status === 'completed');
            const adherence = completedMeals.length / dayMeals.length;

            if (adherence >= 0.66) { // Almeno 2/3 dei pasti completati
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }
}

// Repository per Recovery Tracking
class RecoveryRepository extends BaseRepository {
    constructor() {
        super('recovery');
    }

    // Registra sessione recovery
    async logRecoverySession(recoveryData) {
        const data = {
            ...recoveryData,
            date: recoveryData.date || new Date().toISOString().split('T')[0],
            completedAt: new Date()
        };
        
        return this.create(data);
    }

    // Ottieni sessioni recovery utente
    async getUserRecoverySessions(startDate = null, endDate = null) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        const constraints = [
            where('userId', '==', userId),
            orderBy('date', 'desc')
        ];

        if (startDate) {
            constraints.push(where('date', '>=', startDate));
        }

        if (endDate) {
            constraints.push(where('date', '<=', endDate));
        }

        return this.getWithQuery(constraints);
    }

    // Ottieni sessioni per giorno
    async getDayRecoverySessions(date) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato', data: [] };

        return this.getWithQuery([
            where('userId', '==', userId),
            where('date', '==', date),
            orderBy('createdAt', 'desc')
        ]);
    }

    // Statistiche recovery
    async getRecoveryStats(days = 30) {
        const userId = authService.getCurrentUser()?.uid;
        if (!userId) return { success: false, error: 'Utente non autenticato' };

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));

        const result = await this.getUserRecoverySessions(
            startDate.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
        );

        if (!result.success) return result;

        const sessions = result.data;
        const totalSessions = sessions.length;
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

        // Breakdown per tipo attività
        const activityBreakdown = {};
        sessions.forEach(session => {
            const type = session.activityType;
            if (!activityBreakdown[type]) {
                activityBreakdown[type] = { count: 0, totalDuration: 0 };
            }
            activityBreakdown[type].count++;
            activityBreakdown[type].totalDuration += session.duration || 0;
        });

        // Calcola frequenza settimanale
        const weeksInPeriod = Math.ceil(days / 7);
        const weeklyFrequency = totalSessions / weeksInPeriod;

        return {
            success: true,
            stats: {
                totalSessions,
                totalDuration,
                avgDuration: Math.round(avgDuration),
                weeklyFrequency: Math.round(weeklyFrequency * 10) / 10,
                activityBreakdown,
                period: { startDate, endDate, days }
            }
        };
    }
}

// Istanze singleton dei repository
export const progressRepo = new ProgressRepository();
export const workoutRepo = new WorkoutRepository();
export const exerciseRepo = new ExerciseRepository();
export const userRepo = new UserRepository();
export const nutritionRepo = new NutritionRepository();
export const recoveryRepo = new RecoveryRepository();

// Utility per operazioni batch
export const batchOperations = {
    // Esegui multiple operazioni in una transazione
    async executeTransaction(operations) {
        try {
            const result = await runTransaction(db, async (transaction) => {
                const results = [];
                
                for (const operation of operations) {
                    const { type, ref, data } = operation;
                    
                    switch (type) {
                        case 'set':
                            transaction.set(ref, data);
                            break;
                        case 'update':
                            transaction.update(ref, data);
                            break;
                        case 'delete':
                            transaction.delete(ref);
                            break;
                        default:
                            throw new Error(`Operazione non supportata: ${type}`);
                    }
                    
                    results.push({ success: true, operation: type });
                }
                
                return results;
            });
            
            logger.success('Transazione completata', { operations: result.length });
            return { success: true, results: result };
            
        } catch (error) {
            logger.error('Errore transazione batch', error);
            return { success: false, error: error.message };
        }
    },

    // Operazioni batch (fino a 500 operazioni)
    async executeBatch(operations) {
        try {
            const batch = writeBatch(db);
            
            operations.forEach(operation => {
                const { type, ref, data } = operation;
                
                switch (type) {
                    case 'set':
                        batch.set(ref, data);
                        break;
                    case 'update':
                        batch.update(ref, data);
                        break;
                    case 'delete':
                        batch.delete(ref);
                        break;
                    default:
                        throw new Error(`Operazione non supportata: ${type}`);
                }
            });
            
            await batch.commit();
            
            logger.success('Batch completato', { operations: operations.length });
            return { success: true, count: operations.length };
            
        } catch (error) {
            logger.error('Errore batch operations', error);
            return { success: false, error: error.message };
        }
    }
};

// Export per retrocompatibilità
export default {
    progressRepo,
    workoutRepo,
    exerciseRepo,
    userRepo,
    nutritionRepo,
    recoveryRepo,
    batchOperations
};