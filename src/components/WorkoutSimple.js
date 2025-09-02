import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../utils/dataManager';
import CalendarStreak from './CalendarStreak';

const WorkoutSimple = () => {
    const navigate = useNavigate();
    const calendarHook = CalendarStreak(); // HOOK PER AGGIORNARE STREAK
    const [selectedDay, setSelectedDay] = React.useState(null);
    const [selectedExercise, setSelectedExercise] = React.useState(null);
    const [isWorkoutActive, setIsWorkoutActive] = React.useState(false);
    const [currentWorkout, setCurrentWorkout] = React.useState({
        exercises: [],
        startTime: null,
        duration: 0,
        day: null
    });
    const [exerciseForm, setExerciseForm] = React.useState({
        sets: '',
        reps: '',
        weight: '',
        rir: '',
        notes: ''
    });

    const workoutPlan = {
        'Lunedì': {
            focus: 'Petto + Bicipiti',
            subtitle: 'Focus: Petto (fascio alto + globale), Bicipiti',
            exercises: [
                { name: 'Panca Inclinata Bilanciere', sets: '4×6-8', rest: '2min', notes: 'RIR 1-2 | Focus forma e controllo' },
                { name: 'Spinte Manubri Inclinata', sets: '3×8-10', rest: '90sec', notes: 'Angolo 30-45° | ROM completo' },
                { name: 'Croci ai Cavi Alti/Inclinata', sets: '3×12-15', rest: '75sec', notes: 'Stretch massimo petto' },
                { name: 'Curl Bilanciere', sets: '4×8-10', rest: '90sec', notes: 'No cheating | Controllo eccentrica' },
                { name: 'Curl Manubri Inclinati', sets: '3×10-12', rest: '75sec', notes: 'Panca 45° | Stretch bicipiti' }
            ]
        },
        'Martedì': {
            focus: 'Dorso + Tricipiti + Collo (A)',
            subtitle: 'Focus: Larghezza dorsale, spessore scapolare, tricipiti, collo',
            exercises: [
                { name: 'Trazioni Presa Ampia', sets: '4×6-8', rest: '2min', notes: 'Se necessario usa assistenza | Focus larghezza' },
                { name: 'Rematore Bilanciere/Manubrio', sets: '4×8-10', rest: '2min', notes: 'Busto 45° | Squeeze scapole' },
                { name: 'Lat Machine Inversa o Presa Stretta', sets: '3×10-12', rest: '90sec', notes: 'Controllo concentrica/eccentrica' },
                { name: 'Panca Stretta Bilanciere', sets: '4×6-8', rest: '2min', notes: 'Presa larghezza spalle | Gomiti chiusi' },
                { name: 'French Press EZ', sets: '3×8-10', rest: '90sec', notes: 'Solo avambracci si muovono' }
            ]
        },
        'Mercoledì': {
            focus: 'Gambe Complete',
            subtitle: 'Focus: Quadricipiti, glutei, femorali, polpacci',
            exercises: [
                { name: 'Squat', sets: '4×6-8', rest: '3min', notes: 'Profondità completa | RIR 1-2' },
                { name: 'Hip Thrust', sets: '4×8-10', rest: '2min', notes: 'Contrazione glutei al top | Pausa 1 sec' },
                { name: 'Affondi Camminata', sets: '3×10 passi/gamba', rest: '90sec', notes: 'Ginocchio a 90° | Passo lungo' },
                { name: 'Leg Press 45°', sets: '3×10-12', rest: '90sec', notes: 'Piedi larghezza spalle | ROM completo' },
                { name: 'Calf Raise in Piedi', sets: '4×10-12', rest: '60sec', notes: 'Pausa 2 sec al top | Range completo' }
            ]
        },
        'Giovedì': {
            focus: 'Recupero Attivo',
            subtitle: 'Focus: Cardiovascolare leggero, mobilità, recupero',
            exercises: [
                { name: 'LISS (Camminata/Cyclette)', sets: '30-40min', rest: 'Zona 1-2', notes: '60-70% FCMax | Mantieni conversazione' },
                { name: 'Stretching/Mobilità', sets: '15-20min', rest: 'Rilassante', notes: 'Tutti i gruppi muscolari | Respiro profondo' },
                { name: 'Sauna o Bagno Turco', sets: '10-15min', rest: 'Recovery', notes: 'Idratazione costante | Relax mentale' }
            ]
        },
        'Venerdì': {
            focus: 'Spalle Complete + Collo (B)',
            subtitle: 'Focus: Deltoidi laterali/posteriori, trapezio, richiamo braccia, collo',
            exercises: [
                { name: 'Military Press Manubri', sets: '4×6-8', rest: '2min', notes: 'Seduto con schienale | Core attivo' },
                { name: 'Alzate Laterali Cavi/Manubri', sets: '4×12-15', rest: '75sec', notes: 'Controllo eccentrica | No cheating' },
                { name: 'Rear Delt Fly (Pec Deck Inversa o Manubri)', sets: '3×12-15', rest: '75sec', notes: 'Squeeze scapole | Focus deltoidi posteriori' },
                { name: 'Face Pull', sets: '3×12-15', rest: '60sec', notes: 'Corda ai cavi | Gomiti alti' },
                { name: 'Scrollate Manubri/Bilanciere', sets: '3×10-12', rest: '90sec', notes: 'Solo spalle | No rotazione' }
            ]
        },
        'Sabato': {
            focus: 'Posteriori + Conditioning',
            subtitle: 'Focus: Femorali, glutei, polpacci + condizionamento',
            exercises: [
                { name: 'Stacco Rumeno (RDL)', sets: '4×6-8', rest: '2min', notes: 'Focus femorali | Bilanciere vicino corpo' },
                { name: 'Hip Thrust (Variante Mono)', sets: '3×10-12', rest: '2min', notes: 'Una gamba | Controllo stabilità' },
                { name: 'Nordic Curl o Glute Ham Raise', sets: '3×8-10', rest: '90sec', notes: 'Eccentrica lenta | Assistenza se necessaria' },
                { name: 'Leg Curl Seduto', sets: '3×12-15', rest: '75sec', notes: 'Contrazione massima | Pausa 1 sec' },
                { name: 'Calf Raise Multipla', sets: '3×15-20', rest: '60sec', notes: 'Variare angoli piedi | Range massimo' }
            ]
        },
        'Domenica': {
            focus: 'Riposo Completo',
            subtitle: 'Focus: Recupero totale, rigenerazione',
            exercises: [
                { name: 'Passeggiata Tranquilla', sets: '30-60min', rest: 'Libero', notes: 'Aria aperta | Ritmo rilassante' },
                { name: 'Stretching Globale', sets: '20-30min', rest: 'Flow dolce', notes: 'Focus respirazione e relax' },
                { name: 'Sauna/Bagno Turco (Opzionale)', sets: '15-20min', rest: 'Recovery', notes: 'Detossificazione | Idratazione' },
                { name: 'Meditazione/Visualizzazione', sets: '10-20min', rest: 'Mentale', notes: 'Preparazione settimana successiva' }
            ]
        }
    };

    const getMuscleGroup = (exerciseName) => {
        const name = exerciseName.toLowerCase();
        if (name.includes('panca') || name.includes('petto') || name.includes('spinte') || name.includes('croci') || name.includes('dip')) return 'Petto';
        if (name.includes('curl') || name.includes('bicip')) return 'Bicipiti';
        if (name.includes('trazione') || name.includes('rematore') || name.includes('dorso') || name.includes('pullover')) return 'Dorso';
        if (name.includes('tricip') || name.includes('french') || name.includes('pushdown')) return 'Tricipiti';
        if (name.includes('squat') || name.includes('cosce') || name.includes('quad')) return 'Quadricipiti';
        if (name.includes('stacco') || name.includes('femorali')) return 'Femorali';
        if (name.includes('spalla') || name.includes('shoulder') || name.includes('alzate')) return 'Spalle';
        if (name.includes('polpacci') || name.includes('calf')) return 'Polpacci';
        return 'Altro';
    };

    const startWorkout = (day) => {
        setCurrentWorkout({
            day: day,
            exercises: [],
            startTime: Date.now(),
            duration: 0
        });
        setIsWorkoutActive(true);
        setSelectedDay(day);
    };

    const completeExercise = (exercise) => {
        if (!exerciseForm.weight || !exerciseForm.reps || !exerciseForm.sets) {
            alert('Inserisci almeno peso, ripetizioni e serie!');
            return;
        }

        const completedExercise = {
            name: exercise.name,
            sets: parseInt(exerciseForm.sets),
            reps: parseInt(exerciseForm.reps),
            weight: parseFloat(exerciseForm.weight),
            rir: exerciseForm.rir ? parseInt(exerciseForm.rir) : null,
            notes: exerciseForm.notes,
            muscleGroup: getMuscleGroup(exercise.name),
            completed: true
        };

        setCurrentWorkout(prev => ({
            ...prev,
            exercises: [...prev.exercises, completedExercise]
        }));

        // Reset form
        setExerciseForm({
            sets: '',
            reps: '',
            weight: '',
            rir: '',
            notes: ''
        });
        setSelectedExercise(null);
        alert(`Esercizio ${exercise.name} salvato!`);
    };

    const finishWorkout = () => {
        if (currentWorkout.exercises.length === 0) {
            alert('Aggiungi almeno un esercizio prima di salvare!');
            return;
        }

        const workoutData = {
            ...currentWorkout,
            date: new Date().toISOString(), // 🔥 BUG FIX: Aggiunge data esplicita
            duration: Math.round((Date.now() - currentWorkout.startTime) / 1000 / 60), // minuti
            type: workoutPlan[currentWorkout.day]?.focus || 'Workout Generico'
        };

        // Salva nel dataManager
        dataManager.saveWorkout(workoutData);

        // 🔥 SALVA ANCHE NEL VECCHIO SISTEMA PER RETROCOMPATIBILITÀ  
        const oldWorkoutSessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]');
        oldWorkoutSessions.unshift(workoutData);
        localStorage.setItem('workoutSessions', JSON.stringify(oldWorkoutSessions));

        // 🔥 AGGIORNA STREAK CALENDARIO (BUG FIX CRITICO!)
        calendarHook.markWorkoutCompleted(new Date(), workoutData.type, workoutData.exercises);
        
        // 📊 FORZA AGGIORNAMENTO ANALYTICS
        setTimeout(() => {
            // Trigger reload dei dati analytics
            window.dispatchEvent(new CustomEvent('workoutCompleted', { detail: workoutData }));
        }, 100);

        // Reset stato
        setCurrentWorkout({ exercises: [], startTime: null, duration: 0, day: null });
        setIsWorkoutActive(false);
        setSelectedDay(null);

        console.log('🚀 WORKOUT SALVATO:', workoutData);
        console.log('📊 DataManager workouts:', dataManager.getWorkouts());
        console.log('📅 Old workoutSessions:', JSON.parse(localStorage.getItem('workoutSessions') || '[]'));
        
        alert(`🎉 Workout salvato! ${workoutData.exercises.length} esercizi completati in ${workoutData.duration} minuti.
        🔥 STREAK AGGIORNATO: Ricarica la Dashboard per vedere i cambiamenti!`);
    };

    const isExerciseCompleted = (exerciseName) => {
        return currentWorkout.exercises.some(ex => ex.name === exerciseName);
    };

    return (
        <div className="workout-container">
            {/* HEADER CON BACK BUTTON */}
            <div className="workout-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                    style={{
                        background: '#ff9500',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        marginBottom: '20px'
                    }}
                >
                    <span>←</span> Dashboard
                </button>
                
                <div className="header-content">
                    <h1>🏋️ SCHEDA: FISICO DELLA MADONNA</h1>
                    <p>Programma di allenamento avanzato per trasformazione fisica estrema</p>
                    <div className="program-stats">
                        <span>📅 6 giorni/settimana</span>
                        <span>⏱️ 75-90 min/sessione</span>
                        <span>🎯 Volume: Alto</span>
                        <span>🔥 Intensità: RIR 1-3</span>
                    </div>
                    
                    {/* STATUS WORKOUT ATTIVO */}
                    {isWorkoutActive && (
                        <div style={{
                            background: 'rgba(255, 149, 0, 0.1)',
                            padding: '20px',
                            borderRadius: '10px',
                            margin: '20px 0',
                            border: '2px solid #ff9500'
                        }}>
                            <h3>🔥 Workout in Corso: {currentWorkout.day}</h3>
                            <p>Esercizi completati: {currentWorkout.exercises.length}</p>
                            <button 
                                onClick={finishWorkout}
                                style={{ 
                                    background: '#22c55e', 
                                    color: 'white', 
                                    padding: '12px 24px', 
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✅ Termina e Salva Workout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PIANO SETTIMANALE */}
            <div className="workout-week">
                <h2>📅 Piano Settimanale</h2>
                <div className="days-grid">
                    {Object.entries(workoutPlan).map(([day, workout]) => (
                        <div key={day} style={{
                            border: selectedDay === day ? '3px solid #ff9500' : '1px solid #333',
                            borderRadius: '10px',
                            padding: '20px',
                            margin: '10px',
                            background: selectedDay === day ? 'rgba(255, 149, 0, 0.1)' : '#1a1a1a'
                        }}>
                            <div 
                                onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{day}</h3>
                                <p style={{ color: '#ff9500', fontWeight: 'bold' }}>{workout.focus}</p>
                                <p style={{ color: '#aaa' }}>{workout.subtitle}</p>
                            </div>
                            
                            {selectedDay === day && (
                                <div style={{ marginTop: '20px' }}>
                                    {/* PULSANTE INIZIO WORKOUT */}
                                    {!isWorkoutActive && (
                                        <button 
                                            onClick={() => startWorkout(day)}
                                            style={{ 
                                                background: '#ff9500', 
                                                color: 'white', 
                                                padding: '15px 30px', 
                                                borderRadius: '10px',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                width: '100%',
                                                marginBottom: '20px',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            🚀 Inizia Workout - {workout.focus}
                                        </button>
                                    )}

                                    {/* LISTA ESERCIZI */}
                                    <div className="exercises-list">
                                        {workout.exercises.map((exercise, index) => (
                                            <div key={index} style={{
                                                background: isExerciseCompleted(exercise.name) ? 
                                                    'rgba(34, 197, 94, 0.2)' : 
                                                    selectedExercise === exercise.name ? 'rgba(255, 149, 0, 0.2)' : '#2a2a2a',
                                                border: selectedExercise === exercise.name ? '2px solid #ff9500' : '1px solid #444',
                                                borderRadius: '8px',
                                                padding: '15px',
                                                margin: '10px 0',
                                                cursor: 'pointer'
                                            }}>
                                                <div onClick={() => 
                                                    setSelectedExercise(selectedExercise === exercise.name ? null : exercise.name)
                                                }>
                                                    <h4>
                                                        {isExerciseCompleted(exercise.name) && '✅ '}
                                                        {exercise.name}
                                                    </h4>
                                                    <div style={{ color: '#aaa', fontSize: '14px' }}>
                                                        <span>{exercise.sets}</span> | 
                                                        <span> Rest: {exercise.rest}</span>
                                                    </div>
                                                    <p style={{ color: '#ccc', fontSize: '12px', marginTop: '8px' }}>
                                                        {exercise.notes}
                                                    </p>
                                                </div>
                                                
                                                {/* INTERFACCIA TRACKING PESO */}
                                                {selectedExercise === exercise.name && isWorkoutActive && (
                                                    <div style={{
                                                        background: '#333',
                                                        padding: '20px',
                                                        borderRadius: '8px',
                                                        marginTop: '15px'
                                                    }}>
                                                        <h5>🏋️ Inserisci Dati Allenamento</h5>
                                                        
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                                                            <div>
                                                                <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Serie:</label>
                                                                <input 
                                                                    type="number"
                                                                    value={exerciseForm.sets}
                                                                    onChange={(e) => setExerciseForm(prev => ({...prev, sets: e.target.value}))}
                                                                    placeholder="es. 3"
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px',
                                                                        borderRadius: '5px',
                                                                        border: '1px solid #555',
                                                                        background: '#222',
                                                                        color: 'white'
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Ripetizioni:</label>
                                                                <input 
                                                                    type="number"
                                                                    value={exerciseForm.reps}
                                                                    onChange={(e) => setExerciseForm(prev => ({...prev, reps: e.target.value}))}
                                                                    placeholder="es. 8"
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px',
                                                                        borderRadius: '5px',
                                                                        border: '1px solid #555',
                                                                        background: '#222',
                                                                        color: 'white'
                                                                    }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Peso (kg):</label>
                                                                <input 
                                                                    type="number"
                                                                    step="0.5"
                                                                    value={exerciseForm.weight}
                                                                    onChange={(e) => setExerciseForm(prev => ({...prev, weight: e.target.value}))}
                                                                    placeholder="es. 80"
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px',
                                                                        borderRadius: '5px',
                                                                        border: '1px solid #ff9500',
                                                                        background: '#ff9500',
                                                                        color: 'white',
                                                                        fontWeight: 'bold'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', marginBottom: '15px' }}>
                                                            <div>
                                                                <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>RIR (opz.):</label>
                                                                <select 
                                                                    value={exerciseForm.rir}
                                                                    onChange={(e) => setExerciseForm(prev => ({...prev, rir: e.target.value}))}
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px',
                                                                        borderRadius: '5px',
                                                                        border: '1px solid #555',
                                                                        background: '#222',
                                                                        color: 'white'
                                                                    }}
                                                                >
                                                                    <option value="">-</option>
                                                                    <option value="0">0 (cedimento)</option>
                                                                    <option value="1">1</option>
                                                                    <option value="2">2</option>
                                                                    <option value="3">3</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Note:</label>
                                                                <input 
                                                                    type="text"
                                                                    value={exerciseForm.notes}
                                                                    onChange={(e) => setExerciseForm(prev => ({...prev, notes: e.target.value}))}
                                                                    placeholder="Sensazioni, difficoltà, ecc."
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '8px',
                                                                        borderRadius: '5px',
                                                                        border: '1px solid #555',
                                                                        background: '#222',
                                                                        color: 'white'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => completeExercise(exercise)}
                                                            style={{
                                                                background: '#22c55e',
                                                                color: 'white',
                                                                padding: '12px 24px',
                                                                borderRadius: '8px',
                                                                width: '100%',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontSize: '16px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            ✅ Salva Esercizio
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* PROGRESSO WORKOUT CORRENTE */}
                                    {isWorkoutActive && currentWorkout.day === day && (
                                        <div style={{
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            padding: '20px',
                                            borderRadius: '10px',
                                            marginTop: '20px',
                                            border: '2px solid #22c55e'
                                        }}>
                                            <h4>🏆 Progresso Workout</h4>
                                            <div style={{ marginBottom: '15px', color: '#aaa' }}>
                                                <span>Esercizi: {currentWorkout.exercises.length}/{workout.exercises.length} | </span>
                                                <span>Completamento: {Math.round((currentWorkout.exercises.length / workout.exercises.length) * 100)}%</span>
                                            </div>
                                            
                                            {currentWorkout.exercises.length > 0 && (
                                                <div>
                                                    <h5 style={{ color: '#22c55e' }}>Esercizi Completati:</h5>
                                                    {currentWorkout.exercises.map((ex, idx) => (
                                                        <div key={idx} style={{
                                                            background: '#2a2a2a',
                                                            padding: '8px',
                                                            borderRadius: '5px',
                                                            margin: '5px 0',
                                                            fontSize: '14px'
                                                        }}>
                                                            <span>{ex.name}: {ex.sets}x{ex.reps} @ {ex.weight}kg</span>
                                                            {ex.rir && <span> (RIR {ex.rir})</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* INFO COLLEGAMENTO ANALYTICS */}
            <div style={{
                background: 'rgba(0, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                margin: '30px 0',
                border: '2px solid #00ffff'
            }}>
                <h3 style={{ color: '#00ffff' }}>📊 I Tuoi Dati Alimentano gli Analytics!</h3>
                <p>Ogni workout salvato contribuisce ai tuoi grafici di progresso reali.</p>
                <button 
                    onClick={() => navigate('/analytics')}
                    style={{
                        background: '#00ffff',
                        color: 'black',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    🚀 Vai agli Analytics
                </button>
            </div>
        </div>
    );
};

export default WorkoutSimple;