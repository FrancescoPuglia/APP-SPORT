import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider, useAuth } from './components/AuthProvider';
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

// Componente principale senza autenticazione
function AppContent() {

    return (
        <Router>
            <div className="App">
                {/* Autenticazione disabilitata per uso locale */}
                
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

// App wrapper senza autenticazione
function App() {
    return <AppContent />;
}

export default App;