// Migration Modal - Data Migration Interface
// Modale per guidare l'utente nella migrazione dei dati da localStorage a Firebase

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { logger } from '../firebase/config';

const MigrationModal = () => {
    const { startMigration, skipMigration, migrationStatus } = useAuth();
    const [showDetails, setShowDetails] = useState(false);
    const [migrationReport, setMigrationReport] = useState(null);

    // Avvia processo migrazione
    const handleStartMigration = async () => {
        try {
            logger.info('Avvio migrazione dati utente...');
            const result = await startMigration();
            
            if (result.success) {
                setMigrationReport(result.report);
                logger.success('Migrazione completata con successo');
            } else {
                setMigrationReport(result.report || { success: false, errors: [result.error] });
                logger.error('Migrazione fallita', result.error);
            }
            
        } catch (error) {
            logger.error('Errore durante migrazione', error);
            setMigrationReport({ 
                success: false, 
                errors: [error.message || 'Errore imprevisto durante la migrazione'] 
            });
        }
    };

    // Skip migrazione
    const handleSkipMigration = () => {
        const confirmed = window.confirm(
            'Sei sicuro di voler saltare la migrazione?\n\n' +
            'I tuoi dati locali rimarranno solo su questo dispositivo e potrebbero andare persi. ' +
            'Potrai sempre migrare in seguito dalle impostazioni.'
        );
        
        if (confirmed) {
            skipMigration();
            logger.info('Migrazione saltata dall\'utente');
        }
    };

    // Mostra progress migrazione
    if (migrationStatus.inProgress) {
        return (
            <div className="migration-modal-overlay">
                <div className="migration-modal">
                    <div className="migration-header">
                        <h2>🔄 Migrazione in Corso</h2>
                        <p>Stiamo trasferendo i tuoi dati al cloud...</p>
                    </div>

                    <div className="migration-progress">
                        <div className="progress-spinner">
                            <div className="spinner-large"></div>
                        </div>
                        
                        <div className="progress-steps">
                            <div className="progress-step completed">
                                ✅ Backup dati locali
                            </div>
                            <div className="progress-step active">
                                🔄 Trasferimento al cloud
                            </div>
                            <div className="progress-step">
                                📊 Verifica integrità
                            </div>
                            <div className="progress-step">
                                ✨ Finalizzazione
                            </div>
                        </div>
                    </div>

                    <div className="migration-info">
                        <p>⏱️ <strong>Questo processo può richiedere qualche minuto</strong></p>
                        <p>🔐 I tuoi dati sono al sicuro durante il trasferimento</p>
                        <p>📱 Non chiudere questa finestra fino al completamento</p>
                    </div>
                </div>
            </div>
        );
    }

    // Mostra risultato migrazione
    if (migrationReport) {
        const isSuccess = migrationReport.success && (!migrationReport.errors || migrationReport.errors.length === 0);
        
        return (
            <div className="migration-modal-overlay">
                <div className="migration-modal">
                    <div className="migration-header">
                        <h2>{isSuccess ? '✅ Migrazione Completata!' : '⚠️ Migrazione Completata con Avvisi'}</h2>
                        <p>
                            {isSuccess 
                                ? 'I tuoi dati sono stati trasferiti con successo al cloud!'
                                : 'La migrazione è stata completata ma ci sono alcuni avvisi da verificare.'
                            }
                        </p>
                    </div>

                    <div className="migration-results">
                        <div className="results-summary">
                            <div className="result-stat">
                                <span className="stat-value">{migrationReport.migratedItems || 0}</span>
                                <span className="stat-label">Elementi Migrati</span>
                            </div>
                            <div className="result-stat">
                                <span className="stat-value">{migrationReport.totalItems || 0}</span>
                                <span className="stat-label">Totale Elementi</span>
                            </div>
                            <div className="result-stat">
                                <span className="stat-value">{migrationReport.errors?.length || 0}</span>
                                <span className="stat-label">Errori</span>
                            </div>
                        </div>

                        {/* Mostra errori se presenti */}
                        {migrationReport.errors && migrationReport.errors.length > 0 && (
                            <div className="migration-errors">
                                <h4>⚠️ Avvisi e Errori:</h4>
                                <ul>
                                    {migrationReport.errors.slice(0, 5).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                                {migrationReport.errors.length > 5 && (
                                    <p><em>... e altri {migrationReport.errors.length - 5} avvisi</em></p>
                                )}
                            </div>
                        )}

                        {/* Toggle dettagli */}
                        <button 
                            className="toggle-details"
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? '📄 Nascondi Dettagli' : '📄 Mostra Dettagli'}
                        </button>

                        {showDetails && (
                            <div className="migration-details">
                                <h4>📋 Dettagli Migrazione:</h4>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <strong>Inizio:</strong> {migrationReport.startTime ? new Date(migrationReport.startTime).toLocaleString() : 'N/A'}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Fine:</strong> {migrationReport.endTime ? new Date(migrationReport.endTime).toLocaleString() : 'N/A'}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Verifica Integrità:</strong> {migrationReport.verificationPassed ? '✅ Superata' : '❌ Fallita'}
                                    </div>
                                </div>

                                {migrationReport.steps && (
                                    <div className="migration-steps-log">
                                        <h5>Passaggi Eseguiti:</h5>
                                        <ul>
                                            {migrationReport.steps.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="migration-actions">
                        <button 
                            className="btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            ✨ Continua nell'App
                        </button>
                    </div>

                    <div className="migration-footer">
                        <p>
                            🎉 <strong>Congratulazioni!</strong> I tuoi dati sono ora sincronizzati nel cloud.<br/>
                            💾 Hai accesso automatico ai backup e alla sincronizzazione multi-dispositivo.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Modale iniziale - richiede conferma migrazione
    return (
        <div className="migration-modal-overlay">
            <div className="migration-modal">
                <div className="migration-header">
                    <h2>🚀 Benvenuto nel Cloud!</h2>
                    <p>Abbiamo rilevato dei dati fitness salvati localmente sul tuo dispositivo.</p>
                </div>

                <div className="migration-benefits">
                    <h3>✨ Vantaggi della Migrazione:</h3>
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <span className="benefit-icon">☁️</span>
                            <div>
                                <strong>Backup Automatico</strong>
                                <p>I tuoi dati sono sempre al sicuro</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">📱</span>
                            <div>
                                <strong>Multi-Dispositivo</strong>
                                <p>Accedi da qualsiasi dispositivo</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">📊</span>
                            <div>
                                <strong>Analytics Avanzati</strong>
                                <p>Grafici e insights automatici</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <span className="benefit-icon">⚡</span>
                            <div>
                                <strong>Performance</strong>
                                <p>Caricamento più veloce</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="migration-info">
                    <h4>📋 Cosa verrà migrato:</h4>
                    <ul>
                        <li>📈 <strong>Progressi fisici</strong> - Peso, misure, composizione corporea</li>
                        <li>💪 <strong>Allenamenti</strong> - Sessioni, esercizi, performance</li>
                        <li>⏱️ <strong>Statistiche</strong> - Tempo investito, streak, obiettivi</li>
                        <li>⚙️ <strong>Impostazioni</strong> - Preferenze e configurazioni</li>
                    </ul>
                </div>

                <div className="migration-actions">
                    <button 
                        className="btn-primary btn-migration"
                        onClick={handleStartMigration}
                        disabled={migrationStatus.inProgress}
                    >
                        🚀 Inizia Migrazione
                    </button>
                    
                    <button 
                        className="btn-secondary"
                        onClick={handleSkipMigration}
                        disabled={migrationStatus.inProgress}
                    >
                        ⏭️ Salta per Ora
                    </button>
                </div>

                <div className="migration-footer">
                    <p className="migration-disclaimer">
                        🔐 <strong>Privacy e Sicurezza:</strong> I tuoi dati sono criptati e protetti da Firebase.<br/>
                        ⚡ <strong>Veloce:</strong> Il processo richiede solo pochi minuti.<br/>
                        🔄 <strong>Reversibile:</strong> Puoi sempre ripristinare i dati locali se necessario.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MigrationModal;