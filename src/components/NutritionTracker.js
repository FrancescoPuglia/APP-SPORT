// Nutrition Tracker - Complete Diet Tracking System
// Sistema completo per tracciamento dieta settimanale con finestra alimentare 8-16

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { nutritionRepo } from '../firebase/firestore';
import { useAuth } from './AuthProvider';
import { logger } from '../firebase/config';

// Struttura dieta settimanale basata sulla dieta fornita
const WEEKLY_DIET_PLAN = {
    // Lunedì
    'monday': {
        colazione: {
            time: '8:00',
            foods: [
                'Omelette: 3 uova intere + 3 albumi con spinaci e olio EVO',
                '¼ avocado a fette',
                'Porridge di quinoa (½ tazza) con latte di mandorla, mirtilli, 1 cucchiaio di semi di chia',
                'Caffè nero o tè verde'
            ],
            proteins: 35,
            calories: 520
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Filetto di salmone alla piastra (200 g) con curcuma + pepe nero',
                'Quinoa (¾ tazza) + patata dolce al vapore',
                'Broccoli al vapore con semi di zucca',
                'Insalata verde con olio EVO'
            ],
            proteins: 45,
            calories: 580
        },
        snack: {
            time: '15:30',
            foods: [
                'Shake: 35 g proteine (pea/rice blend o whey isolate senza lattosio) + banana + spinaci + 1 cucchiaio burro di mandorle',
                '2 quadratini di cioccolato fondente 90%'
            ],
            proteins: 38,
            calories: 380
        }
    },
    
    // Martedì
    'tuesday': {
        colazione: {
            time: '8:00',
            foods: [
                'Pancake di avena GF: 80 g farina di avena senza glutine + albume + 1 uovo intero',
                '1 cucchiaio burro d\'arachidi',
                'Fragole e lamponi',
                'Tè verde'
            ],
            proteins: 28,
            calories: 480
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Petto di pollo (200 g) alla griglia con rosmarino',
                'Riso integrale (100 g cotto)',
                'Cavolo nero saltato in padella con aglio e olio EVO',
                '¼ avocado'
            ],
            proteins: 48,
            calories: 550
        },
        snack: {
            time: '15:30',
            foods: [
                'Yogurt vegetale (soia/cocco senza zuccheri) con 1 misurino di proteine in polvere + noci',
                '1 mela verde'
            ],
            proteins: 32,
            calories: 320
        }
    },
    
    // Mercoledì
    'wednesday': {
        colazione: {
            time: '8:00',
            foods: [
                'Uova strapazzate (3 uova intere + 2 albumi) con zucchine grigliate',
                'Quinoa (½ tazza) con semi di lino e mirtilli',
                'Caffè nero'
            ],
            proteins: 32,
            calories: 450
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Tacchino (200 g) al forno con curcuma e limone',
                'Patata dolce (200 g) al forno',
                'Spinaci saltati in padella con semi di sesamo',
                'Olio EVO a crudo'
            ],
            proteins: 46,
            calories: 520
        },
        snack: {
            time: '15:30',
            foods: [
                'Shake: proteine vegetali + latte di mandorla + fragole + 1 cucchiaio burro di anacardi',
                '2 quadratini di cioccolato fondente'
            ],
            proteins: 35,
            calories: 360
        }
    },
    
    // Giovedì
    'thursday': {
        colazione: {
            time: '8:00',
            foods: [
                'Omelette con 3 uova intere + 3 albumi + funghi e prezzemolo',
                '½ avocado',
                'Porridge di amaranto con lamponi e semi di chia',
                'Tè verde'
            ],
            proteins: 36,
            calories: 510
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Filetto di tonno (200 g) alla piastra con limone',
                'Riso basmati (100 g cotto)',
                'Broccoli e cavolfiori al vapore',
                'Semi di zucca e olio EVO'
            ],
            proteins: 50,
            calories: 540
        },
        snack: {
            time: '15:30',
            foods: [
                'Yogurt vegetale con proteine in polvere + mirtilli + noci brasiliane',
                '1 kiwi'
            ],
            proteins: 30,
            calories: 310
        }
    },
    
    // Venerdì
    'friday': {
        colazione: {
            time: '8:00',
            foods: [
                'Uova strapazzate (3 intere + 2 albumi) con spinaci e curcuma',
                'Quinoa (½ tazza) con semi di lino e mirtilli',
                'Caffè nero'
            ],
            proteins: 32,
            calories: 450
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Manzo magro (200 g, ad es. taglio roast-beef) alla piastra',
                'Patata dolce (200 g)',
                'Insalata di cavolo cappuccio, carote e semi di girasole con olio EVO'
            ],
            proteins: 52,
            calories: 580
        },
        snack: {
            time: '15:30',
            foods: [
                'Shake: proteine vegetali/whey isolate + latte di riso + banana + 1 cucchiaio burro di arachidi',
                '2 quadratini cioccolato fondente'
            ],
            proteins: 38,
            calories: 400
        }
    },
    
    // Sabato
    'saturday': {
        colazione: {
            time: '8:00',
            foods: [
                'Pancake proteici (farina di avena GF + albume + proteine in polvere)',
                'Frutti di bosco freschi',
                '1 cucchiaio di burro di mandorle',
                'Tè verde'
            ],
            proteins: 35,
            calories: 490
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Filetto di sgombro o sardine (200 g) con erbe aromatiche',
                'Quinoa (¾ tazza)',
                'Broccoli e spinaci al vapore con semi di lino',
                'Insalata di pomodorini e rucola'
            ],
            proteins: 48,
            calories: 560
        },
        snack: {
            time: '15:30',
            foods: [
                'Yogurt vegetale + proteine in polvere + semi di chia + noci',
                '1 mela'
            ],
            proteins: 32,
            calories: 330
        }
    },
    
    // Domenica
    'sunday': {
        colazione: {
            time: '8:00',
            foods: [
                'Omelette con 3 uova intere + 3 albumi + funghi + cipolla',
                '½ avocado',
                'Porridge di quinoa con cannella, mirtilli e semi di chia',
                'Caffè nero'
            ],
            proteins: 36,
            calories: 520
        },
        pranzo: {
            time: '12:30',
            foods: [
                'Petto di tacchino (200 g) al curry con curcuma/pepe',
                'Riso integrale (100 g cotto)',
                'Cavolini di Bruxelles o broccoli al vapore',
                'Semi di zucca + olio EVO'
            ],
            proteins: 48,
            calories: 550
        },
        snack: {
            time: '15:30',
            foods: [
                'Shake: proteine vegetali + spinaci + fragole + burro di mandorle',
                '2 quadratini di cioccolato fondente'
            ],
            proteins: 38,
            calories: 390
        }
    }
};

const DAYS_MAP = {
    0: 'sunday',
    1: 'monday', 
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
};

const MEAL_TYPES = [
    { key: 'colazione', label: '🌅 Colazione', time: '8:00' },
    { key: 'pranzo', label: '🍽️ Pranzo', time: '12:30' },
    { key: 'snack', label: '💪 Post-Workout', time: '15:30' }
];

const NutritionTracker = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekDays, setWeekDays] = useState([]);
    const [dailyMeals, setDailyMeals] = useState({});
    const [loading, setLoading] = useState(false);
    const [weeklyStats, setWeeklyStats] = useState(null);
    
    // Carica settimana e dati
    useEffect(() => {
        if (!user) return;
        
        const startWeek = startOfWeek(selectedDate, { locale: it });
        const endWeek = endOfWeek(selectedDate, { locale: it });
        const days = eachDayOfInterval({ start: startWeek, end: endWeek });
        
        setWeekDays(days);
        loadWeekData(days);
    }, [selectedDate, user]);

    // Carica dati della settimana
    const loadWeekData = async (days) => {
        if (!days.length) return;
        
        setLoading(true);
        try {
            const startDate = format(days[0], 'yyyy-MM-dd');
            const endDate = format(days[days.length - 1], 'yyyy-MM-dd');
            
            // Carica pasti della settimana
            const mealsResult = await nutritionRepo.getUserMeals(startDate, endDate);
            
            if (mealsResult.success) {
                // Organizza pasti per giorno
                const mealsByDay = {};
                days.forEach(day => {
                    const dayKey = format(day, 'yyyy-MM-dd');
                    mealsByDay[dayKey] = {
                        colazione: null,
                        pranzo: null,
                        snack: null
                    };
                });
                
                mealsResult.data.forEach(meal => {
                    if (mealsByDay[meal.date]) {
                        mealsByDay[meal.date][meal.mealType] = meal;
                    }
                });
                
                setDailyMeals(mealsByDay);
                
                // Calcola statistiche settimanali
                calculateWeeklyStats(mealsResult.data);
            }
            
        } catch (error) {
            logger.error('Errore caricamento dati nutrition', error);
        } finally {
            setLoading(false);
        }
    };

    // Calcola statistiche settimanali
    const calculateWeeklyStats = (meals) => {
        const completedMeals = meals.filter(m => m.status === 'completed');
        const totalMeals = meals.length;
        const adherenceRate = totalMeals > 0 ? (completedMeals.length / totalMeals) * 100 : 0;
        
        // Calcola proteine totali
        const totalProteins = completedMeals.reduce((sum, meal) => sum + (meal.proteins || 0), 0);
        const avgProteinsPerDay = totalProteins / 7; // Media su 7 giorni
        
        // Conta pasti per tipo
        const mealTypeStats = {};
        MEAL_TYPES.forEach(mealType => {
            const typeMeals = meals.filter(m => m.mealType === mealType.key);
            const completedTypeMeals = typeMeals.filter(m => m.status === 'completed');
            mealTypeStats[mealType.key] = {
                total: typeMeals.length,
                completed: completedTypeMeals.length,
                adherence: typeMeals.length > 0 ? (completedTypeMeals.length / typeMeals.length) * 100 : 0
            };
        });
        
        setWeeklyStats({
            adherenceRate: Math.round(adherenceRate),
            totalProteins: Math.round(totalProteins),
            avgProteinsPerDay: Math.round(avgProteinsPerDay),
            mealTypeStats,
            totalMeals,
            completedMeals: completedMeals.length
        });
    };

    // Ottieni piano pasti per giorno
    const getDayMealPlan = (date) => {
        const dayName = DAYS_MAP[date.getDay()];
        return WEEKLY_DIET_PLAN[dayName] || {};
    };

    // Toggle stato pasto
    const toggleMealStatus = async (date, mealType) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const currentMeal = dailyMeals[dateStr]?.[mealType];
        
        setLoading(true);
        try {
            let result;
            
            if (!currentMeal) {
                // Crea nuovo pasto
                const mealPlan = getDayMealPlan(date)[mealType];
                const mealData = {
                    date: dateStr,
                    mealType,
                    status: 'completed',
                    proteins: mealPlan?.proteins || 0,
                    calories: mealPlan?.calories || 0,
                    plannedFoods: mealPlan?.foods || [],
                    completedAt: new Date().toISOString()
                };
                
                result = await nutritionRepo.logMeal(mealData);
                
                if (result.success) {
                    // Aggiorna stato locale
                    setDailyMeals(prev => ({
                        ...prev,
                        [dateStr]: {
                            ...prev[dateStr],
                            [mealType]: result.data
                        }
                    }));
                }
            } else {
                // Cambia stato esistente
                const newStatus = currentMeal.status === 'completed' ? 'skipped' : 'completed';
                result = await nutritionRepo.updateMealStatus(currentMeal.id, newStatus);
                
                if (result.success) {
                    // Aggiorna stato locale
                    setDailyMeals(prev => ({
                        ...prev,
                        [dateStr]: {
                            ...prev[dateStr],
                            [mealType]: {
                                ...currentMeal,
                                status: newStatus,
                                completedAt: newStatus === 'completed' ? new Date().toISOString() : null
                            }
                        }
                    }));
                }
            }
            
            // Ricarica statistiche
            if (result.success) {
                setTimeout(() => loadWeekData(weekDays), 100);
            }
            
        } catch (error) {
            logger.error('Errore toggle meal status', error);
        } finally {
            setLoading(false);
        }
    };

    // Naviga settimana
    const navigateWeek = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setSelectedDate(newDate);
    };

    if (!user) {
        return (
            <div className="nutrition-tracker">
                <div className="auth-required">
                    <h2>🔐 Login Richiesto</h2>
                    <p>Effettua il login per tracciare la tua dieta</p>
                </div>
            </div>
        );
    }

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

            {/* Controlli settimana */}
            <div className="week-controls">
                <button 
                    className="week-nav-btn"
                    onClick={() => navigateWeek(-1)}
                    disabled={loading}
                >
                    ← Settimana Precedente
                </button>
                
                <h3 className="current-week">
                    {format(weekDays[0] || new Date(), 'dd MMM', { locale: it })} - {' '}
                    {format(weekDays[6] || new Date(), 'dd MMM yyyy', { locale: it })}
                </h3>
                
                <button 
                    className="week-nav-btn"
                    onClick={() => navigateWeek(1)}
                    disabled={loading}
                >
                    Settimana Successiva →
                </button>
            </div>

            {/* Statistiche settimanali */}
            {weeklyStats && (
                <div className="weekly-stats">
                    <div className="stat-card nutrition">
                        <h4>📊 Aderenza Dieta</h4>
                        <div className="stat-value">{weeklyStats.adherenceRate}%</div>
                        <div className="stat-detail">
                            {weeklyStats.completedMeals}/{weeklyStats.totalMeals} pasti completati
                        </div>
                    </div>
                    
                    <div className="stat-card proteins">
                        <h4>💪 Proteine Settimanali</h4>
                        <div className="stat-value">{weeklyStats.totalProteins}g</div>
                        <div className="stat-detail">
                            Média: {weeklyStats.avgProteinsPerDay}g/giorno
                        </div>
                    </div>
                    
                    <div className="stat-card target">
                        <h4>🎯 Obiettivo Giornaliero</h4>
                        <div className="stat-value">~150g</div>
                        <div className="stat-detail">
                            Proteine per massima crescita
                        </div>
                    </div>
                </div>
            )}

            {/* Breakdown per tipo pasto */}
            {weeklyStats?.mealTypeStats && (
                <div className="meal-type-breakdown">
                    <h4>📋 Performance per Pasto</h4>
                    <div className="breakdown-grid">
                        {MEAL_TYPES.map(mealType => {
                            const stats = weeklyStats.mealTypeStats[mealType.key];
                            return (
                                <div key={mealType.key} className="breakdown-item">
                                    <span className="meal-label">{mealType.label}</span>
                                    <div className="breakdown-bar">
                                        <div 
                                            className="breakdown-fill"
                                            style={{ width: `${stats?.adherence || 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="breakdown-percentage">
                                        {Math.round(stats?.adherence || 0)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Griglia settimanale */}
            <div className="weekly-grid">
                {weekDays.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayMeals = dailyMeals[dateStr] || {};
                    const mealPlan = getDayMealPlan(day);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                        <div key={dateStr} className={`day-card ${isToday ? 'today' : ''}`}>
                            <div className="day-header">
                                <h4>{format(day, 'EEEE', { locale: it })}</h4>
                                <span className="day-date">{format(day, 'dd/MM')}</span>
                            </div>
                            
                            <div className="day-meals">
                                {MEAL_TYPES.map(mealType => {
                                    const meal = dayMeals[mealType.key];
                                    const plannedMeal = mealPlan[mealType.key];
                                    const isCompleted = meal?.status === 'completed';
                                    const isSkipped = meal?.status === 'skipped';
                                    
                                    return (
                                        <div 
                                            key={mealType.key}
                                            className={`meal-item ${
                                                isCompleted ? 'completed' : 
                                                isSkipped ? 'skipped' : ''
                                            }`}
                                        >
                                            <div className="meal-header">
                                                <span className="meal-time">{mealType.time}</span>
                                                <span className="meal-name">{mealType.label}</span>
                                            </div>
                                            
                                            <div className="meal-content">
                                                {plannedMeal && (
                                                    <div className="meal-summary">
                                                        <div className="meal-macros">
                                                            <span className="proteins">
                                                                💪 {plannedMeal.proteins}g prot
                                                            </span>
                                                            <span className="calories">
                                                                🔥 {plannedMeal.calories} kcal
                                                            </span>
                                                        </div>
                                                        
                                                        <div className="meal-foods">
                                                            {plannedMeal.foods.slice(0, 2).map((food, idx) => (
                                                                <div key={idx} className="food-item">
                                                                    • {food}
                                                                </div>
                                                            ))}
                                                            {plannedMeal.foods.length > 2 && (
                                                                <div className="food-more">
                                                                    +{plannedMeal.foods.length - 2} altro/i
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <button
                                                className={`meal-toggle ${
                                                    isCompleted ? 'completed' : 
                                                    isSkipped ? 'skipped' : 'pending'
                                                }`}
                                                onClick={() => toggleMealStatus(day, mealType.key)}
                                                disabled={loading}
                                            >
                                                {isCompleted ? (
                                                    <>✅ Completato</>
                                                ) : isSkipped ? (
                                                    <>❌ Saltato</>
                                                ) : (
                                                    <>⭕ Clicca per completare</>
                                                )}
                                            </button>
                                            
                                            {meal?.completedAt && (
                                                <div className="completion-time">
                                                    Completato: {format(new Date(meal.completedAt), 'HH:mm')}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading && (
                <div className="nutrition-loading">
                    <div className="loading-spinner"></div>
                    <p>Aggiornamento dati nutrition...</p>
                </div>
            )}
            
            {/* Info digiuno serale */}
            <div className="fasting-info">
                <h4>🌙 Digiuno Serale</h4>
                <p>
                    <strong>Dopo le 16:00</strong>: Solo acqua, tisane o tè senza zucchero.
                    Il digiuno intermittente 8:16 ottimizza il metabolismo, migliora la sensibilità insulinica 
                    e favorisce l'autofagia per il recupero cellulare.
                </p>
            </div>
        </div>
    );
};

export default NutritionTracker;