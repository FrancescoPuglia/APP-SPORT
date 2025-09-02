// Simplified Nutrition Tracker - Debug version
import React, { useState, useEffect } from 'react';
// import { useAuth } from './AuthProvider';

const SimpleNutritionTracker = () => {
    // const { user } = useAuth();
    const [selectedMeals, setSelectedMeals] = useState(() => {
        const saved = localStorage.getItem('simpleNutritionMeals');
        return saved ? JSON.parse(saved) : {};
    });

    const MEALS = [
        { id: 'colazione', name: '🌅 Colazione', time: '8:00' },
        { id: 'pranzo', name: '🍽️ Pranzo', time: '12:30' },
        { id: 'snack', name: '💪 Post-Workout', time: '15:30' }
    ];

    const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

    const toggleMeal = (day, mealId) => {
        const key = `${day}-${mealId}`;
        const newMeals = {
            ...selectedMeals,
            [key]: !selectedMeals[key]
        };
        
        setSelectedMeals(newMeals);
        localStorage.setItem('simpleNutritionMeals', JSON.stringify(newMeals));
        
        // 🔥 TRIGGER EVENTO PER SINCRONIZZAZIONE
        window.dispatchEvent(new CustomEvent('mealToggled', { 
            detail: { 
                day, 
                mealId, 
                completed: !selectedMeals[key],
                simple: true 
            } 
        }));
    };

    const getMealStatus = (day, mealId) => {
        return selectedMeals[`${day}-${mealId}`] || false;
    };

    // Autenticazione disabilitata

    return (
        <div className="nutrition-tracker">
            <div className="nutrition-header">
                <h2>🥗 Nutrition Tracker</h2>
                <div className="eating-window">
                    <span className="window-info">
                        ⏰ <strong>Finestra Alimentare:</strong> 8:00 - 16:00 
                        <small>(Digiuno serale dopo le 16:00)</small>
                    </span>
                </div>
            </div>

            {/* Grid settimanale semplificata */}
            <div className="weekly-grid">
                {DAYS.map(day => (
                    <div key={day} className="day-card">
                        <div className="day-header">
                            <h4>{day}</h4>
                        </div>
                        
                        <div className="day-meals">
                            {MEALS.map(meal => {
                                const isCompleted = getMealStatus(day, meal.id);
                                
                                return (
                                    <div 
                                        key={meal.id}
                                        className={`meal-item ${isCompleted ? 'completed' : ''}`}
                                    >
                                        <div className="meal-header">
                                            <span className="meal-time">{meal.time}</span>
                                            <span className="meal-name">{meal.name}</span>
                                        </div>
                                        
                                        <button
                                            className={`meal-toggle ${isCompleted ? 'completed' : 'pending'}`}
                                            onClick={() => toggleMeal(day, meal.id)}
                                        >
                                            {isCompleted ? '✅ Completato' : '⭕ Clicca per completare'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Info digiuno */}
            <div className="fasting-info">
                <h4>🌙 Digiuno Serale</h4>
                <p>
                    <strong>Dopo le 16:00</strong>: Solo acqua, tisane o tè senza zucchero.
                    Il digiuno intermittente 8:16 ottimizza il metabolismo!
                </p>
            </div>

            <div style={{padding: '20px', textAlign: 'center', marginTop: '20px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '10px'}}>
                <p style={{color: '#22c55e'}}>
                    ✅ <strong>Nutrition Tracker Funzionale!</strong><br/>
                    Clicca sui pulsanti per tracciare i pasti.<br/>
                    Questa è la versione semplificata di debug.
                </p>
            </div>
        </div>
    );
};

export default SimpleNutritionTracker;