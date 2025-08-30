// Authentication Modal - Login/Register Interface
// Modale completa per gestire login, registrazione e reset password

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { validateWithSchema, loginSchema, registrationSchema, resetPasswordSchema } from '../validation/schemas';
import { logger } from '../firebase/config';

const AuthModal = () => {
    const { login, register, loginWithGoogle, resetPassword, error, loading, clearError } = useAuth();
    
    const [mode, setMode] = useState('login'); // 'login', 'register', 'reset'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        acceptTerms: false
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Reset form quando cambia modalità
    const changeMode = (newMode) => {
        setMode(newMode);
        setFormData({
            email: formData.email, // Mantieni email
            password: '',
            confirmPassword: '',
            displayName: '',
            acceptTerms: false
        });
        setValidationErrors({});
        setSuccessMessage('');
        clearError();
    };

    // Aggiorna campi form
    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Rimuovi errore di validazione per questo campo
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validazione form
    const validateForm = async () => {
        let schema;
        let dataToValidate = formData;

        switch (mode) {
            case 'login':
                schema = loginSchema;
                dataToValidate = {
                    email: formData.email,
                    password: formData.password
                };
                break;
            case 'register':
                schema = registrationSchema;
                break;
            case 'reset':
                schema = resetPasswordSchema;
                dataToValidate = { email: formData.email };
                break;
            default:
                return { isValid: false, errors: { general: 'Modalità non valida' } };
        }

        const validation = await validateWithSchema(schema, dataToValidate);
        setValidationErrors(validation.errors);
        
        return validation;
    };

    // Handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting || loading) return;

        // Valida form
        const validation = await validateForm();
        if (!validation.isValid) {
            logger.warn('Validazione form fallita', validation.errors);
            return;
        }

        setIsSubmitting(true);
        clearError();
        setSuccessMessage('');

        try {
            let result;

            switch (mode) {
                case 'login':
                    logger.info('Tentativo login...');
                    result = await login(formData.email, formData.password);
                    break;

                case 'register':
                    logger.info('Tentativo registrazione...');
                    result = await register(formData.email, formData.password, formData.displayName);
                    break;

                case 'reset':
                    logger.info('Tentativo reset password...');
                    result = await resetPassword(formData.email);
                    if (result.success) {
                        setSuccessMessage('Email di reset inviata! Controlla la tua casella di posta.');
                        setTimeout(() => changeMode('login'), 3000);
                    }
                    break;

                default:
                    throw new Error('Modalità non supportata');
            }

            if (result && result.success) {
                logger.success(`${mode} completato con successo`);
                // Il modale si chiuderà automaticamente quando user state cambia
            }

        } catch (error) {
            logger.error(`Errore ${mode}`, error);
            setValidationErrors({ general: error.message || 'Errore imprevisto' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        if (isSubmitting || loading) return;

        setIsSubmitting(true);
        clearError();

        try {
            logger.info('Tentativo login Google...');
            const result = await loginWithGoogle();
            
            if (result.success) {
                logger.success('Login Google completato');
            }
        } catch (error) {
            logger.error('Errore Google login', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal">
                <div className="auth-header">
                    <h2>🏆 Extraordinary Growth</h2>
                    <p className="auth-tagline">
                        {mode === 'login' && 'Bentornato! Accedi al tuo account'}
                        {mode === 'register' && 'Inizia il tuo percorso di crescita'}
                        {mode === 'reset' && 'Recupera il tuo account'}
                    </p>
                </div>

                {/* Messaggio di successo */}
                {successMessage && (
                    <div className="success-message">
                        ✅ {successMessage}
                    </div>
                )}

                {/* Errori generali */}
                {(error || validationErrors.general) && (
                    <div className="error-message">
                        ⚠️ {error || validationErrors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Campo Email (sempre presente) */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            className={validationErrors.email ? 'error' : ''}
                            placeholder="la.tua@email.com"
                            disabled={isSubmitting}
                            required
                        />
                        {validationErrors.email && (
                            <span className="field-error">{validationErrors.email}</span>
                        )}
                    </div>

                    {/* Campo Password (login e register) */}
                    {mode !== 'reset' && (
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                className={validationErrors.password ? 'error' : ''}
                                placeholder="La tua password sicura"
                                disabled={isSubmitting}
                                required
                            />
                            {validationErrors.password && (
                                <span className="field-error">{validationErrors.password}</span>
                            )}
                        </div>
                    )}

                    {/* Campi extra per registrazione */}
                    {mode === 'register' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Conferma Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                                    className={validationErrors.confirmPassword ? 'error' : ''}
                                    placeholder="Ripeti la password"
                                    disabled={isSubmitting}
                                    required
                                />
                                {validationErrors.confirmPassword && (
                                    <span className="field-error">{validationErrors.confirmPassword}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="displayName">Nome (opzionale)</label>
                                <input
                                    id="displayName"
                                    type="text"
                                    value={formData.displayName}
                                    onChange={(e) => updateField('displayName', e.target.value)}
                                    className={validationErrors.displayName ? 'error' : ''}
                                    placeholder="Il tuo nome"
                                    disabled={isSubmitting}
                                />
                                {validationErrors.displayName && (
                                    <span className="field-error">{validationErrors.displayName}</span>
                                )}
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => updateField('acceptTerms', e.target.checked)}
                                        disabled={isSubmitting}
                                        required
                                    />
                                    <span className="checkmark"></span>
                                    Accetto i <a href="#terms" target="_blank">Termini di Servizio</a> e la <a href="#privacy" target="_blank">Privacy Policy</a>
                                </label>
                                {validationErrors.acceptTerms && (
                                    <span className="field-error">{validationErrors.acceptTerms}</span>
                                )}
                            </div>
                        </>
                    )}

                    {/* Pulsante submit principale */}
                    <button 
                        type="submit" 
                        className="btn-primary btn-auth"
                        disabled={isSubmitting || loading}
                    >
                        {isSubmitting || loading ? (
                            <span className="loading-inline">
                                <span className="spinner-small"></span>
                                {mode === 'login' && 'Accesso...'}
                                {mode === 'register' && 'Registrazione...'}
                                {mode === 'reset' && 'Invio...'}
                            </span>
                        ) : (
                            <>
                                {mode === 'login' && '🚀 Accedi'}
                                {mode === 'register' && '✨ Registrati'}
                                {mode === 'reset' && '📧 Invia Reset'}
                            </>
                        )}
                    </button>

                    {/* Google login (solo per login e register) */}
                    {mode !== 'reset' && (
                        <>
                            <div className="auth-divider">
                                <span>oppure</span>
                            </div>

                            <button 
                                type="button"
                                onClick={handleGoogleLogin}
                                className="btn-google"
                                disabled={isSubmitting || loading}
                            >
                                <span className="google-icon">🔍</span>
                                Continua con Google
                            </button>
                        </>
                    )}
                </form>

                {/* Link cambio modalità */}
                <div className="auth-links">
                    {mode === 'login' && (
                        <>
                            <p>
                                Non hai un account?{' '}
                                <button 
                                    type="button" 
                                    className="link-button"
                                    onClick={() => changeMode('register')}
                                    disabled={isSubmitting}
                                >
                                    Registrati qui
                                </button>
                            </p>
                            <p>
                                <button 
                                    type="button" 
                                    className="link-button"
                                    onClick={() => changeMode('reset')}
                                    disabled={isSubmitting}
                                >
                                    Password dimenticata?
                                </button>
                            </p>
                        </>
                    )}

                    {mode === 'register' && (
                        <p>
                            Hai già un account?{' '}
                            <button 
                                type="button" 
                                className="link-button"
                                onClick={() => changeMode('login')}
                                disabled={isSubmitting}
                            >
                                Accedi qui
                            </button>
                        </p>
                    )}

                    {mode === 'reset' && (
                        <p>
                            Ricordi la password?{' '}
                            <button 
                                type="button" 
                                className="link-button"
                                onClick={() => changeMode('login')}
                                disabled={isSubmitting}
                            >
                                Torna al login
                            </button>
                        </p>
                    )}
                </div>

                {/* Info app */}
                <div className="auth-footer">
                    <p className="app-info">
                        🔐 I tuoi dati sono protetti con Firebase Authentication.<br/>
                        💪 Inizia oggi il tuo percorso verso il <strong>Fisico della Madonna</strong>!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;