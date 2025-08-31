// Simplified Recovery Timer - Debug version
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const SimpleRecoveryTimer = () => {
    const { user } = useAuth();
    const [selectedActivity, setSelectedActivity] = useState('sauna');
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0);
    const [targetDuration, setTargetDuration] = useState(15);

    const ACTIVITIES = {
        sauna: { name: '🔥 Sauna', temp: '80°C', duration: '15 min' },
        ice_bath: { name: '🧊 Ice Bath', temp: '12°C', duration: '3 min' },
        cold_shower: { name: '🚿 Doccia Fredda', temp: '15°C', duration: '2 min' },
        meditation: { name: '🧘 Meditazione', temp: 'Ambiente', duration: '10 min' },
        stretching: { name: '🤸 Stretching', temp: 'Ambiente', duration: '20 min' },
        steam_bath: { name: '💨 Bagno Turco', temp: '45°C', duration: '20 min' }
    };

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        const targetSeconds = targetDuration * 60;
        return Math.min((time / targetSeconds) * 100, 100);
    };

    if (!user) {
        return (
            <div className="recovery-timer">
                <div className="auth-required">
                    <h2>🔐 Login Richiesto</h2>
                    <p>Effettua il login per usare il recovery timer</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recovery-timer">
            <div className="recovery-header">
                <h2>🔥 Recovery Timer</h2>
                <p>Timer professionale per pratiche di recupero</p>
            </div>

            {/* Selezione attività */}
            <div className="activity-selection">
                <h3>🎯 Seleziona Pratica</h3>
                <div className="activity-grid">
                    {Object.keys(ACTIVITIES).map(key => (
                        <button
                            key={key}
                            className={`activity-btn ${selectedActivity === key ? 'active' : ''}`}
                            onClick={() => setSelectedActivity(key)}
                            disabled={isRunning}
                        >
                            <span className="activity-icon">{ACTIVITIES[key].name.split(' ')[0]}</span>
                            <span className="activity-name">{ACTIVITIES[key].name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info attività */}
            <div className="activity-info">
                <h3>{ACTIVITIES[selectedActivity].name}</h3>
                <div className="activity-specs">
                    <span>🌡️ <strong>Temperatura:</strong> {ACTIVITIES[selectedActivity].temp}</span>
                    <span>⏰ <strong>Durata:</strong> {ACTIVITIES[selectedActivity].duration}</span>
                </div>
            </div>

            {/* Configurazione */}
            <div className="session-config">
                <div className="config-row">
                    <div className="config-item">
                        <label>⏰ Durata Target (minuti)</label>
                        <input
                            type="number"
                            value={targetDuration}
                            onChange={(e) => setTargetDuration(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            max="60"
                            disabled={isRunning}
                        />
                    </div>
                </div>
            </div>

            {/* Timer */}
            <div className="main-timer">
                <div className="timer-display">
                    <div className="time-text">{formatTime(time)}</div>
                    <div className="target-time">Target: {targetDuration}:00</div>
                </div>
                
                <div className="progress-ring">
                    <div 
                        className="progress-fill"
                        style={{ 
                            background: `conic-gradient(#ef4444 ${getProgressPercentage() * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                        }}
                    >
                        <div className="progress-percentage">
                            {Math.round(getProgressPercentage())}%
                        </div>
                    </div>
                </div>
                
                <div className="timer-controls">
                    <button 
                        className={`timer-btn ${isRunning ? 'pause' : 'start'}`}
                        onClick={() => setIsRunning(!isRunning)}
                    >
                        {isRunning ? '⏸️ Pausa' : '▶️ Inizia'}
                    </button>
                    
                    <button 
                        className="timer-btn reset"
                        onClick={() => {
                            setIsRunning(false);
                            setTime(0);
                        }}
                    >
                        🔄 Reset
                    </button>
                </div>
            </div>

            <div style={{padding: '20px', textAlign: 'center', marginTop: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px'}}>
                <p style={{color: '#ef4444'}}>
                    ✅ <strong>Recovery Timer Funzionale!</strong><br/>
                    Seleziona pratica e usa il timer.<br/>
                    Questa è la versione semplificata di debug.
                </p>
            </div>
        </div>
    );
};

export default SimpleRecoveryTimer;