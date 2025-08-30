// Data Migration Service - localStorage to Firestore
// Sistema di migrazione intelligente con backup e rollback

import { progressRepo, workoutRepo, exerciseRepo, userRepo, batchOperations } from './firestore';
import authService from './auth';
import { logger } from './config';

class MigrationService {
    constructor() {
        this.migrationKey = 'firebase_migration_status';
        this.backupKey = 'firebase_migration_backup';
    }

    // Controlla se la migrazione è già stata eseguita
    isMigrationCompleted() {
        try {
            const status = localStorage.getItem(this.migrationKey);
            return status === 'completed';
        } catch (error) {
            logger.error('Errore verifica migrazione', error);
            return false;
        }
    }

    // Segna migrazione come completata
    markMigrationCompleted() {
        try {
            const migrationData = {
                status: 'completed',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            localStorage.setItem(this.migrationKey, 'completed');
            localStorage.setItem(`${this.migrationKey}_details`, JSON.stringify(migrationData));
            logger.success('Migrazione marcata come completata');
        } catch (error) {
            logger.error('Errore marcamento migrazione', error);
        }
    }

    // Crea backup completo dei dati localStorage
    createBackup() {
        try {
            const backupData = {
                timestamp: new Date().toISOString(),
                data: {
                    progressData: this.safeGetLocalStorage('progressData'),
                    workoutSessions: this.safeGetLocalStorage('workoutSessions'),
                    exerciseData: this.safeGetLocalStorage('exerciseData'),
                    timeStats: this.safeGetLocalStorage('timeStats'),
                    streakData: this.safeGetLocalStorage('streakData'),
                    personalRecords: this.safeGetLocalStorage('personalRecords'),
                    goals12Week: this.safeGetLocalStorage('goals12Week'),
                    userSettings: this.safeGetLocalStorage('userSettings')
                }
            };

            // Comprimi backup se troppo grande
            const backupString = JSON.stringify(backupData);
            if (backupString.length > 2 * 1024 * 1024) { // 2MB
                logger.warn('Backup molto grande, compressione necessaria');
                // In un'implementazione reale, potresti voler comprimere i dati
            }

            localStorage.setItem(this.backupKey, backupString);
            logger.success('Backup creato', { size: `${Math.round(backupString.length / 1024)}KB` });
            
            return { success: true, backup: backupData };
            
        } catch (error) {
            logger.error('Errore creazione backup', error);
            return { success: false, error: error.message };
        }
    }

    // Sicuro get da localStorage con fallback
    safeGetLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            logger.warn(`Errore parsing ${key}`, error);
            return null;
        }
    }

    // Migrazione completa con controlli e validazioni
    async migrateAllData() {
        if (!authService.isAuthenticated()) {
            return { success: false, error: 'Utente non autenticato' };
        }

        if (this.isMigrationCompleted()) {
            logger.info('Migrazione già completata');
            return { success: true, message: 'Migrazione già completata' };
        }

        const migrationReport = {
            startTime: new Date().toISOString(),
            steps: [],
            errors: [],
            totalItems: 0,
            migratedItems: 0
        };

        try {
            logger.info('🚀 Inizio migrazione dati localStorage → Firestore');

            // STEP 1: Crea backup
            migrationReport.steps.push('Creazione backup...');
            const backupResult = this.createBackup();
            if (!backupResult.success) {
                throw new Error(`Backup fallito: ${backupResult.error}`);
            }

            // STEP 2: Migra dati progress
            migrationReport.steps.push('Migrazione dati progress...');
            const progressResult = await this.migrateProgressData();
            migrationReport.totalItems += progressResult.totalItems;
            migrationReport.migratedItems += progressResult.migratedItems;
            if (progressResult.errors.length > 0) {
                migrationReport.errors.push(...progressResult.errors);
            }

            // STEP 3: Migra sessioni workout
            migrationReport.steps.push('Migrazione sessioni workout...');
            const workoutResult = await this.migrateWorkoutSessions();
            migrationReport.totalItems += workoutResult.totalItems;
            migrationReport.migratedItems += workoutResult.migratedItems;
            if (workoutResult.errors.length > 0) {
                migrationReport.errors.push(...workoutResult.errors);
            }

            // STEP 4: Migra dati esercizi
            migrationReport.steps.push('Migrazione dati esercizi...');
            const exerciseResult = await this.migrateExerciseData();
            migrationReport.totalItems += exerciseResult.totalItems;
            migrationReport.migratedItems += exerciseResult.migratedItems;
            if (exerciseResult.errors.length > 0) {
                migrationReport.errors.push(...exerciseResult.errors);
            }

            // STEP 5: Migra impostazioni utente
            migrationReport.steps.push('Migrazione impostazioni utente...');
            const userResult = await this.migrateUserSettings();
            if (!userResult.success) {
                migrationReport.errors.push(`Errore migrazione utente: ${userResult.error}`);
            }

            // STEP 6: Verifica integrità
            migrationReport.steps.push('Verifica integrità dati...');
            const verificationResult = await this.verifyMigration();
            migrationReport.verificationPassed = verificationResult.success;

            // STEP 7: Completa migrazione se tutto ok
            if (migrationReport.errors.length === 0 && verificationResult.success) {
                this.markMigrationCompleted();
                migrationReport.steps.push('Migrazione completata con successo');
                logger.success('✅ Migrazione completata', {
                    totalItems: migrationReport.totalItems,
                    migratedItems: migrationReport.migratedItems,
                    duration: `${Date.now() - new Date(migrationReport.startTime).getTime()}ms`
                });
            } else {
                logger.warn('⚠️ Migrazione completata con errori', {
                    errors: migrationReport.errors.length,
                    details: migrationReport.errors
                });
            }

            migrationReport.endTime = new Date().toISOString();
            migrationReport.success = migrationReport.errors.length === 0;

            return { success: true, report: migrationReport };

        } catch (error) {
            migrationReport.endTime = new Date().toISOString();
            migrationReport.success = false;
            migrationReport.errors.push(`Errore fatale: ${error.message}`);
            
            logger.error('❌ Migrazione fallita', error);
            return { success: false, error: error.message, report: migrationReport };
        }
    }

    // Migrazione dati progress
    async migrateProgressData() {
        const progressData = this.safeGetLocalStorage('progressData') || [];
        const result = { totalItems: progressData.length, migratedItems: 0, errors: [] };

        if (progressData.length === 0) {
            logger.info('Nessun dato progress da migrare');
            return result;
        }

        logger.info(`Migrazione ${progressData.length} record progress...`);

        for (const item of progressData) {
            try {
                // Validazione e pulizia dati
                const cleanedData = this.cleanProgressData(item);
                if (!cleanedData) {
                    result.errors.push(`Dato progress non valido: ${JSON.stringify(item)}`);
                    continue;
                }

                const createResult = await progressRepo.addMeasurement(cleanedData);
                if (createResult.success) {
                    result.migratedItems++;
                    logger.info(`Progress migrato: ${cleanedData.date}`);
                } else {
                    result.errors.push(`Errore migrazione progress: ${createResult.error}`);
                }

                // Throttling per non sovraccaricare Firestore
                await this.sleep(50);

            } catch (error) {
                result.errors.push(`Errore progress item: ${error.message}`);
            }
        }

        logger.success(`Progress migration: ${result.migratedItems}/${result.totalItems}`);
        return result;
    }

    // Migrazione sessioni workout
    async migrateWorkoutSessions() {
        const workoutSessions = this.safeGetLocalStorage('workoutSessions') || [];
        const result = { totalItems: workoutSessions.length, migratedItems: 0, errors: [] };

        if (workoutSessions.length === 0) {
            logger.info('Nessuna sessione workout da migrare');
            return result;
        }

        logger.info(`Migrazione ${workoutSessions.length} sessioni workout...`);

        for (const session of workoutSessions) {
            try {
                const cleanedData = this.cleanWorkoutSession(session);
                if (!cleanedData) {
                    result.errors.push(`Sessione workout non valida: ${JSON.stringify(session)}`);
                    continue;
                }

                const createResult = await workoutRepo.create(cleanedData);
                if (createResult.success) {
                    result.migratedItems++;
                    logger.info(`Workout migrato: ${cleanedData.date}`);
                } else {
                    result.errors.push(`Errore migrazione workout: ${createResult.error}`);
                }

                await this.sleep(50);

            } catch (error) {
                result.errors.push(`Errore workout session: ${error.message}`);
            }
        }

        logger.success(`Workout migration: ${result.migratedItems}/${result.totalItems}`);
        return result;
    }

    // Migrazione dati esercizi
    async migrateExerciseData() {
        const exerciseData = this.safeGetLocalStorage('exerciseData') || {};
        const exercises = Object.values(exerciseData);
        const result = { totalItems: exercises.length, migratedItems: 0, errors: [] };

        if (exercises.length === 0) {
            logger.info('Nessun dato esercizio da migrare');
            return result;
        }

        logger.info(`Migrazione ${exercises.length} record esercizi...`);

        for (const exercise of exercises) {
            try {
                const cleanedData = this.cleanExerciseData(exercise);
                if (!cleanedData) {
                    result.errors.push(`Dato esercizio non valido: ${JSON.stringify(exercise)}`);
                    continue;
                }

                const createResult = await exerciseRepo.logExercise(cleanedData);
                if (createResult.success) {
                    result.migratedItems++;
                    logger.info(`Esercizio migrato: ${cleanedData.exerciseName}`);
                } else {
                    result.errors.push(`Errore migrazione esercizio: ${createResult.error}`);
                }

                await this.sleep(50);

            } catch (error) {
                result.errors.push(`Errore exercise item: ${error.message}`);
            }
        }

        logger.success(`Exercise migration: ${result.migratedItems}/${result.totalItems}`);
        return result;
    }

    // Migrazione impostazioni utente
    async migrateUserSettings() {
        try {
            const timeStats = this.safeGetLocalStorage('timeStats') || {};
            const goals12Week = this.safeGetLocalStorage('goals12Week') || {};
            const userSettings = this.safeGetLocalStorage('userSettings') || {};

            const profileData = {
                fitnessStats: timeStats,
                goals: goals12Week,
                preferences: userSettings,
                migratedFrom: 'localStorage',
                migrationDate: new Date().toISOString()
            };

            const updateResult = await userRepo.updateProfile(profileData);
            if (updateResult.success) {
                logger.success('Impostazioni utente migrate');
                return { success: true };
            } else {
                return { success: false, error: updateResult.error };
            }

        } catch (error) {
            logger.error('Errore migrazione impostazioni utente', error);
            return { success: false, error: error.message };
        }
    }

    // Pulizia e validazione dati progress
    cleanProgressData(data) {
        if (!data || typeof data !== 'object') return null;

        const cleaned = {
            date: data.date || new Date().toISOString().split('T')[0],
            weight: this.validateNumber(data.weight, 30, 300),
            bodyFat: this.validateNumber(data.bodyFat, 1, 50),
            muscleMass: this.validateNumber(data.muscleMass, 10, 150),
            chest: this.validateNumber(data.chest, 50, 200),
            arms: this.validateNumber(data.arms, 20, 100),
            waist: this.validateNumber(data.waist, 50, 150),
            thighs: this.validateNumber(data.thighs, 30, 100),
            notes: this.validateString(data.notes, 1000)
        };

        // Rimuovi campi null/undefined
        Object.keys(cleaned).forEach(key => {
            if (cleaned[key] === null || cleaned[key] === undefined) {
                delete cleaned[key];
            }
        });

        // Deve avere almeno peso o data
        return (cleaned.weight || cleaned.date) ? cleaned : null;
    }

    // Pulizia dati workout session
    cleanWorkoutSession(data) {
        if (!data || typeof data !== 'object') return null;

        return {
            date: data.date || new Date().toISOString().split('T')[0],
            name: this.validateString(data.name || data.workoutName, 100),
            status: ['planned', 'in_progress', 'completed'].includes(data.status) ? data.status : 'completed',
            totalDuration: this.validateNumber(data.totalDuration || data.duration, 0, 480),
            exercises: Array.isArray(data.exercises) ? data.exercises : [],
            notes: this.validateString(data.notes, 1000)
        };
    }

    // Pulizia dati esercizio
    cleanExerciseData(data) {
        if (!data || typeof data !== 'object' || !data.exerciseName) return null;

        return {
            exerciseName: this.validateString(data.exerciseName, 100),
            date: data.date || new Date().toISOString().split('T')[0],
            sets: this.validateNumber(data.sets, 1, 20),
            reps: this.validateNumber(data.reps, 1, 100),
            weight: this.validateNumber(data.weight, 0, 1000),
            rir: this.validateNumber(data.rir, 0, 10),
            notes: this.validateString(data.notes, 500)
        };
    }

    // Validazione numeri con range
    validateNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
        const num = parseFloat(value);
        return (!isNaN(num) && num >= min && num <= max) ? num : null;
    }

    // Validazione stringhe con lunghezza massima
    validateString(value, maxLength = 1000) {
        if (typeof value !== 'string') return null;
        return value.length <= maxLength ? value.trim() : value.substring(0, maxLength).trim();
    }

    // Verifica integrità post-migrazione
    async verifyMigration() {
        try {
            logger.info('Verifica integrità dati migrati...');

            // Controlla se i dati sono stati creati correttamente
            const progressCheck = await progressRepo.getUserProgress();
            const workoutCheck = await workoutRepo.getUserSessions(10);
            const userCheck = await userRepo.getCurrentUserProfile();

            const checks = {
                progress: progressCheck.success,
                workouts: workoutCheck.success,
                userProfile: userCheck.success
            };

            const allPassed = Object.values(checks).every(check => check === true);

            logger.info('Risultati verifica', checks);
            
            return { 
                success: allPassed, 
                checks,
                details: {
                    progressCount: progressCheck.data?.length || 0,
                    workoutCount: workoutCheck.data?.length || 0,
                    hasUserProfile: !!userCheck.data
                }
            };

        } catch (error) {
            logger.error('Errore verifica migrazione', error);
            return { success: false, error: error.message };
        }
    }

    // Rollback migrazione (ripristina da backup)
    async rollbackMigration() {
        try {
            logger.warn('🔄 Inizio rollback migrazione...');

            const backupData = localStorage.getItem(this.backupKey);
            if (!backupData) {
                throw new Error('Nessun backup disponibile per il rollback');
            }

            const backup = JSON.parse(backupData);
            
            // Ripristina tutti i dati localStorage dal backup
            Object.keys(backup.data).forEach(key => {
                if (backup.data[key] !== null) {
                    localStorage.setItem(key, JSON.stringify(backup.data[key]));
                }
            });

            // Rimuovi flag migrazione completata
            localStorage.removeItem(this.migrationKey);
            localStorage.removeItem(`${this.migrationKey}_details`);

            logger.success('✅ Rollback completato');
            return { success: true, message: 'Dati ripristinati da backup' };

        } catch (error) {
            logger.error('❌ Errore rollback', error);
            return { success: false, error: error.message };
        }
    }

    // Utility per throttling
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Ottieni stato migrazione dettagliato
    getMigrationStatus() {
        try {
            const status = localStorage.getItem(this.migrationKey);
            const details = localStorage.getItem(`${this.migrationKey}_details`);
            
            return {
                isCompleted: status === 'completed',
                status,
                details: details ? JSON.parse(details) : null,
                hasBackup: !!localStorage.getItem(this.backupKey)
            };

        } catch (error) {
            logger.error('Errore stato migrazione', error);
            return {
                isCompleted: false,
                status: 'unknown',
                details: null,
                hasBackup: false,
                error: error.message
            };
        }
    }
}

// Istanza singleton del servizio migrazione
const migrationService = new MigrationService();

export default migrationService;
export { MigrationService };