// Recovery Timer System - Sauna, Steam Bath, Ice Bath Tracker
// Sistema completo per tracking e timer pratiche di recupero

import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { recoveryRepo } from '../firebase/firestore';
import { useAuth } from './AuthProvider';
import { logger } from '../firebase/config';

// Benefici e informazioni per ogni pratica recovery
const RECOVERY_ACTIVITIES = {
    sauna: {
        name: '🔥 Sauna Finlandese',
        icon: '🔥',
        tempRange: '70-100°C',
        durationRange: '15-20 min',
        benefits: {
            physical: [
                '🫀 Migliora la circolazione sanguigna e la funzione cardiovascolare',
                '💪 Accelera il recupero muscolare e riduce l\'acido lattico',
                '🧬 Aumenta la produzione di proteine da shock termico (HSP)',
                '🔥 Stimola il metabolismo e l\'ossidazione dei grassi',
                '🦴 Migliora la densità ossea e la salute articolare',
                '🛡️ Potenzia il sistema immunitario attraverso l\'ipertermia',
                '💊 Riduce l\'infiammazione sistemica (marker CRP, IL-6)',
                '💧 Promuove la disintossicazione attraverso la sudorazione'
            ],
            mental: [
                '🧠 Rilascia endorfine naturali riducendo stress e ansia',
                '😴 Migliora la qualità del sonno e riduce l\'insonnia',
                '🎯 Aumenta la concentrazione e la chiarezza mentale',
                '🧘 Induce uno stato di rilassamento profondo e mindfulness',
                '💪 Sviluppa resilienza mentale e tolleranza al disagio',
                '🎨 Stimola la creatività attraverso l\'alterazione degli stati di coscienza',
                '❤️ Migliora l\'umore attraverso la regolazione dei neurotrasmettitori',
                '🔋 Riduce la fatica mentale e il burnout'
            ]
        },
        tips: [
            '🌡️ Inizia con temperature più basse (70°C) e durata breve (10 min)',
            '💧 Mantieni un\'ottima idratazione prima, durante e dopo',
            '🚿 Fai una doccia fresca tra le sessioni per ottimizzare i benefici',
            '⏰ Pratica 2-3 volte a settimana per risultati ottimali',
            '🧘 Usa il tempo per meditazione o respirazione profonda'
        ]
    },
    
    steam_bath: {
        name: '💨 Bagno Turco',
        icon: '💨',
        tempRange: '40-50°C',
        durationRange: '15-25 min',
        benefits: {
            physical: [
                '🫁 Migliora la funzione respiratoria e decongestionala vie aeree',
                '🌊 Idrata profondamente pelle e mucose',
                '🔄 Stimola la circolazione linfatica e il drenaggio',
                '💪 Rilassa i muscoli e riduce la tensione muscolare',
                '🦠 Aiuta a eliminare tossine attraverso sudorazione e respirazione',
                '❤️ Supporta la salute cardiovascolare con minor stress termico',
                '🌿 Facilita l\'assorbimento di oli essenziali terapeutici',
                '💧 Migliora l\'elasticità della pelle e la rigenerazione cellulare'
            ],
            mental: [
                '🕊️ Induce uno stato di calma profonda e rilassamento',
                '🧠 Riduce i livelli di cortisolo e l\'ansia',
                '🌸 Favorisce la consapevolezza corporea e l\'introspezione',
                '😴 Prepara il corpo e la mente per un sonno riparatore',
                '🎭 Allevia lo stress emotivo attraverso il calore umido',
                '🧘 Facilita pratiche meditative e di mindfulness',
                '💭 Promuove il pensiero creativo in ambiente sensoriale unico',
                '🔮 Migliora l\'umore attraverso rilascio di neurotrasmettitori'
            ]
        },
        tips: [
            '🌡️ La temperatura più bassa permette sessioni più lunghe',
            '🌿 Aggiungi oli essenziali (eucalipto, lavanda) per benefici extra',
            '💧 L\'umidità alta facilita la sudorazione anche a temperature moderate',
            '🧘 Ideale per pratiche di respirazione profonda e meditazione',
            '⏰ Perfetto dopo allenamenti intensi per rilassamento muscolare'
        ]
    },
    
    ice_bath: {
        name: '🧊 Ice Bath',
        icon: '🧊',
        tempRange: '10-15°C',
        durationRange: '2-5 min',
        benefits: {
            physical: [
                '❄️ Riduce drasticamente l\'infiammazione muscolare post-allenamento',
                '🩸 Vasocostrizione seguita da vasodilatazione migliora circolazione',
                '⚡ Attiva il sistema nervoso simpatico aumentando noradrenalina',
                '🔥 Stimola il metabolismo e la termogenesi (brown fat activation)',
                '💪 Accelera significativamente il recupero muscolare',
                '🛡️ Potenzia il sistema immunitario attraverso hormesis del freddo',
                '🧬 Aumenta la produzione di proteine adattive al freddo',
                '💊 Riduce il dolore attraverso effetto analgesico naturale'
            ],
            mental: [
                '🧠 Aumenta drasticamente dopamina e noradrenalina (+250%)',
                '⚡ Migliora focus, concentrazione e vigilanza mentale',
                '💪 Sviluppa resilienza mentale estrema e controllo dell\'ansia',
                '🎯 Aumenta la capacità di gestire stress e situazioni difficili',
                '😊 Effetto antidepressivo attraverso shock termico controllato',
                '🔋 Fornisce energia mentale e riduce la fatica cognitiva',
                '🧘 Pratica estrema di mindfulness e controllo della mente',
                '🦾 Costruisce fiducia e senso di accomplishment'
            ]
        },
        tips: [
            '❄️ Inizia con acqua a 15°C per 1-2 minuti, progredisci gradualmente',
            '🫁 Controlla la respirazione: inspira lentamente, espira con controllo',
            '🧠 Rimani mentalmente presente e accetta il disagio senza resistenza',
            '⏰ 2-3 volte a settimana è ottimale per adattamento',
            '🔥 Non fare sauna subito dopo per non annullare i benefici'
        ]
    },
    
    cold_shower: {
        name: '🚿 Doccia Fredda',
        icon: '🚿',
        tempRange: '10-18°C',
        durationRange: '1-3 min',
        benefits: {
            physical: [
                '❄️ Migliora la circolazione attraverso vasocostrizione/vasodilatazione',
                '⚡ Attiva il metabolismo e aumenta il consumo calorico',
                '💪 Riduce l\'infiammazione muscolare e il dolore post-allenamento',
                '🛡️ Stimola il sistema immunitario aumentando globuli bianchi',
                '🧬 Aumenta la produzione di brown fat per termogenesi',
                '❤️ Migliora la salute cardiovascolare e la pressione sanguigna',
                '🌟 Aumenta l\'energia e la vigilanza attraverso shock termico',
                '💊 Effetto analgesico naturale attraverso endorfine'
            ],
            mental: [
                '🧠 Rilascia noradrenalina migliorando focus e concentrazione',
                '💪 Costruisce disciplina e forza di volontà quotidiana',
                '⚡ Effetto energizzante e antidepressivo immediato',
                '🎯 Migliora la capacità di gestire stress e disagio',
                '😊 Aumenta l\'umore attraverso rilascio di endorfine',
                '🧘 Pratica di mindfulness accessibile quotidianamente',
                '🔋 Combatte la fatica mentale e la procrastinazione',
                '💎 Sviluppa resilienza mentale attraverso esposizione controllata'
            ]
        },
        tips: [
            '🚿 Finisci sempre la doccia calda con 30-90 secondi di freddo',
            '🫁 Respira profondamente durante l\'esposizione al freddo',
            '📈 Aumenta gradualmente la durata nel tempo',
            '🌅 Ottima al mattino per energia e focus per tutta la giornata',
            '💪 Concentrati sul controllo mentale piuttosto che sulla resistenza'
        ]
    },
    
    stretching: {
        name: '🤸 Stretching/Mobility',
        icon: '🤸',
        tempRange: 'Ambiente',
        durationRange: '10-30 min',
        benefits: {
            physical: [
                '🤸 Migliora la flessibilità e il range di movimento articolare',
                '💪 Riduce la tensione muscolare e i trigger points',
                '🩸 Aumenta il flusso sanguigno verso i muscoli allungati',
                '🦴 Migliora l\'allineamento posturale e la salute della colonna',
                '⚡ Facilita il recupero muscolare post-allenamento',
                '🛡️ Riduce il rischio di infortuni durante l\'attività fisica',
                '💊 Allevia dolori muscolari e articolari cronici',
                '🧬 Stimola la produzione di fluido sinoviale per le articolazioni'
            ],
            mental: [
                '🧘 Induce rilassamento attraverso attivazione del sistema parasimpatico',
                '🧠 Migliora la connessione mente-corpo e propriocezione',
                '😌 Riduce stress e tensione accumulata nella muscolatura',
                '💭 Favorisce la meditazione in movimento e mindfulness',
                '😴 Prepara il corpo per un sonno più profondo e riparatore',
                '🎯 Aumenta la concentrazione attraverso focus sul respiro',
                '❤️ Migliora l\'umore attraverso rilascio di endorfine dolci',
                '🔄 Facilita la transizione da stati di attivazione a rilassamento'
            ]
        },
        tips: [
            '🌅 Ottimo al mattino per attivazione e la sera per rilassamento',
            '🫁 Sincronizza movimenti con respirazione profonda e controllata',
            '⏰ Mantieni ogni posizione 30-60 secondi per allungamento efficace',
            '🎵 Usa musica rilassante per creare atmosfera meditativa',
            '🔥 Meglio a corpo caldo: dopo workout o doccia calda'
        ]
    },
    
    meditation: {
        name: '🧘 Meditazione',
        icon: '🧘',
        tempRange: 'Ambiente',
        durationRange: '5-30 min',
        benefits: {
            physical: [
                '❤️ Riduce la pressione sanguigna e migliora la salute cardiovascolare',
                '😴 Migliora la qualità del sonno e riduce i disturbi del sonno',
                '🛡️ Potenzia il sistema immunitario riducendo lo stress cronico',
                '💊 Riduce l\'infiammazione sistemica e il dolore cronico',
                '🧬 Rallenta l\'invecchiamento cellulare attraverso riduzione dello stress',
                '🫁 Migliora la funzione respiratoria e l\'ossigenazione',
                '💪 Riduce la tensione muscolare e facilita il rilassamento',
                '🔥 Ottimizza il metabolismo attraverso regolazione ormonale'
            ],
            mental: [
                '🧠 Migliora la neuroplasticità e la struttura cerebrale',
                '🎯 Aumenta la concentrazione, l\'attenzione e il focus',
                '😌 Riduce significativamente ansia, stress e depressione',
                '💭 Migliora la regolazione emotiva e l\'intelligenza emotiva',
                '🧘 Sviluppa consapevolezza e presenza nel momento',
                '💎 Aumenta la resilienza mentale e la capacità di coping',
                '🎨 Stimola la creatività e il pensiero innovativo',
                '❤️ Migliora l\'empatia e le relazioni interpersonali'
            ]
        },
        tips: [
            '🪑 Trova una posizione comoda ma vigile per la pratica',
            '🫁 Inizia con tecniche di respirazione consapevole',
            '📱 Usa app guidate se sei principiante (Headspace, Calm)',
            '⏰ Anche 5 minuti al giorno creano benefici significativi',
            '🌅 Stabilisci una routine quotidiana nello stesso orario'
        ]
    }
};

const RecoveryTimer = () => {
    const { user } = useAuth();
    const [selectedActivity, setSelectedActivity] = useState('sauna');
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // in secondi
    const [targetDuration, setTargetDuration] = useState(15); // in minuti
    const [temperature, setTemperature] = useState(80);
    const [intensity, setIntensity] = useState(7);
    const [notes, setNotes] = useState('');
    const [recentSessions, setRecentSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBenefits, setShowBenefits] = useState(false);
    
    const intervalRef = useRef(null);
    const audioRef = useRef(null);

    // Carica sessioni recenti
    useEffect(() => {
        if (user) {
            loadRecentSessions();
        }
    }, [user]);

    // Timer effect
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    // Suono completamento (opzionale)
    useEffect(() => {
        if (time >= targetDuration * 60 && isRunning) {
            // Timer completato
            setIsRunning(false);
            playCompletionSound();
        }
    }, [time, targetDuration, isRunning]);

    const loadRecentSessions = async () => {
        try {
            const result = await recoveryRepo.getUserRecoverySessions();
            if (result.success) {
                setRecentSessions(result.data.slice(0, 10)); // Ultimi 10
            }
        } catch (error) {
            logger.error('Errore caricamento sessioni recovery', error);
        }
    };

    const playCompletionSound = () => {
        // Suono completamento (puoi sostituire con un file audio)
        if (audioRef.current) {
            audioRef.current.play().catch(e => {
                // Fallback: vibrazione su mobile
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200, 100, 200]);
                }
            });
        }
    };

    const startTimer = () => {
        setIsRunning(true);
        logger.info(`Timer started: ${selectedActivity} for ${targetDuration} minutes`);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(0);
    };

    const completeSession = async () => {
        if (time < 30) { // Almeno 30 secondi
            alert('Sessione troppo breve per essere salvata (minimo 30 secondi)');
            return;
        }

        setLoading(true);
        try {
            const sessionData = {
                activityType: selectedActivity,
                duration: Math.round(time / 60), // converti in minuti
                temperature: ['sauna', 'steam_bath', 'ice_bath', 'cold_shower'].includes(selectedActivity) ? temperature : null,
                intensity,
                notes,
                actualDuration: time,
                targetDuration: targetDuration * 60,
                completedAt: new Date().toISOString()
            };

            const result = await recoveryRepo.logRecoverySession(sessionData);
            
            if (result.success) {
                logger.success(`Recovery session logged: ${selectedActivity}`);
                
                // Reset form
                setTime(0);
                setIsRunning(false);
                setNotes('');
                
                // Ricarica sessioni
                await loadRecentSessions();
                
                alert(`✅ Sessione ${RECOVERY_ACTIVITIES[selectedActivity].name} completata e salvata!`);
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            logger.error('Errore salvataggio sessione recovery', error);
            alert('❌ Errore durante il salvataggio della sessione');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgressPercentage = () => {
        const targetSeconds = targetDuration * 60;
        return Math.min((time / targetSeconds) * 100, 100);
    };

    const activity = RECOVERY_ACTIVITIES[selectedActivity];
    const isTemperatureRelevant = ['sauna', 'steam_bath', 'ice_bath', 'cold_shower'].includes(selectedActivity);

    if (!user) {
        return (
            <div className="recovery-timer">
                <div className="auth-required">
                    <h2>🔐 Login Richiesto</h2>
                    <p>Effettua il login per usare il timer recovery</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recovery-timer">
            <div className="recovery-header">
                <h2>🔥 Recovery Timer</h2>
                <p>Timer professionale per pratiche di recupero con tracking completo</p>
            </div>

            {/* Selezione attività */}
            <div className="activity-selection">
                <h3>🎯 Seleziona Pratica</h3>
                <div className="activity-grid">
                    {Object.keys(RECOVERY_ACTIVITIES).map(key => (
                        <button
                            key={key}
                            className={`activity-btn ${selectedActivity === key ? 'active' : ''}`}
                            onClick={() => setSelectedActivity(key)}
                            disabled={isRunning}
                        >
                            <span className="activity-icon">{RECOVERY_ACTIVITIES[key].icon}</span>
                            <span className="activity-name">{RECOVERY_ACTIVITIES[key].name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info attività selezionata */}
            <div className="activity-info">
                <div className="activity-details">
                    <h3>{activity.name}</h3>
                    <div className="activity-specs">
                        <span className="spec-item">
                            🌡️ <strong>Temperatura:</strong> {activity.tempRange}
                        </span>
                        <span className="spec-item">
                            ⏰ <strong>Durata:</strong> {activity.durationRange}
                        </span>
                    </div>
                </div>
                
                <button 
                    className="benefits-toggle"
                    onClick={() => setShowBenefits(!showBenefits)}
                >
                    {showBenefits ? '📖 Nascondi Benefici' : '💡 Mostra Benefici'}
                </button>
            </div>

            {/* Benefici (espandibile) */}
            {showBenefits && (
                <div className="benefits-section">
                    <div className="benefits-grid">
                        <div className="benefits-category">
                            <h4>💪 Benefici Fisici</h4>
                            <ul>
                                {activity.benefits.physical.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="benefits-category">
                            <h4>🧠 Benefici Mentali</h4>
                            <ul>
                                {activity.benefits.mental.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="tips-section">
                        <h4>💡 Consigli Pratici</h4>
                        <ul>
                            {activity.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Configurazione sessione */}
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
                    
                    {isTemperatureRelevant && (
                        <div className="config-item">
                            <label>🌡️ Temperatura (°C)</label>
                            <input
                                type="number"
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value) || 0)}
                                disabled={isRunning}
                            />
                        </div>
                    )}
                    
                    <div className="config-item">
                        <label>💪 Intensità (1-10)</label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={intensity}
                            onChange={(e) => setIntensity(parseInt(e.target.value))}
                            disabled={isRunning}
                        />
                        <span className="intensity-value">{intensity}/10</span>
                    </div>
                </div>
            </div>

            {/* Timer principale */}
            <div className="main-timer">
                <div className="timer-display">
                    <div className="time-text">{formatTime(time)}</div>
                    <div className="target-time">Target: {targetDuration}:00</div>
                </div>
                
                <div className="progress-ring">
                    <div 
                        className="progress-fill"
                        style={{ 
                            background: `conic-gradient(#00ff88 ${getProgressPercentage() * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                        }}
                    ></div>
                    <div className="progress-percentage">
                        {Math.round(getProgressPercentage())}%
                    </div>
                </div>
                
                <div className="timer-controls">
                    {!isRunning ? (
                        <button 
                            className="btn-primary timer-btn start"
                            onClick={startTimer}
                            disabled={loading}
                        >
                            ▶️ Inizia Timer
                        </button>
                    ) : (
                        <button 
                            className="btn-secondary timer-btn pause"
                            onClick={pauseTimer}
                        >
                            ⏸️ Pausa
                        </button>
                    )}
                    
                    <button 
                        className="btn-secondary timer-btn reset"
                        onClick={resetTimer}
                        disabled={loading}
                    >
                        🔄 Reset
                    </button>
                    
                    {time >= 30 && (
                        <button 
                            className="btn-success timer-btn complete"
                            onClick={completeSession}
                            disabled={loading}
                        >
                            ✅ Completa Sessione
                        </button>
                    )}
                </div>
            </div>

            {/* Note sessione */}
            <div className="session-notes">
                <label>📝 Note Sessione (opzionale)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Come ti sei sentito? Osservazioni sulla sessione..."
                    rows="3"
                    maxLength="500"
                    disabled={loading}
                />
            </div>

            {/* Sessioni recenti */}
            {recentSessions.length > 0 && (
                <div className="recent-sessions">
                    <h3>📋 Sessioni Recenti</h3>
                    <div className="sessions-list">
                        {recentSessions.slice(0, 5).map(session => (
                            <div key={session.id} className="session-item">
                                <div className="session-header">
                                    <span className="session-activity">
                                        {RECOVERY_ACTIVITIES[session.activityType]?.icon} {RECOVERY_ACTIVITIES[session.activityType]?.name}
                                    </span>
                                    <span className="session-date">
                                        {format(new Date(session.date), 'dd/MM/yyyy')}
                                    </span>
                                </div>
                                <div className="session-details">
                                    <span>⏱️ {session.duration} min</span>
                                    {session.temperature && (
                                        <span>🌡️ {session.temperature}°C</span>
                                    )}
                                    <span>💪 {session.intensity}/10</span>
                                </div>
                                {session.notes && (
                                    <div className="session-notes-preview">
                                        "{session.notes}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Audio per completamento timer */}
            <audio ref={audioRef} preload="auto">
                <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBTaL0+K+eC8ELYjN8piSUgwYY7/ow4lQCgjI0vKgcy4FKHjG8OKPQwoVXrXo6r5ZFglHnt7xy2MdBjSL0+LBdS8EMoXO8pyTUgwXY7/nw4lQCgjI0vKhcy0FL3fO8N+PQgsVXrTo7b9ZFQlHnt7xy2MdBjSM0+LBdS8EMoXO8pyTUgwXY7/nw4lQCgjI0vKhcyzd" type="audio/wav" />
            </audio>

            {loading && (
                <div className="recovery-loading">
                    <div className="loading-spinner"></div>
                    <p>Salvando sessione...</p>
                </div>
            )}
        </div>
    );
};

export default RecoveryTimer;