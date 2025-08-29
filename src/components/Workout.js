import React from 'react';
import WorkoutTimer from './WorkoutTimer';

const Workout = () => {
    const [selectedDay, setSelectedDay] = React.useState(null);
    const [completedWorkouts, setCompletedWorkouts] = React.useState([]);
    
    const workoutPlan = {
        'Lunedì': {
            focus: 'Petto + Bicipiti',
            subtitle: 'Focus: Petto (fascio alto + globale), Bicipiti',
            exercises: [
                { name: 'Panca Inclinata Bilanciere', sets: '4×6-8', rest: '2min', notes: 'RIR 1-2 | Focus forma e controllo' },
                { name: 'Spinte Manubri Inclinata', sets: '3×8-10', rest: '90sec', notes: 'Angolo 30-45° | ROM completo' },
                { name: 'Croci ai Cavi Alti/Inclinata', sets: '3×12-15', rest: '75sec', notes: 'Stretch massimo petto' },
                { name: 'Dip alle Parallele (petto) o Panca Piana Manubri', sets: '3×8-10', rest: '90sec', notes: 'Inclinazione avanti per petto' },
                { name: 'Curl Bilanciere', sets: '4×8-10', rest: '90sec', notes: 'No cheating | Controllo eccentrica' },
                { name: 'Curl Manubri Inclinati', sets: '3×10-12', rest: '75sec', notes: 'Panca 45° | Stretch bicipiti' },
                { name: 'Hammer Curl Manubri o Cavi', sets: '3×12-15', rest: '60sec', notes: 'Presa neutra | Focus brachiale' }
            ]
        },
        'Martedì': {
            focus: 'Dorso + Tricipiti + Collo (A)',
            subtitle: 'Focus: Larghezza dorsale, spessore scapolare, tricipiti, collo',
            exercises: [
                { name: 'Trazioni Presa Ampia', sets: '4×6-8', rest: '2min', notes: 'Se necessario usa assistenza | Focus larghezza' },
                { name: 'Rematore Bilanciere/Manubrio', sets: '4×8-10', rest: '2min', notes: 'Busto 45° | Squeeze scapole' },
                { name: 'Lat Machine Inversa o Presa Stretta', sets: '3×10-12', rest: '90sec', notes: 'Controllo concentrica/eccentrica' },
                { name: 'Pullover ai Cavi', sets: '3×12-15', rest: '75sec', notes: 'ROM ampio | Focus gran dorsale' },
                { name: 'Panca Stretta Bilanciere', sets: '4×6-8', rest: '2min', notes: 'Presa larghezza spalle | Gomiti chiusi' },
                { name: 'French Press EZ', sets: '3×8-10', rest: '90sec', notes: 'Solo avambracci si muovono' },
                { name: 'Pushdown Cavo', sets: '3×12-15', rest: '60sec', notes: 'Contrazione massima in basso' },
                { name: 'Collo - Flessione', sets: '2×15-20', rest: '30sec', notes: 'Lento e controllato' },
                { name: 'Collo - Estensione', sets: '2×15-20', rest: '30sec', notes: 'Range completo sicuro' },
                { name: 'Collo - Laterale dx/sx', sets: '2×12-15', rest: '30sec', notes: 'Ogni lato separatamente' }
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
                { name: 'Leg Curl Sdraiato', sets: '3×10-12', rest: '90sec', notes: 'Rest-pause ultimo set | Contrazione massima' },
                { name: 'Calf Raise in Piedi', sets: '4×10-12', rest: '60sec', notes: 'Pausa 2 sec al top | Range completo' },
                { name: 'Calf Raise Seduto', sets: '3×15-20', rest: '60sec', notes: 'Focus soleo | Controllo movimento' }
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
                { name: 'Scrollate Manubri/Bilanciere', sets: '3×10-12', rest: '90sec', notes: 'Solo spalle | No rotazione' },
                { name: 'Curl Manubri (Richiamo leggero)', sets: '2×12-15', rest: '60sec', notes: 'Pompaggio | Non a cedimento' },
                { name: 'Pushdown Corda (Richiamo leggero)', sets: '2×12-15', rest: '60sec', notes: 'Focus connessione mente-muscolo' },
                { name: 'Collo B - Flessione', sets: '2×15-20', rest: '30sec', notes: 'Progressione graduale resistenza' },
                { name: 'Collo B - Estensione', sets: '2×15-20', rest: '30sec', notes: 'Mai forzare movimento' },
                { name: 'Collo B - Laterale dx/sx', sets: '2×12-15', rest: '30sec', notes: 'Simmetrico entrambi lati' },
                { name: 'Isometrie Multidirezionali Collo', sets: '3×20sec', rest: '30sec', notes: 'Resistenza manuale | 4 direzioni' },
                { name: 'Stomach Vacuum', sets: '3×20sec', rest: '45sec', notes: 'Addome verso colonna | Respiro normale' },
                { name: 'Plank', sets: '3×45sec', rest: '60sec', notes: 'Corpo dritto | Core attivo' }
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
                { name: 'Calf Raise Multipla', sets: '3×15-20', rest: '60sec', notes: 'Variare angoli piedi | Range massimo' },
                { name: "Farmer's Walk", sets: '3×40m', rest: '90sec', notes: 'Carico pesante | Core + trapezio | Passo normale' },
                { name: 'HIIT Finisher', sets: '8×30sec sprint / 60sec camminata', rest: 'Totale 10min', notes: 'Intensità massima sprint | Recupero attivo' }
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
    
    const loadCompletedWorkouts = () => {
        const saved = localStorage.getItem('completedWorkouts');
        if (saved) {
            setCompletedWorkouts(JSON.parse(saved));
        }
    };
    
    const markWorkoutCompleted = (day) => {
        const today = new Date().toISOString().split('T')[0];
        const workoutData = {
            day,
            date: today,
            id: Date.now()
        };
        
        const updated = [workoutData, ...completedWorkouts];
        setCompletedWorkouts(updated);
        localStorage.setItem('completedWorkouts', JSON.stringify(updated));
    };
    
    const isWorkoutCompletedToday = (day) => {
        const today = new Date().toISOString().split('T')[0];
        return completedWorkouts.some(workout => 
            workout.day === day && workout.date === today
        );
    };
    
    React.useEffect(() => {
        loadCompletedWorkouts();
    }, []);

    return (
        <div className="workout-container">
            <div className="workout-header">
                <h2>🏋️ Scheda: Fisico della Madonna (6 Mesi)</h2>
                <p className="program-description">Programma di allenamento avanzato per trasformazione fisica estrema. 
                   <strong>Split Push/Pull/Legs + Specializzazione</strong> ottimizzato per ipertrofia muscolare.</p>
                <div className="program-stats">
                    <span className="stat">📅 6 giorni/settimana</span>
                    <span className="stat">⏱️ 75-90 min/sessione</span>
                    <span className="stat">🎯 Volume: Alto</span>
                    <span className="stat">🔥 Intensità: RIR 1-3</span>
                </div>
            </div>
            
            <WorkoutTimer onSessionComplete={(sessionData) => {
                console.log('Sessione completata:', sessionData);
            }} />
            
            <div className="workout-week">
                <h3>📅 Piano Settimanale</h3>
                <div className="days-grid">
                    {Object.entries(workoutPlan).map(([day, workout]) => (
                        <div key={day} className={`day-card ${selectedDay === day ? 'selected' : ''}`}>
                            <div className="day-header" onClick={() => setSelectedDay(selectedDay === day ? null : day)}>
                                <h4>{day}</h4>
                                <p className="focus-title">{workout.focus}</p>
                                <p className="focus-subtitle">{workout.subtitle}</p>
                                {isWorkoutCompletedToday(day) && (
                                    <span className="completed-badge">✅ Completato</span>
                                )}
                            </div>
                            
                            {selectedDay === day && (
                                <div className="day-details">
                                    <div className="exercises-list">
                                        {workout.exercises.map((exercise, index) => (
                                            <div key={index} className="exercise-item">
                                                <h5>{exercise.name}</h5>
                                                <div className="exercise-details">
                                                    <span className="sets">{exercise.sets}</span>
                                                    <span className="rest">Rest: {exercise.rest}</span>
                                                </div>
                                                <p className="notes">{exercise.notes}</p>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="day-actions">
                                        {!isWorkoutCompletedToday(day) ? (
                                            <button 
                                                className="button complete-workout-btn"
                                                onClick={() => markWorkoutCompleted(day)}
                                            >
                                                ✅ Segna come Completato
                                            </button>
                                        ) : (
                                            <p className="completed-message">💪 Ottimo lavoro! Workout completato oggi.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="workout-tips">
                <h3>💡 Principi Fondamentali - Fisico della Madonna</h3>
                <ul>
                    <li>🔥 <strong>RIR (Reps in Reserve):</strong> Mantieni sempre 1-2 ripetizioni di riserva per ottimizzare volume e recupero</li>
                    <li>⏱️ <strong>Tempi di Recupero:</strong> Rispetta rigorosamente i tempi indicati - sono calcolati per massimizzare l'effetto allenante</li>
                    <li>💪 <strong>Progressione:</strong> Aumenta il carico quando riesci a completare tutte le serie nel range alto delle ripetizioni</li>
                    <li>🎯 <strong>Forma Tecnica:</strong> La qualità del movimento è prioritaria rispetto al peso utilizzato</li>
                    <li>😴 <strong>Recupero:</strong> Il giovedì è sacro - recupero attivo essenziale per la crescita</li>
                    <li>🍽️ <strong>Nutrizione:</strong> Surplus calorico di 300-500 kcal/die + 2.2g proteine/kg corporeo</li>
                    <li>💧 <strong>Idratazione:</strong> Minimo 35ml/kg corporeo + 500ml extra nei giorni di allenamento</li>
                    <li>📈 <strong>Tracking:</strong> Tieni traccia di carichi, ripetizioni e sensazioni per ogni esercizio</li>
                    <li>🧘 <strong>Mente-Muscolo:</strong> Focus mentale sul muscolo target durante ogni ripetizione</li>
                    <li>🔄 <strong>Periodizzazione:</strong> Ogni 6-8 settimane rivaluta e modifica il programma</li>
                </ul>
            </div>
        </div>
    );
};

export default Workout;