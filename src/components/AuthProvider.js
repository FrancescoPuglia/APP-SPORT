// AuthProvider - Context Provider per gestione autenticazione
// Wrapper completo per gestire stato auth in tutta l'applicazione

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../firebase/auth';
import migrationService from '../firebase/migration';
import { logger } from '../firebase/config';

// Context per l'autenticazione
const AuthContext = createContext({});

// Hook per utilizzare il context auth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve essere utilizzato all\'interno di AuthProvider');
    }
    return context;
};

// Provider componente principale
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [migrationStatus, setMigrationStatus] = useState({
        isRequired: false,
        inProgress: false,
        completed: false
    });

    // Inizializza listener auth state
    useEffect(() => {
        logger.info('Inizializzazione AuthProvider...');

        const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
            setLoading(true);
            setError(null);

            try {
                if (firebaseUser) {
                    logger.success('Utente autenticato', { 
                        uid: firebaseUser.uid, 
                        email: firebaseUser.email 
                    });
                    
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        emailVerified: firebaseUser.emailVerified,
                        isAnonymous: firebaseUser.isAnonymous,
                        createdAt: firebaseUser.metadata.creationTime,
                        lastLoginAt: firebaseUser.metadata.lastSignInTime
                    });

                    // Controlla se serve migrazione dati
                    await checkMigrationRequired();

                } else {
                    logger.info('Utente non autenticato');
                    setUser(null);
                    setMigrationStatus({
                        isRequired: false,
                        inProgress: false,
                        completed: false
                    });
                }
            } catch (error) {
                logger.error('Errore gestione auth state', error);
                setError('Errore durante l\'autenticazione. Riprova.');
            } finally {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    // Controlla se è necessaria la migrazione
    const checkMigrationRequired = async () => {
        try {
            const migrationStatusData = migrationService.getMigrationStatus();
            
            // Controlla se ci sono dati localStorage da migrare
            const hasLocalData = (
                localStorage.getItem('progressData') ||
                localStorage.getItem('workoutSessions') ||
                localStorage.getItem('exerciseData')
            );

            const isRequired = hasLocalData && !migrationStatusData.isCompleted;

            setMigrationStatus({
                isRequired,
                inProgress: false,
                completed: migrationStatusData.isCompleted,
                details: migrationStatusData
            });

            logger.info('Status migrazione controllato', { 
                isRequired, 
                hasLocalData,
                completed: migrationStatusData.isCompleted 
            });

        } catch (error) {
            logger.error('Errore controllo migrazione', error);
        }
    };

    // Funzioni di autenticazione con error handling

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.signInWithEmail(email, password);
            
            if (!result.success) {
                setError(result.error.message);
                return { success: false, error: result.error };
            }

            logger.success('Login completato');
            return { success: true, user: result.user };

        } catch (error) {
            const errorMessage = 'Errore durante il login. Riprova.';
            logger.error('Errore login wrapper', error);
            setError(errorMessage);
            return { success: false, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, displayName = null) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.signUpWithEmail(email, password, displayName);
            
            if (!result.success) {
                setError(result.error.message);
                return { success: false, error: result.error };
            }

            logger.success('Registrazione completata');
            return { success: true, user: result.user };

        } catch (error) {
            const errorMessage = 'Errore durante la registrazione. Riprova.';
            logger.error('Errore registrazione wrapper', error);
            setError(errorMessage);
            return { success: false, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.signInWithGoogle();
            
            if (!result.success) {
                setError(result.error.message);
                return { success: false, error: result.error };
            }

            logger.success('Login Google completato');
            return { success: true, user: result.user };

        } catch (error) {
            const errorMessage = 'Errore durante il login con Google. Riprova.';
            logger.error('Errore Google login wrapper', error);
            setError(errorMessage);
            return { success: false, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.signOutUser();
            
            if (!result.success) {
                setError(result.error.message);
                return { success: false, error: result.error };
            }

            logger.success('Logout completato');
            return { success: true };

        } catch (error) {
            const errorMessage = 'Errore durante il logout. Riprova.';
            logger.error('Errore logout wrapper', error);
            setError(errorMessage);
            return { success: false, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        setLoading(true);
        setError(null);

        try {
            const result = await authService.resetPassword(email);
            
            if (!result.success) {
                setError(result.error.message);
                return { success: false, error: result.error };
            }

            logger.success('Email reset password inviata');
            return { success: true };

        } catch (error) {
            const errorMessage = 'Errore invio email reset. Riprova.';
            logger.error('Errore reset password wrapper', error);
            setError(errorMessage);
            return { success: false, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    // Gestione migrazione dati
    const startMigration = async () => {
        if (!user || migrationStatus.inProgress) {
            return { success: false, error: 'Migrazione non possibile al momento' };
        }

        setMigrationStatus(prev => ({ ...prev, inProgress: true }));

        try {
            logger.info('Avvio migrazione dati...');
            const result = await migrationService.migrateAllData();

            if (result.success) {
                setMigrationStatus({
                    isRequired: false,
                    inProgress: false,
                    completed: true,
                    report: result.report
                });
                logger.success('Migrazione completata con successo');
                return { success: true, report: result.report };
            } else {
                setMigrationStatus(prev => ({ ...prev, inProgress: false }));
                setError('Errore durante la migrazione dati');
                return { success: false, error: result.error, report: result.report };
            }

        } catch (error) {
            logger.error('Errore migrazione wrapper', error);
            setMigrationStatus(prev => ({ ...prev, inProgress: false }));
            setError('Errore imprevisto durante la migrazione');
            return { success: false, error: error.message };
        }
    };

    const skipMigration = () => {
        setMigrationStatus({
            isRequired: false,
            inProgress: false,
            completed: false,
            skipped: true
        });
        logger.info('Migrazione saltata dall\'utente');
    };

    // Utility functions
    const isAuthenticated = () => !!user;
    
    const hasRole = (role) => {
        // Implementazione futura per ruoli utente
        return user?.customClaims?.[role] || false;
    };

    const clearError = () => setError(null);

    // Context value
    const contextValue = {
        // Stato auth
        user,
        loading,
        error,
        migrationStatus,

        // Funzioni auth
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,

        // Migrazione
        startMigration,
        skipMigration,

        // Utility
        isAuthenticated,
        hasRole,
        clearError,
        
        // Servizi diretti (per casi avanzati)
        authService,
        migrationService
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook specializzati per casi d'uso comuni

// Hook per proteggere componenti (richiede autenticazione)
export const useRequireAuth = (redirectTo = '/login') => {
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (!loading && !user && window.location.pathname !== redirectTo) {
            window.location.href = redirectTo;
        }
    }, [user, loading, redirectTo]);

    return { user, loading, isAuthenticated: !!user };
};

// Hook per redirect dopo login
export const useAuthRedirect = (redirectTo = '/') => {
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (!loading && user && window.location.pathname === '/login') {
            window.location.href = redirectTo;
        }
    }, [user, loading, redirectTo]);

    return { user, loading };
};

// HOC per proteggere componenti
export const withAuth = (Component, requireAuth = true) => {
    return function AuthenticatedComponent(props) {
        const { user, loading } = useAuth();
        
        if (loading) {
            return (
                <div className="auth-loading">
                    <div className="loading-spinner">Caricamento...</div>
                </div>
            );
        }
        
        if (requireAuth && !user) {
            return (
                <div className="auth-required">
                    <h2>Accesso Richiesto</h2>
                    <p>Devi effettuare il login per accedere a questa sezione.</p>
                    <button onClick={() => window.location.href = '/login'}>
                        Vai al Login
                    </button>
                </div>
            );
        }
        
        return <Component {...props} />;
    };
};

export default AuthProvider;