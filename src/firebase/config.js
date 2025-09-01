// Firebase Configuration - GitHub Pages Compatible
// Configurazione inline per GitHub Pages (non supporta variabili .env a runtime)

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configurazione Firebase - VALORI REALI DA FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyA733m8k7LZPOU968nt_VFk3M1HTBDIMhc",
    authDomain: "extraordinary-growth-app.firebaseapp.com",
    projectId: "extraordinary-growth-app",
    storageBucket: "extraordinary-growth-app.appspot.com",
    messagingSenderId: "499496713845",
    appId: "1:499496713845:web:9994c2c58968900b6e823c",
    measurementId: "G-186E08D9M1"
};

// Debug: Verifica che la API key sia corretta
console.log("🔧 Firebase API Key in uso:", firebaseConfig.apiKey);
console.log("🔧 Firebase Project ID:", firebaseConfig.projectId);

// Validazione configurazione
const validateConfig = (config) => {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missing = requiredKeys.filter(key => !config[key] || config[key].includes('demo') || config[key].includes('123456'));
    
    if (missing.length > 0) {
        console.warn('🚨 Firebase Config Warning: Alcune chiavi sembrano essere demo values:', missing);
        console.warn('📋 Per utilizzare Firebase in produzione, sostituisci i valori in .env.local');
    }
    
    return config;
};

// Inizializzazione app con validazione
const validatedConfig = validateConfig(firebaseConfig);
const app = initializeApp(validatedConfig);

// Inizializzazione servizi Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Inizializzazione Analytics condizionale
let analytics = null;
isSupported().then(supported => {
    if (supported) {
        analytics = getAnalytics(app);
        console.log('📊 Firebase Analytics inizializzato');
    } else {
        console.log('📊 Firebase Analytics non supportato in questo ambiente');
    }
});

export { analytics };

// Configurazione ambiente sviluppo
const isDevelopment = process.env.NODE_ENV === 'development';
const useEmulators = process.env.REACT_APP_USE_FIREBASE_EMULATORS === 'true';

if (isDevelopment && useEmulators) {
    console.log('🔧 Connessione agli emulatori Firebase...');
    
    // Connessione agli emulatori solo se non già connessi
    if (!auth._delegate._config?.emulator) {
        connectAuthEmulator(auth, 'http://localhost:9099');
    }
    
    if (!db._delegate._databaseId?.database.includes('localhost')) {
        connectFirestoreEmulator(db, 'localhost', 8080);
    }
    
    if (!storage._delegate._host.includes('localhost')) {
        connectStorageEmulator(storage, 'localhost', 9199);
    }
    
    console.log('✅ Emulatori Firebase connessi');
}

// Utility per gestione connessione
export const connectionManager = {
    enable: () => enableNetwork(db),
    disable: () => disableNetwork(db),
    
    // Controlla stato connessione
    checkConnection: async () => {
        try {
            await enableNetwork(db);
            return true;
        } catch (error) {
            console.error('❌ Errore connessione Firebase:', error);
            return false;
        }
    }
};

// Configurazioni ottimizzate per performance
export const firestoreSettings = {
    cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
    experimentalForceLongPolling: false, // Usa WebSocket quando possibile
    merge: true, // Abilita merge automatico
    ignoreUndefinedProperties: true // Ignora proprietà undefined
};

// Helper per logging strutturato
export const logger = {
    info: (message, data = null) => {
        console.log(`ℹ️ [Firebase] ${message}`, data || '');
    },
    
    error: (message, error = null) => {
        console.error(`❌ [Firebase] ${message}`, error || '');
    },
    
    warn: (message, data = null) => {
        console.warn(`⚠️ [Firebase] ${message}`, data || '');
    },
    
    success: (message, data = null) => {
        console.log(`✅ [Firebase] ${message}`, data || '');
    }
};

// Export dell'app per usi avanzati
export default app;

logger.success('Firebase configurato con successo');