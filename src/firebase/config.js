// 🚨 FIREBASE COMPLETAMENTE RIMOSSO
// NESSUN IMPORT FIREBASE - SOLO MOCK

console.log('🚫 Firebase COMPLETAMENTE DISABILITATO');

// Export solo null per evitare errori di import
export const auth = null;
export const db = null;
export const storage = null;
export const analytics = null;

export const connectionManager = {
    enable: () => Promise.resolve(),
    disable: () => Promise.resolve(),
    checkConnection: () => Promise.resolve(true)
};

export const logger = {
    info: (msg) => console.log(`ℹ️ ${msg}`),
    error: (msg) => console.error(`❌ ${msg}`),
    warn: (msg) => console.warn(`⚠️ ${msg}`),
    success: (msg) => console.log(`✅ ${msg}`)
};

export default null;

console.log('✅ App configurata SENZA Firebase - SOLO localStorage');