// Validation Schemas - Enterprise Grade
// Schema di validazione completi per tutti i form dell'applicazione

import * as yup from 'yup';

// ========== CONFIGURAZIONE BASE ==========

// Messaggi di errore personalizzati in italiano
yup.setLocale({
    mixed: {
        default: 'Campo non valido',
        required: 'Campo obbligatorio',
        notType: 'Tipo di dato non valido'
    },
    string: {
        min: 'Minimo ${min} caratteri',
        max: 'Massimo ${max} caratteri',
        email: 'Email non valida'
    },
    number: {
        min: 'Valore minimo: ${min}',
        max: 'Valore massimo: ${max}',
        positive: 'Deve essere un numero positivo',
        integer: 'Deve essere un numero intero'
    },
    date: {
        min: 'Data non può essere precedente al ${min}',
        max: 'Data non può essere successiva al ${max}'
    }
});

// ========== UTILITY VALIDATIONS ==========

// Validazione peso realistico (30-300 kg)
const weightValidation = yup.number()
    .typeError('Peso deve essere un numero')
    .min(30, 'Peso minimo 30kg')
    .max(300, 'Peso massimo 300kg');

// Validazione percentuale (0-100%)
const percentageValidation = yup.number()
    .typeError('Percentuale deve essere un numero')
    .min(0, 'Percentuale minima 0%')
    .max(100, 'Percentuale massima 100%');

// Validazione circonferenze corporee (10-200 cm)
const measurementValidation = yup.number()
    .typeError('Misurazione deve essere un numero')
    .min(10, 'Misurazione minima 10cm')
    .max(200, 'Misurazione massima 200cm');

// Validazione data (non futura)
const dateValidation = yup.date()
    .typeError('Data non valida')
    .max(new Date(), 'Data non può essere futura');

// Validazione password sicura
const passwordValidation = yup.string()
    .min(8, 'Password minimo 8 caratteri')
    .matches(/[a-z]/, 'Deve contenere almeno una lettera minuscola')
    .matches(/[A-Z]/, 'Deve contenere almeno una lettera maiuscola')
    .matches(/[0-9]/, 'Deve contenere almeno un numero')
    .matches(/[^a-zA-Z0-9]/, 'Deve contenere almeno un carattere speciale');

// ========== AUTHENTICATION SCHEMAS ==========

// Schema registrazione
export const registrationSchema = yup.object({
    email: yup
        .string()
        .required('Email è obbligatoria')
        .email('Formato email non valido')
        .max(254, 'Email troppo lunga'),
    
    password: passwordValidation.required('Password è obbligatoria'),
    
    confirmPassword: yup
        .string()
        .required('Conferma password è obbligatoria')
        .oneOf([yup.ref('password')], 'Le password non corrispondono'),
    
    displayName: yup
        .string()
        .min(2, 'Nome minimo 2 caratteri')
        .max(50, 'Nome massimo 50 caratteri')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome può contenere solo lettere e spazi')
        .nullable(),
    
    acceptTerms: yup
        .boolean()
        .oneOf([true], 'Devi accettare i termini e condizioni')
});

// Schema login
export const loginSchema = yup.object({
    email: yup
        .string()
        .required('Email è obbligatoria')
        .email('Formato email non valido'),
    
    password: yup
        .string()
        .required('Password è obbligatoria')
        .min(1, 'Password non può essere vuota'),
    
    rememberMe: yup.boolean().default(false)
});

// Schema reset password
export const resetPasswordSchema = yup.object({
    email: yup
        .string()
        .required('Email è obbligatoria')
        .email('Formato email non valido')
});

// Schema cambio password
export const changePasswordSchema = yup.object({
    currentPassword: yup
        .string()
        .required('Password attuale è obbligatoria'),
    
    newPassword: passwordValidation.required('Nuova password è obbligatoria'),
    
    confirmNewPassword: yup
        .string()
        .required('Conferma nuova password è obbligatoria')
        .oneOf([yup.ref('newPassword')], 'Le password non corrispondono')
});

// ========== PROGRESS TRACKING SCHEMAS ==========

// Schema misurazione progress
export const progressMeasurementSchema = yup.object({
    weight: weightValidation.nullable(),
    
    bodyFat: percentageValidation
        .min(3, 'Massa grassa minima 3%')
        .max(50, 'Massa grassa massima 50%')
        .nullable(),
    
    muscleMass: yup.number()
        .typeError('Massa muscolare deve essere un numero')
        .min(10, 'Massa muscolare minima 10kg')
        .max(150, 'Massa muscolare massima 150kg')
        .nullable(),
    
    chest: measurementValidation
        .min(50, 'Circonferenza petto minima 50cm')
        .max(200, 'Circonferenza petto massima 200cm')
        .nullable(),
    
    arms: measurementValidation
        .min(20, 'Circonferenza braccia minima 20cm')
        .max(100, 'Circonferenza braccia massima 100cm')
        .nullable(),
    
    waist: measurementValidation
        .min(50, 'Circonferenza vita minima 50cm')
        .max(150, 'Circonferenza vita massima 150cm')
        .nullable(),
    
    thighs: measurementValidation
        .min(30, 'Circonferenza cosce minima 30cm')
        .max(100, 'Circonferenza cosce massima 100cm')
        .nullable(),
    
    date: dateValidation.default(() => new Date()),
    
    notes: yup
        .string()
        .max(1000, 'Note massimo 1000 caratteri')
        .nullable()
})
.test('at-least-one-measurement', 'Inserisci almeno una misurazione', function(value) {
    const { weight, bodyFat, muscleMass, chest, arms, waist, thighs } = value || {};
    return !!(weight || bodyFat || muscleMass || chest || arms || waist || thighs);
});

// ========== WORKOUT SCHEMAS ==========

// Schema esercizio singolo
export const exerciseSchema = yup.object({
    exerciseName: yup
        .string()
        .required('Nome esercizio è obbligatorio')
        .min(2, 'Nome esercizio minimo 2 caratteri')
        .max(100, 'Nome esercizio massimo 100 caratteri')
        .matches(/^[a-zA-ZÀ-ÿ0-9\s\-().]+$/, 'Nome esercizio contiene caratteri non validi'),
    
    sets: yup
        .number()
        .required('Numero serie è obbligatorio')
        .integer('Serie deve essere un numero intero')
        .min(1, 'Minimo 1 serie')
        .max(20, 'Massimo 20 serie'),
    
    reps: yup
        .number()
        .required('Numero ripetizioni è obbligatorio')
        .integer('Ripetizioni deve essere un numero intero')
        .min(1, 'Minimo 1 ripetizione')
        .max(100, 'Massimo 100 ripetizioni'),
    
    weight: yup
        .number()
        .typeError('Peso deve essere un numero')
        .min(0, 'Peso non può essere negativo')
        .max(1000, 'Peso massimo 1000kg')
        .nullable(),
    
    rir: yup
        .number()
        .typeError('RIR deve essere un numero')
        .integer('RIR deve essere un numero intero')
        .min(0, 'RIR minimo 0')
        .max(10, 'RIR massimo 10')
        .nullable(),
    
    notes: yup
        .string()
        .max(500, 'Note esercizio massimo 500 caratteri')
        .nullable()
});

// Schema sessione workout
export const workoutSessionSchema = yup.object({
    name: yup
        .string()
        .required('Nome workout è obbligatorio')
        .min(3, 'Nome workout minimo 3 caratteri')
        .max(100, 'Nome workout massimo 100 caratteri'),
    
    date: dateValidation.required('Data è obbligatoria'),
    
    startTime: yup
        .date()
        .typeError('Orario inizio non valido')
        .nullable(),
    
    endTime: yup
        .date()
        .typeError('Orario fine non valido')
        .min(yup.ref('startTime'), 'Orario fine deve essere dopo l\'inizio')
        .nullable(),
    
    totalDuration: yup
        .number()
        .typeError('Durata deve essere un numero')
        .min(1, 'Durata minima 1 minuto')
        .max(480, 'Durata massima 8 ore (480 minuti)')
        .nullable(),
    
    exercises: yup
        .array()
        .of(exerciseSchema)
        .min(1, 'Almeno un esercizio è obbligatorio'),
    
    notes: yup
        .string()
        .max(1000, 'Note workout massimo 1000 caratteri')
        .nullable(),
    
    intensity: yup
        .number()
        .integer('Intensità deve essere un numero intero')
        .min(1, 'Intensità minima 1')
        .max(10, 'Intensità massima 10')
        .nullable()
});

// ========== USER PROFILE SCHEMAS ==========

// Schema profilo utente
export const userProfileSchema = yup.object({
    displayName: yup
        .string()
        .min(2, 'Nome minimo 2 caratteri')
        .max(50, 'Nome massimo 50 caratteri')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome può contenere solo lettere e spazi')
        .nullable(),
    
    age: yup
        .number()
        .integer('Età deve essere un numero intero')
        .min(13, 'Età minima 13 anni')
        .max(120, 'Età massima 120 anni')
        .nullable(),
    
    height: yup
        .number()
        .typeError('Altezza deve essere un numero')
        .min(100, 'Altezza minima 100cm')
        .max(250, 'Altezza massima 250cm')
        .nullable(),
    
    activityLevel: yup
        .string()
        .oneOf(['sedentary', 'light', 'moderate', 'active', 'very_active'], 'Livello attività non valido')
        .default('moderate'),
    
    fitnessGoals: yup
        .array()
        .of(yup.string().oneOf([
            'weight_loss', 'muscle_gain', 'strength', 'endurance', 
            'flexibility', 'general_health', 'athletic_performance'
        ]))
        .max(5, 'Massimo 5 obiettivi'),
    
    experience: yup
        .string()
        .oneOf(['beginner', 'intermediate', 'advanced', 'expert'], 'Livello esperienza non valido')
        .default('beginner'),
    
    preferences: yup.object({
        units: yup.string().oneOf(['metric', 'imperial']).default('metric'),
        language: yup.string().oneOf(['it', 'en']).default('it'),
        notifications: yup.boolean().default(true),
        darkMode: yup.boolean().default(false),
        publicProfile: yup.boolean().default(false)
    })
});

// ========== GOALS SCHEMAS ==========

// Schema obiettivi 12 settimane
export const goals12WeekSchema = yup.object({
    startWeight: weightValidation.required('Peso iniziale è obbligatorio'),
    
    targetWeight: weightValidation
        .required('Peso target è obbligatorio')
        .test('weight-difference', 'Differenza peso deve essere ragionevole (±30kg)', function(value) {
            const { startWeight } = this.parent;
            if (!startWeight || !value) return true;
            return Math.abs(value - startWeight) <= 30;
        }),
    
    targetBench: yup
        .number()
        .typeError('Target panca deve essere un numero')
        .min(20, 'Target panca minimo 20kg')
        .max(300, 'Target panca massimo 300kg')
        .nullable(),
    
    targetSquat: yup
        .number()
        .typeError('Target squat deve essere un numero')
        .min(30, 'Target squat minimo 30kg')
        .max(500, 'Target squat massimo 500kg')
        .nullable(),
    
    targetDeadlift: yup
        .number()
        .typeError('Target deadlift deve essere un numero')
        .min(40, 'Target deadlift minimo 40kg')
        .max(600, 'Target deadlift massimo 600kg')
        .nullable(),
    
    startDate: yup
        .date()
        .required('Data inizio è obbligatoria')
        .max(new Date(), 'Data inizio non può essere futura'),
    
    targetDate: yup
        .date()
        .required('Data target è obbligatoria')
        .min(yup.ref('startDate'), 'Data target deve essere dopo data inizio')
        .test('12-weeks-max', 'Periodo massimo 16 settimane', function(value) {
            const { startDate } = this.parent;
            if (!startDate || !value) return true;
            const diffWeeks = (value - startDate) / (7 * 24 * 60 * 60 * 1000);
            return diffWeeks <= 16;
        })
});

// ========== SETTINGS SCHEMAS ==========

// Schema impostazioni app
export const appSettingsSchema = yup.object({
    notifications: yup.object({
        workoutReminders: yup.boolean().default(true),
        progressReminders: yup.boolean().default(true),
        achievementAlerts: yup.boolean().default(true),
        emailNotifications: yup.boolean().default(false),
        pushNotifications: yup.boolean().default(true)
    }),
    
    privacy: yup.object({
        profileVisibility: yup.string().oneOf(['private', 'friends', 'public']).default('private'),
        shareProgress: yup.boolean().default(false),
        shareWorkouts: yup.boolean().default(false),
        allowFriendRequests: yup.boolean().default(true)
    }),
    
    display: yup.object({
        theme: yup.string().oneOf(['light', 'dark', 'auto']).default('light'),
        language: yup.string().oneOf(['it', 'en']).default('it'),
        dateFormat: yup.string().oneOf(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']).default('DD/MM/YYYY'),
        timeFormat: yup.string().oneOf(['24h', '12h']).default('24h')
    }),
    
    units: yup.object({
        weight: yup.string().oneOf(['kg', 'lb']).default('kg'),
        distance: yup.string().oneOf(['km', 'mi']).default('km'),
        height: yup.string().oneOf(['cm', 'ft']).default('cm')
    })
});

// ========== VALIDATION HELPERS ==========

// Helper per validazione condizionale
export const conditionalSchema = (condition, schema, fallback = yup.mixed().nullable()) => {
    return yup.mixed().when(condition, {
        is: true,
        then: schema,
        otherwise: fallback
    });
};

// Helper per validazione campi dinamici
export const dynamicFieldSchema = (fieldType) => {
    const schemas = {
        text: yup.string().max(100),
        number: yup.number(),
        email: yup.string().email(),
        date: dateValidation,
        boolean: yup.boolean()
    };
    
    return schemas[fieldType] || yup.mixed();
};

// Validazione personalizzata per form complessi
export const validateWithSchema = async (schema, data, options = {}) => {
    try {
        const validatedData = await schema.validate(data, {
            abortEarly: false,
            stripUnknown: true,
            ...options
        });
        
        return { isValid: true, data: validatedData, errors: {} };
        
    } catch (error) {
        const errors = {};
        
        if (error.inner) {
            error.inner.forEach(err => {
                if (err.path) {
                    errors[err.path] = err.message;
                }
            });
        } else {
            errors.general = error.message;
        }
        
        return { isValid: false, data: null, errors };
    }
};

// Export di tutti gli schemi per uso modulare
export default {
    registrationSchema,
    loginSchema,
    resetPasswordSchema,
    changePasswordSchema,
    progressMeasurementSchema,
    exerciseSchema,
    workoutSessionSchema,
    userProfileSchema,
    goals12WeekSchema,
    appSettingsSchema,
    validateWithSchema
};