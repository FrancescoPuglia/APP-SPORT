import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import Dashboard from './components/Dashboard';
import Workout from './components/Workout';
import Nutrition from './components/Nutrition';
import Supplements from './components/Supplements';
import Recovery from './components/Recovery';
import Progress from './components/Progress';
import AuthModal from './components/AuthModal';
import MigrationModal from './components/MigrationModal';
import './styles/main.css';

// Lazy loading per componenti pesanti
const LazyAnalytics = lazy(() => import('./components/AdvancedAnalytics'));
const LazyNutritionTracker = lazy(() => import('./components/SimpleNutritionTracker'));
const LazyRecoveryTimer = lazy(() => import('./components/SimpleRecoveryTimer'));

// Componente principale con gestione auth e routing
function AppContent() {
    const { user, loading, error, migrationStatus } = useAuth();

    // Loading spinner durante inizializzazione
    if (loading) {
        return (
            <div className="app-loading">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h2>🏋️ Extraordinary Growth</h2>
                    <p>Caricamento in corso...</p>
                </div>
            </div>
        );
    }

    // Mostra errore se presente
    if (error) {
        return (
            <div className="app-error">
                <div className="error-container">
                    <h2>⚠️ Errore</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        Ricarica Pagina
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                {/* Modale autenticazione se utente non loggato */}
                {!user && <AuthModal />}
                
                {/* Modale migrazione se necessaria */}
                {user && migrationStatus.isRequired && <MigrationModal />}
                
                {/* Routing principale */}
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workout" element={<Workout />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/supplements" element={<Supplements />} />
                    <Route path="/recovery" element={<Recovery />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/analytics" element={
                        <Suspense fallback={<div className="loading-analytics">Caricamento Analytics...</div>}>
                            <LazyAnalytics />
                        </Suspense>
                    } />
                    <Route path="/nutrition-tracker" element={
                        <Suspense fallback={<div className="loading-nutrition">Caricamento Nutrition Tracker...</div>}>
                            <LazyNutritionTracker />
                        </Suspense>
                    } />
                    <Route path="/recovery-timer" element={
                        <Suspense fallback={<div className="loading-recovery">Caricamento Recovery Timer...</div>}>
                            <LazyRecoveryTimer />
                        </Suspense>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

// App wrapper con AuthProvider
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;