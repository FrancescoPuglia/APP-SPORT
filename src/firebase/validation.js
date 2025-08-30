// Firebase Data Validation Schemas - Yup Integration
// Schemi di validazione per tutti i dati dell'app fitness

import * as yup from 'yup';

// ========== PROGRESS DATA VALIDATION ==========

export const progressSchema = yup.object().shape({
    date: yup.string()
        .required('Data richiesta')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
    
    weight: yup.number()
        .min(30, 'Peso minimo 30kg')
        .max(300, 'Peso massimo 300kg')
        .nullable(),
    
    bodyFat: yup.number()
        .min(1, 'Massa grassa minima 1%')
        .max(50, 'Massa grassa massima 50%')
        .nullable(),
    
    muscleMass: yup.number()
        .min(10, 'Massa muscolare minima 10kg')
        .max(150, 'Massa muscolare massima 150kg')
        .nullable(),
    
    // Circonferenze corporee
    chest: yup.number()
        .min(50, 'Circonferenza torace minima 50cm')
        .max(200, 'Circonferenza torace massima 200cm')
        .nullable(),
    
    arms: yup.number()
        .min(20, 'Circonferenza braccia minima 20cm')
        .max(100, 'Circonferenza braccia massima 100cm')
        .nullable(),
    
    waist: yup.number()
        .min(50, 'Circonferenza vita minima 50cm')
        .max(150, 'Circonferenza vita massima 150cm')
        .nullable(),
    
    thighs: yup.number()
        .min(30, 'Circonferenza cosce minima 30cm')
        .max(100, 'Circonferenza cosce massima 100cm')
        .nullable(),
    
    notes: yup.string()
        .max(1000, 'Note massimo 1000 caratteri')
        .nullable()
});

// ========== WORKOUT DATA VALIDATION ==========

export const workoutSchema = yup.object().shape({
    name: yup.string()
        .max(100, 'Nome workout massimo 100 caratteri')
        .nullable(),
    
    status: yup.string()
        .oneOf(['planned', 'in_progress', 'completed', 'cancelled'], 'Status non valido')
        .default('planned'),
    
    totalDuration: yup.number()
        .min(0, 'Durata non può essere negativa')
        .max(480, 'Durata massima 8 ore (480 minuti)')
        .nullable(),
    
    exercises: yup.array()
        .of(yup.object())
        .nullable(),
    
    notes: yup.string()
        .max(1000, 'Note massimo 1000 caratteri')
        .nullable()
});

// ========== EXERCISE DATA VALIDATION ==========

export const exerciseSchema = yup.object().shape({
    exerciseName: yup.string()
        .required('Nome esercizio richiesto')
        .min(1, 'Nome esercizio non può essere vuoto')
        .max(100, 'Nome esercizio massimo 100 caratteri'),
    
    sets: yup.number()
        .min(1, 'Minimo 1 serie')
        .max(20, 'Massimo 20 serie')
        .nullable(),
    
    reps: yup.number()
        .min(1, 'Minimo 1 ripetizione')
        .max(100, 'Massimo 100 ripetizioni')
        .nullable(),
    
    weight: yup.number()
        .min(0, 'Peso non può essere negativo')
        .max(1000, 'Peso massimo 1000kg')
        .nullable(),
    
    rir: yup.number()
        .min(0, 'RIR minimo 0')
        .max(10, 'RIR massimo 10')
        .nullable(),
    
    date: yup.string()
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)')
        .nullable(),
    
    notes: yup.string()
        .max(500, 'Note massimo 500 caratteri')
        .nullable()
});

// ========== NUTRITION DATA VALIDATION ==========

export const nutritionSchema = yup.object().shape({
    date: yup.string()
        .required('Data richiesta')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
    
    mealType: yup.string()
        .required('Tipo pasto richiesto')
        .oneOf(['colazione', 'pranzo', 'snack', 'extra'], 'Tipo pasto non valido'),
    
    status: yup.string()
        .oneOf(['planned', 'completed', 'skipped'], 'Status pasto non valido')
        .default('planned'),
    
    proteins: yup.number()
        .min(0, 'Proteine non possono essere negative')
        .max(100, 'Proteine massimo 100g per pasto')
        .nullable(),
    
    calories: yup.number()
        .min(0, 'Calorie non possono essere negative')
        .max(2000, 'Calorie massimo 2000 per pasto')
        .nullable(),
    
    plannedFoods: yup.array()
        .of(yup.string().max(200, 'Descrizione cibo massimo 200 caratteri'))
        .nullable(),
    
    actualFoods: yup.array()
        .of(yup.string().max(200, 'Descrizione cibo massimo 200 caratteri'))
        .nullable(),
    
    notes: yup.string()
        .max(500, 'Note massimo 500 caratteri')
        .nullable()
});

// ========== RECOVERY DATA VALIDATION ==========

export const recoverySchema = yup.object().shape({
    date: yup.string()
        .required('Data richiesta')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido (YYYY-MM-DD)'),
    
    activityType: yup.string()
        .required('Tipo attività recovery richiesto')
        .oneOf(
            ['sauna', 'steam_bath', 'ice_bath', 'cold_shower', 'stretching', 'meditation'],
            'Tipo attività recovery non valido'
        ),
    
    duration: yup.number()
        .required('Durata richiesta')
        .min(1, 'Durata minima 1 minuto')
        .max(120, 'Durata massima 120 minuti'),
    
    temperature: yup.number()
        .min(-10, 'Temperatura minima -10°C')
        .max(100, 'Temperatura massima 100°C')
        .nullable()
        .when('activityType', {
            is: (val) => ['sauna', 'steam_bath', 'ice_bath', 'cold_shower'].includes(val),
            then: (schema) => schema.required('Temperatura richiesta per questa attività'),
            otherwise: (schema) => schema.nullable()
        }),
    
    intensity: yup.number()
        .min(1, 'Intensità minima 1')
        .max(10, 'Intensità massima 10')
        .nullable(),
    
    actualDuration: yup.number()
        .min(0, 'Durata effettiva non può essere negativa')
        .max(7200, 'Durata effettiva massima 2 ore (7200 secondi)')
        .nullable(),
    
    targetDuration: yup.number()
        .min(0, 'Durata target non può essere negativa')  
        .max(7200, 'Durata target massima 2 ore (7200 secondi)')
        .nullable(),
    
    notes: yup.string()
        .max(500, 'Note massimo 500 caratteri')
        .nullable()
});

// ========== USER PROFILE VALIDATION ==========

export const userProfileSchema = yup.object().shape({
    displayName: yup.string()
        .max(50, 'Nome massimo 50 caratteri')
        .nullable(),
    
    age: yup.number()
        .min(13, 'Età minima 13 anni')
        .max(120, 'Età massima 120 anni')
        .nullable(),
    
    height: yup.number()
        .min(100, 'Altezza minima 100cm')
        .max(250, 'Altezza massima 250cm')
        .nullable(),
    
    fitnessGoals: yup.array()
        .of(yup.string().oneOf(['muscle_gain', 'fat_loss', 'strength', 'endurance', 'general_fitness']))
        .nullable(),
    
    activityLevel: yup.string()
        .oneOf(['sedentary', 'light', 'moderate', 'active', 'very_active'])
        .nullable(),
    
    bio: yup.string()
        .max(500, 'Bio massimo 500 caratteri')
        .nullable()
});

// ========== USER SETTINGS VALIDATION ==========

export const userSettingsSchema = yup.object().shape({
    units: yup.object().shape({
        weight: yup.string().oneOf(['kg', 'lbs']).default('kg'),
        distance: yup.string().oneOf(['km', 'miles']).default('km'),
        temperature: yup.string().oneOf(['celsius', 'fahrenheit']).default('celsius')
    }),
    
    notifications: yup.object().shape({
        workoutReminders: yup.boolean().default(true),
        progressReminders: yup.boolean().default(true),
        recoveryReminders: yup.boolean().default(true),
        nutritionReminders: yup.boolean().default(true)
    }),
    
    privacy: yup.object().shape({
        shareProgress: yup.boolean().default(false),
        shareWorkouts: yup.boolean().default(false),
        allowAnalytics: yup.boolean().default(true)
    }),
    
    theme: yup.string()
        .oneOf(['light', 'dark', 'auto'])
        .default('auto'),
    
    language: yup.string()
        .oneOf(['it', 'en'])
        .default('it')
});

// ========== HELPER FUNCTIONS ==========

// Validazione data nel passato (non future)
export const pastDateSchema = yup.string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato data non valido')
    .test('past-date', 'La data non può essere nel futuro', function(value) {
        if (!value) return true;
        const inputDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Fine giornata
        return inputDate <= today;
    });

// Validazione email personalizzata per Firebase
export const firebaseEmailSchema = yup.string()
    .email('Email non valida')
    .required('Email richiesta')
    .max(254, 'Email troppo lunga');

// Validazione password per Firebase
export const firebasePasswordSchema = yup.string()
    .required('Password richiesta')
    .min(6, 'Password minimo 6 caratteri')
    .max(4096, 'Password troppo lunga');

// ========== COMPOSITE VALIDATION ==========

// Schema per la registrazione utente
export const userRegistrationSchema = yup.object().shape({
    email: firebaseEmailSchema,
    password: firebasePasswordSchema,
    confirmPassword: yup.string()
        .required('Conferma password richiesta')
        .oneOf([yup.ref('password'), null], 'Le password non corrispondono'),
    displayName: yup.string()
        .required('Nome richiesto')
        .min(2, 'Nome minimo 2 caratteri')
        .max(50, 'Nome massimo 50 caratteri'),
    acceptTerms: yup.boolean()
        .oneOf([true], 'Devi accettare i termini e condizioni')
        .required('Accettazione termini richiesta')
});

// Schema per il login utente
export const userLoginSchema = yup.object().shape({
    email: firebaseEmailSchema,
    password: yup.string().required('Password richiesta')
});

// ========== EXPORT UTILITIES ==========

// Funzione helper per validare dati con gestione errori
export const validateData = async (schema, data) => {
    try {
        const validatedData = await schema.validate(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { success: true, data: validatedData, errors: null };
    } catch (error) {
        const errors = error.inner.reduce((acc, err) => {
            acc[err.path] = err.message;
            return acc;
        }, {});
        return { success: false, data: null, errors };
    }
};

// Funzione helper per validazione sincrona
export const validateDataSync = (schema, data) => {
    try {
        const validatedData = schema.validateSync(data, { 
            abortEarly: false,
            stripUnknown: true 
        });
        return { success: true, data: validatedData, errors: null };
    } catch (error) {
        const errors = error.inner.reduce((acc, err) => {
            acc[err.path] = err.message;
            return acc;
        }, {});
        return { success: false, data: null, errors };
    }
};

// Validazione condizionale per campi opzionali
export const conditionalRequiredSchema = (condition, schema) => {
    return yup.mixed().when(condition, {
        is: true,
        then: (schema) => schema.required('Campo richiesto quando la condizione è soddisfatta'),
        otherwise: (schema) => schema.nullable()
    });
};

export default {
    progressSchema,
    workoutSchema,
    exerciseSchema,
    nutritionSchema,
    recoverySchema,
    userProfileSchema,
    userSettingsSchema,
    userRegistrationSchema,
    userLoginSchema,
    validateData,
    validateDataSync
};