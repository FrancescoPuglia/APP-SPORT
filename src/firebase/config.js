// 🚨 FIREBASE DISABILITATO PER FIX EMERGENZA
// Firebase stava causando errori 400 che bloccavano tutto

console.log('🚫 Firebase DISABILITATO per fix emergenza');
console.log('📱 App funziona solo con localStorage');

// Mock Firebase objects per evitare errori
export const auth = null;
export const db = null;
export const storage = null;
export const analytics = null;

const app = null;

// Mock connectionManager per evitare errori
export const connectionManager = {
    enable: () => Promise.resolve(),
    disable: () => Promise.resolve(),
    checkConnection: () => Promise.resolve(true)
};

// Mock logger
export const logger = {
    info: (message) => console.log(`ℹ️ [App] ${message}`),
    error: (message) => console.error(`❌ [App] ${message}`),
    warn: (message) => console.warn(`⚠️ [App] ${message}`),
    success: (message) => console.log(`✅ [App] ${message}`)
};

export default app;

logger.success('App configurata per localStorage only');