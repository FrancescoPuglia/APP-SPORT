import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recovery = () => {
    const navigate = useNavigate();
    const [activeSession, setActiveSession] = useState(null);
    const [sessionHistory, setSessionHistory] = useState(() => {
        const saved = localStorage.getItem('recoveryHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [currentTimer, setCurrentTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState('sauna');

    // PROTOCOLLI RECOVERY PROFESSIONALI
    const recoveryProtocols = {
        'sauna': {
            name: 'Sauna Finlandese',
            icon: '🔥',
            category: 'heat',
            temperature: '80-90°C',
            duration: '15-20 min',
            benefits: ['Vasodilatazione', 'Rilascio endorfine', 'Detox', 'Riduce stress'],
            difficulty: 'facile',
            equipment: 'Sauna',
            calories: 150,
            description: 'Terapia del calore per rilassamento profondo e recupero muscolare',
            instructions: [
                'Riscalda la sauna a 80-90°C',
                'Entra con asciugamano pulito',
                'Siediti rilassato per 15-20 minuti',
                'Bevi acqua frequentemente',
                'Doccia fredda finale per shock termico'
            ],
            contraindications: ['Problemi cardiaci', 'Pressione alta', 'Gravidanza']
        },
        'ice-bath': {
            name: 'Ice Bath (Crioterapia)',
            icon: '🧊',
            category: 'cold',
            temperature: '10-15°C',
            duration: '3-5 min',
            benefits: ['Riduce infiammazione', 'Accelera recovery', 'Migliora circolazione'],
            difficulty: 'difficile',
            equipment: 'Vasca + ghiaccio',
            calories: 50,
            description: 'Immersione in acqua fredda per ridurre infiammazione e accelerare il recupero',
            instructions: [
                'Riempie vasca con acqua 10-15°C',
                'Respirazione controllata prima di entrare',
                'Immersione graduale fino al petto',
                'Rimani calmo per 3-5 minuti',
                'Uscita graduale e riscaldamento naturale'
            ],
            contraindications: ['Problemi circolatori', 'Ipotermia', 'Ferite aperte']
        },
        'contrast-shower': {
            name: 'Doccia Contrastante',
            icon: '🚿',
            category: 'contrast',
            temperature: '40°C / 15°C',
            duration: '10-15 min',
            benefits: ['Migliora circolazione', 'Energizza', 'Recovery veloce'],
            difficulty: 'medio',
            equipment: 'Doccia',
            calories: 30,
            description: 'Alternanza di acqua calda e fredda per stimolare la circolazione',
            instructions: [
                '3 min acqua calda (40°C)',
                '30 sec acqua fredda (15°C)',
                'Ripeti il ciclo 3-4 volte',
                'Termina sempre con acqua fredda',
                'Asciugatura energica con asciugamano'
            ],
            contraindications: ['Pressione alta instabile']
        },
        'massage': {
            name: 'Massaggio Sportivo',
            icon: '🙌',
            category: 'manual',
            temperature: 'Ambiente',
            duration: '30-60 min',
            benefits: ['Riduce tensione', 'Migliora flessibilità', 'Rilassamento profondo'],
            difficulty: 'facile',
            equipment: 'Olio da massaggio',
            calories: 0,
            description: 'Manipolazione manuale dei tessuti molli per rilassamento muscolare',
            instructions: [
                'Usa olio da massaggio di qualità',
                'Movimenti lenti e profondi',
                'Concentrati su aree tense',
                'Pressione gradualmente crescente',
                'Termina con movimenti rilassanti'
            ],
            contraindications: ['Lesioni acute', 'Infiammazioni acute']
        },
        'stretching': {
            name: 'Stretching Profondo',
            icon: '🤸',
            category: 'movement',
            temperature: 'Ambiente',
            duration: '20-30 min',
            benefits: ['Aumenta flessibilità', 'Riduce tensione', 'Migliora mobilità'],
            difficulty: 'facile',
            equipment: 'Tappetino yoga',
            calories: 80,
            description: 'Allungamento muscolare per migliorare flessibilità e ridurre tensioni',
            instructions: [
                'Riscaldamento leggero 5 minuti',
                'Stretching statico 30 sec per gruppo muscolare',
                'Respirazione profonda durante allungamento',
                'Non forzare mai il movimento',
                'Rilassamento finale 5 minuti'
            ],
            contraindications: ['Lesioni muscolari acute']
        },
        'meditation': {
            name: 'Meditazione Mindfulness',
            icon: '🧘',
            category: 'mental',
            temperature: 'Ambiente',
            duration: '10-20 min',
            benefits: ['Riduce stress', 'Migliora focus', 'Equilibrio mentale'],
            difficulty: 'medio',
            equipment: 'Silenzio',
            calories: 0,
            description: 'Pratica di consapevolezza per recupero mentale e riduzione dello stress',
            instructions: [
                'Trova posizione comoda e silenziosa',
                'Chiudi gli occhi e respira naturalmente',
                'Concentrati sul respiro',
                'Osserva pensieri senza giudicare',
                'Ritorna al respiro quando ti distrai'
            ],
            contraindications: ['Disturbi psichiatrici gravi']
        },
        'foam-rolling': {
            name: 'Foam Rolling',
            icon: '🌊',
            category: 'self-massage',
            temperature: 'Ambiente',
            duration: '15-25 min',
            benefits: ['Rilascia trigger points', 'Migliora mobilità', 'Self-massage'],
            difficulty: 'facile',
            equipment: 'Foam roller',
            calories: 60,
            description: 'Auto-massaggio con rullo per rilasciare tensioni e trigger points',
            instructions: [
                'Inizia con pressione leggera',
                'Rotola lentamente ogni gruppo muscolare',
                'Fermati sui punti dolorosi 30-60 sec',
                'Mantieni respirazione regolare',
                'Termina con movimenti rilassanti'
            ],
            contraindications: ['Lesioni acute', 'Osteoporosi severa']
        },
        'yoga': {
            name: 'Yoga Restorative',
            icon: '🕉️',
            category: 'movement',
            temperature: 'Ambiente',
            duration: '30-45 min',
            benefits: ['Flessibilità', 'Equilibrio', 'Rilassamento profondo'],
            difficulty: 'medio',
            equipment: 'Tappetino yoga',
            calories: 120,
            description: 'Pratica yoga dolce focalizzata sul recupero e rilassamento',
            instructions: [
                'Inizia con respirazione profonda',
                'Posizioni dolci e sostenute',
                'Mantieni ogni asana 1-3 minuti',
                'Focus sul rilascio delle tensioni',
                'Chiudi con Savasana 10 minuti'
            ],
            contraindications: ['Lesioni spinali acute']
        }
    };

    // TIMER LOGIC
    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setCurrentTimer(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const startSession = (protocolId) => {
        setActiveSession(protocolId);
        setSelectedProtocol(protocolId);
        setCurrentTimer(0);
        setIsTimerRunning(true);
    };

    const endSession = () => {
        if (activeSession) {
            const session = {
                id: Date.now().toString(),
                protocol: activeSession,
                duration: currentTimer,
                date: new Date().toISOString(),
                quality: null // Verrà impostato dopo
            };
            
            const newHistory = [session, ...sessionHistory.slice(0, 19)]; // Max 20 sessioni
            setSessionHistory(newHistory);
            localStorage.setItem('recoveryHistory', JSON.stringify(newHistory));
        }
        
        setActiveSession(null);
        setIsTimerRunning(false);
        setCurrentTimer(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getSessionStats = () => {
        const thisWeek = sessionHistory.filter(session => {
            const sessionDate = new Date(session.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
        });

        const totalDuration = sessionHistory.reduce((sum, session) => sum + session.duration, 0);
        const avgDuration = sessionHistory.length > 0 ? Math.round(totalDuration / sessionHistory.length) : 0;

        return {
            totalSessions: sessionHistory.length,
            thisWeek: thisWeek.length,
            avgDuration: Math.floor(avgDuration / 60),
            totalHours: Math.floor(totalDuration / 3600)
        };
    };

    const stats = getSessionStats();

    const categories = {
        heat: { name: 'Calore', icon: '🔥', color: '#ff6b6b' },
        cold: { name: 'Freddo', icon: '🧊', color: '#4ecdc4' },
        contrast: { name: 'Contrasto', icon: '🌊', color: '#45b7d1' },
        manual: { name: 'Manuale', icon: '🙌', color: '#f7b267' },
        movement: { name: 'Movimento', icon: '🤸', color: '#a8e6cf' },
        mental: { name: 'Mentale', icon: '🧘', color: '#dcc7e8' },
        'self-massage': { name: 'Auto-massaggio', icon: '🌊', color: '#ffd93d' }
    };

    return (
        <div className="recovery-luxury">
            {/* HEADER CON BACK BUTTON */}
            <div className="recovery-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>
                
                <div className="header-title">
                    <h1>🛌 RECOVERY CENTER PRO</h1>
                    <p className="subtitle">Centro benessere digitale per il recupero ottimale</p>
                </div>

                <div className="recovery-streak">
                    <div className="streak-number">{stats.thisWeek}</div>
                    <div className="streak-label">Questa Settimana</div>
                </div>
            </div>

            {/* TIMER SESSIONE ATTIVA */}
            {activeSession && (
                <div className="active-session-timer">
                    <div className="timer-container">
                        <div className="timer-protocol">
                            <span className="timer-icon">{recoveryProtocols[activeSession].icon}</span>
                            <div className="timer-info">
                                <h3>{recoveryProtocols[activeSession].name}</h3>
                                <span className="timer-duration">Durata consigliata: {recoveryProtocols[activeSession].duration}</span>
                            </div>
                        </div>
                        
                        <div className="timer-display">
                            <span className="timer-time">{formatTime(currentTimer)}</span>
                        </div>

                        <div className="timer-controls">
                            <button 
                                className="timer-btn pause"
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                            >
                                {isTimerRunning ? '⏸️' : '▶️'}
                            </button>
                            <button 
                                className="timer-btn stop"
                                onClick={endSession}
                            >
                                🛑 Fine Sessione
                            </button>
                        </div>
                    </div>

                    <div className="session-progress">
                        <div className="progress-info">
                            <span>Temperatura: {recoveryProtocols[activeSession].temperature}</span>
                            <span>Calorie bruciate: ~{Math.round((currentTimer / 60) * (recoveryProtocols[activeSession].calories / 60))}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* STATISTICS OVERVIEW */}
            <div className="recovery-stats">
                <div className="stat-card primary">
                    <div className="stat-icon">📊</div>
                    <div className="stat-data">
                        <span className="stat-value">{stats.totalSessions}</span>
                        <span className="stat-label">Sessioni Totali</span>
                    </div>
                </div>

                <div className="stat-card success">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-data">
                        <span className="stat-value">{stats.avgDuration}min</span>
                        <span className="stat-label">Durata Media</span>
                    </div>
                </div>

                <div className="stat-card info">
                    <div className="stat-icon">🕐</div>
                    <div className="stat-data">
                        <span className="stat-value">{stats.totalHours}h</span>
                        <span className="stat-label">Ore Totali</span>
                    </div>
                </div>

                <div className="stat-card warning">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-data">
                        <span className="stat-value">{stats.thisWeek}</span>
                        <span className="stat-label">Questa Settimana</span>
                    </div>
                </div>
            </div>

            {/* PROTOCOLLI RECOVERY */}
            <div className="protocols-section">
                <h2>🎯 PROTOCOLLI PROFESSIONALI</h2>
                
                <div className="protocols-grid">
                    {Object.entries(recoveryProtocols).map(([id, protocol]) => (
                        <div key={id} className={`protocol-card ${protocol.difficulty}`}>
                            <div className="protocol-header">
                                <div className="protocol-main">
                                    <span className="protocol-icon">{protocol.icon}</span>
                                    <div className="protocol-info">
                                        <h3>{protocol.name}</h3>
                                        <span className="protocol-category">
                                            {categories[protocol.category]?.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="protocol-difficulty">
                                    <span className={`difficulty-badge ${protocol.difficulty}`}>
                                        {protocol.difficulty}
                                    </span>
                                </div>
                            </div>

                            <div className="protocol-description">
                                <p>{protocol.description}</p>
                            </div>

                            <div className="protocol-details">
                                <div className="detail-row">
                                    <span className="detail-label">🌡️ Temperatura:</span>
                                    <span className="detail-value">{protocol.temperature}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">⏱️ Durata:</span>
                                    <span className="detail-value">{protocol.duration}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">🔥 Calorie:</span>
                                    <span className="detail-value">~{protocol.calories}/sessione</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">🛠️ Equipment:</span>
                                    <span className="detail-value">{protocol.equipment}</span>
                                </div>
                            </div>

                            <div className="protocol-benefits">
                                <h4>💎 Benefici:</h4>
                                <div className="benefits-tags">
                                    {protocol.benefits.map((benefit, index) => (
                                        <span key={index} className="benefit-tag">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="protocol-instructions">
                                <h4>📋 Istruzioni:</h4>
                                <ol className="instructions-list">
                                    {protocol.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ol>
                            </div>

                            {protocol.contraindications.length > 0 && (
                                <div className="protocol-warnings">
                                    <h4>⚠️ Controindicazioni:</h4>
                                    <ul className="warnings-list">
                                        {protocol.contraindications.map((warning, index) => (
                                            <li key={index}>{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="protocol-action">
                                <button
                                    className={`protocol-btn ${activeSession === id ? 'active' : ''}`}
                                    onClick={() => activeSession === id ? endSession() : startSession(id)}
                                    disabled={activeSession && activeSession !== id}
                                >
                                    {activeSession === id ? '🛑 Ferma Sessione' : '▶️ Inizia Sessione'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HISTORY SESSIONI */}
            {sessionHistory.length > 0 && (
                <div className="recovery-history">
                    <h2>📈 CRONOLOGIA SESSIONI</h2>
                    <div className="history-list">
                        {sessionHistory.slice(0, 10).map((session) => {
                            const protocol = recoveryProtocols[session.protocol];
                            const sessionDate = new Date(session.date);
                            
                            return (
                                <div key={session.id} className="history-item">
                                    <div className="history-protocol">
                                        <span className="history-icon">{protocol.icon}</span>
                                        <div className="history-info">
                                            <h4>{protocol.name}</h4>
                                            <span className="history-date">
                                                {sessionDate.toLocaleDateString('it-IT')} - {sessionDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="history-stats">
                                        <span className="history-duration">{formatTime(session.duration)}</span>
                                        <span className="history-calories">
                                            ~{Math.round((session.duration / 60) * (protocol.calories / 60))} cal
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {sessionHistory.length > 10 && (
                        <button className="show-more-btn">
                            Mostra altre {sessionHistory.length - 10} sessioni
                        </button>
                    )}
                </div>
            )}

            {/* RECOVERY TIPS */}
            <div className="recovery-tips">
                <h2>💡 CONSIGLI PROFESSIONALI</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <div className="tip-icon">🌡️</div>
                        <h4>Contrasto Termico</h4>
                        <p>Alterna calore e freddo per massimizzare la circolazione e accelerare il recupero muscolare.</p>
                    </div>
                    <div className="tip-card">
                        <div className="tip-icon">💧</div>
                        <h4>Idratazione</h4>
                        <p>Bevi acqua abbondante durante e dopo ogni sessione per mantenere l'equilibrio idro-salino.</p>
                    </div>
                    <div className="tip-card">
                        <div className="tip-icon">⏰</div>
                        <h4>Timing Ottimale</h4>
                        <p>Le sessioni di recovery sono più efficaci entro 2-6 ore dopo l'allenamento intenso.</p>
                    </div>
                    <div className="tip-card">
                        <div className="tip-icon">🎯</div>
                        <h4>Consistenza</h4>
                        <p>3-4 sessioni settimanali regolari sono più efficaci di sessioni sporadiche intense.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recovery;