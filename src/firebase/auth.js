// Firebase Authentication Service - Enterprise Grade
// Gestione completa autenticazione con error handling avanzato

import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider
} from 'firebase/auth';

import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, logger } from './config';

// Provider Google configurato
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Classe per gestire l'autenticazione
class AuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.initializeAuthListener();
    }

    // Inizializza listener per cambio stato auth
    initializeAuthListener() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.notifyAuthStateListeners(user);
            
            if (user) {
                logger.success('Utente autenticato', { 
                    uid: user.uid, 
                    email: user.email,
                    displayName: user.displayName 
                });
                this.updateUserLastSeen(user);
            } else {
                logger.info('Utente disconnesso');
            }
        });
    }

    // Registra listener per cambio stato
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        
        // Rimuovi listener
        return () => {
            this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
        };
    }

    // Notifica tutti i listener del cambio stato
    notifyAuthStateListeners(user) {
        this.authStateListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                logger.error('Errore nel listener auth state', error);
            }
        });
    }

    // Login con email e password
    async signInWithEmail(email, password) {
        try {
            logger.info('Tentativo login con email...');
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await this.updateUserLastSeen(user);
            logger.success('Login completato', { uid: user.uid });
            
            return { success: true, user, error: null };
            
        } catch (error) {
            logger.error('Errore login email', error);
            return { 
                success: false, 
                user: null, 
                error: this.handleAuthError(error) 
            };
        }
    }

    // Registrazione con email e password
    async signUpWithEmail(email, password, displayName = null) {
        try {
            logger.info('Tentativo registrazione con email...');
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Aggiorna profilo se fornito displayName
            if (displayName) {
                await updateProfile(user, { displayName });
            }
            
            // Crea documento utente in Firestore
            await this.createUserDocument(user, { displayName });
            
            logger.success('Registrazione completata', { uid: user.uid });
            
            return { success: true, user, error: null };
            
        } catch (error) {
            logger.error('Errore registrazione email', error);
            return { 
                success: false, 
                user: null, 
                error: this.handleAuthError(error) 
            };
        }
    }

    // Login con Google
    async signInWithGoogle() {
        try {
            logger.info('Tentativo login con Google...');
            
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            
            // Crea o aggiorna documento utente
            await this.createUserDocument(user, {
                displayName: user.displayName,
                photoURL: user.photoURL,
                provider: 'google'
            });
            
            logger.success('Login Google completato', { uid: user.uid });
            
            return { success: true, user, error: null };
            
        } catch (error) {
            logger.error('Errore login Google', error);
            return { 
                success: false, 
                user: null, 
                error: this.handleAuthError(error) 
            };
        }
    }

    // Logout
    async signOutUser() {
        try {
            logger.info('Logout utente...');
            await signOut(auth);
            logger.success('Logout completato');
            return { success: true, error: null };
            
        } catch (error) {
            logger.error('Errore logout', error);
            return { success: false, error: this.handleAuthError(error) };
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            logger.info('Invio reset password...');
            await sendPasswordResetEmail(auth, email);
            logger.success('Email reset password inviata');
            return { success: true, error: null };
            
        } catch (error) {
            logger.error('Errore reset password', error);
            return { success: false, error: this.handleAuthError(error) };
        }
    }

    // Aggiorna password (richiede riautenticazione recente)
    async updateUserPassword(currentPassword, newPassword) {
        try {
            if (!this.currentUser) {
                throw new Error('Nessun utente autenticato');
            }

            logger.info('Aggiornamento password...');
            
            // Riautentica utente
            const credential = EmailAuthProvider.credential(
                this.currentUser.email,
                currentPassword
            );
            await reauthenticateWithCredential(this.currentUser, credential);
            
            // Aggiorna password
            await updatePassword(this.currentUser, newPassword);
            
            logger.success('Password aggiornata');
            return { success: true, error: null };
            
        } catch (error) {
            logger.error('Errore aggiornamento password', error);
            return { success: false, error: this.handleAuthError(error) };
        }
    }

    // Crea documento utente in Firestore
    async createUserDocument(user, additionalData = {}) {
        if (!user) return;
        
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (!userDoc.exists()) {
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || additionalData.displayName || 'Utente',
                    photoURL: user.photoURL || additionalData.photoURL || null,
                    provider: additionalData.provider || 'email',
                    createdAt: serverTimestamp(),
                    lastSeen: serverTimestamp(),
                    settings: {
                        units: 'metric', // metric/imperial
                        language: 'it',
                        notifications: true,
                        darkMode: false
                    },
                    profile: {
                        age: null,
                        height: null,
                        activityLevel: 'moderate',
                        goals: [],
                        experience: 'beginner'
                    },
                    ...additionalData
                };
                
                await setDoc(userRef, userData);
                logger.success('Documento utente creato');
            } else {
                // Aggiorna solo lastSeen se utente esiste
                await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
                logger.info('LastSeen aggiornato');
            }
            
        } catch (error) {
            logger.error('Errore creazione documento utente', error);
        }
    }

    // Aggiorna ultimo accesso
    async updateUserLastSeen(user) {
        if (!user) return;
        
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { 
                lastSeen: serverTimestamp(),
                isOnline: true 
            }, { merge: true });
            
        } catch (error) {
            logger.error('Errore aggiornamento lastSeen', error);
        }
    }

    // Gestione errori Firebase Auth
    handleAuthError(error) {
        const errorMessages = {
            'auth/user-not-found': 'Utente non trovato. Verifica l\'email inserita.',
            'auth/wrong-password': 'Password non corretta. Riprova.',
            'auth/email-already-in-use': 'Email già registrata. Prova ad effettuare il login.',
            'auth/weak-password': 'Password troppo debole. Usa almeno 6 caratteri.',
            'auth/invalid-email': 'Email non valida. Verifica il formato.',
            'auth/user-disabled': 'Account disabilitato. Contatta l\'assistenza.',
            'auth/too-many-requests': 'Troppi tentativi. Riprova più tardi.',
            'auth/network-request-failed': 'Errore di connessione. Verifica la rete.',
            'auth/popup-closed-by-user': 'Login annullato dall\'utente.',
            'auth/cancelled-popup-request': 'Popup già aperto. Completa il login.',
            'auth/popup-blocked': 'Popup bloccato dal browser. Abilita i popup.',
            'auth/requires-recent-login': 'Operazione sensibile. Effettua nuovamente il login.'
        };

        return {
            code: error.code,
            message: errorMessages[error.code] || error.message || 'Errore sconosciuto',
            originalError: error
        };
    }

    // Utility per controllo stato
    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Elimina account (operazione irreversibile)
    async deleteAccount(password = null) {
        try {
            if (!this.currentUser) {
                throw new Error('Nessun utente autenticato');
            }

            logger.warn('Tentativo eliminazione account...');
            
            // Riautentica se password fornita
            if (password) {
                const credential = EmailAuthProvider.credential(
                    this.currentUser.email,
                    password
                );
                await reauthenticateWithCredential(this.currentUser, credential);
            }
            
            const uid = this.currentUser.uid;
            
            // Elimina account
            await deleteUser(this.currentUser);
            
            logger.warn('Account eliminato', { uid });
            return { success: true, error: null };
            
        } catch (error) {
            logger.error('Errore eliminazione account', error);
            return { success: false, error: this.handleAuthError(error) };
        }
    }
}

// Instanza singleton del servizio
const authService = new AuthService();

export default authService;

// Export delle funzioni principali per retrocompatibilità
export {
    authService,
    auth,
    GoogleAuthProvider
};