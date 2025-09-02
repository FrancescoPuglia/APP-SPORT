import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NutritionBella = () => {
    const navigate = useNavigate();
    const [selectedDay, setSelectedDay] = useState(new Date().getDay());
    const [completedMeals, setCompletedMeals] = useState(() => {
        const saved = localStorage.getItem('completedMeals');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentStreak, setCurrentStreak] = useState(() => {
        const saved = localStorage.getItem('nutritionStreak');
        return saved ? parseInt(saved) : 0;
    });

    // TUA DIETA PERSONALIZZATA - 7 GIORNI
    const weeklyDiet = {
        0: { // Domenica
            name: "🔥 DOMENICA - RECOVERY DAY",
            color: "#ff6b6b",
            meals: [
                {
                    id: "dom-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "dom-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Omelette funzionale con superfood",
                    proteins: 32,
                    calories: 485,
                    ingredients: ["3 uova + 3 albumi", "spinaci + aglio", "1 cucchiaio EVOO", "1/4 avocado", "porridge quinoa + latte mandorla", "mirtilli + semi chia", "GOS + inulina + cacao 6g + cannella"]
                },
                {
                    id: "dom-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Tacchino curry con superfood bowl",
                    proteins: 42,
                    calories: 680,
                    ingredients: ["200g tacchino al curry", "curcuma/pepe + zenzero", "100g riso integrale", "aceto mele prima", "cavolini/broccoli + EVOO", "semi di zucca + fermentati", "150g legumi"]
                },
                {
                    id: "dom-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Shake vegano con cacao",
                    proteins: 28,
                    calories: 350,
                    ingredients: ["shake veg + spinaci", "fragole + burro mandorle", "cacao 6g", "2 quadretti fondente 90%"]
                }
            ]
        },
        1: { // Lunedì
            name: "💪 LUNEDÌ - POWER DAY",
            color: "#ff9500",
            meals: [
                {
                    id: "lun-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "lun-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Omelette funzionale completa",
                    proteins: 35,
                    calories: 520,
                    ingredients: ["3 uova + 3 albumi", "spinaci + aglio", "1 cucchiaio EVOO", "1/4 avocado", "porridge quinoa + latte mandorla", "mirtilli + semi chia", "GOS + inulina + cacao 6g + cannella"]
                },
                {
                    id: "lun-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Salmone anti-infiammatorio",
                    proteins: 45,
                    calories: 650,
                    ingredients: ["200g salmone", "curcuma + pepe + zenzero", "3/4 tazza quinoa + patata dolce", "broccoli + semi zucca + EVOO", "insalata verde + crauti/kimchi", "150g ceci/lenticchie"]
                },
                {
                    id: "lun-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Power shake al cacao",
                    proteins: 30,
                    calories: 380,
                    ingredients: ["shake proteico + banana", "spinaci + burro mandorle", "cacao 6g", "2 quadretti fondente 90%"]
                }
            ]
        },
        2: { // Martedì
            name: "🎯 MARTEDÌ - PRECISION DAY",
            color: "#4ecdc4",
            meals: [
                {
                    id: "mar-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "mar-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Pancake funzionali GF",
                    proteins: 28,
                    calories: 465,
                    ingredients: ["pancake avena GF + albume + 1 uovo + cannella", "burro d'arachidi", "fragole & lamponi", "tè verde", "1 cucchiaio EVOO a crudo"]
                },
                {
                    id: "mar-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Pollo speziato con prebiotici",
                    proteins: 48,
                    calories: 620,
                    ingredients: ["200g petto pollo", "rosmarino + cumino", "100g riso integrale", "aceto mele prima", "cavolo nero + aglio + EVOO", "1/4 avocado", "150g legumi + fermentati"]
                },
                {
                    id: "mar-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Yogurt proteico con prebiotici",
                    proteins: 25,
                    calories: 280,
                    ingredients: ["yogurt vegetale + proteine", "noci + inulina", "1 mela verde"]
                }
            ]
        },
        3: { // Mercoledì
            name: "🔋 MERCOLEDÌ - ENERGY DAY",
            color: "#45b7d1",
            meals: [
                {
                    id: "mer-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "mer-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Uova strapazzate anti-infiammatorie",
                    proteins: 30,
                    calories: 480,
                    ingredients: ["3 uova + 2 albumi", "zucchine + curcuma/pepe", "EVOO", "1/2 tazza quinoa", "semi lino + mirtilli + GOS"]
                },
                {
                    id: "mer-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Tacchino speziato con prebiotici",
                    proteins: 45,
                    calories: 650,
                    ingredients: ["200g tacchino", "curcuma + limone + zenzero", "200g patata dolce", "aceto mele prima", "spinaci + sesamo + EVOO", "150g legumi + fermentati"]
                },
                {
                    id: "mer-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Shake vegano al cacao",
                    proteins: 28,
                    calories: 360,
                    ingredients: ["shake veg + latte mandorla", "fragole + burro anacardi", "cacao 6g", "2 quadretti 90%"]
                }
            ]
        },
        4: { // Giovedì
            name: "⚡ GIOVEDÌ - THUNDER DAY",
            color: "#96ceb4",
            meals: [
                {
                    id: "gio-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "gio-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Omelette con superfood",
                    proteins: 32,
                    calories: 510,
                    ingredients: ["3 uova + 3 albumi", "zucchine/peperoni + aglio + prezzemolo", "EVOO", "1/2 avocado", "porridge amaranto + lamponi", "semi chia + inulina + cacao 6g + cannella"]
                },
                {
                    id: "gio-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Tonno con crucifere bowl",
                    proteins: 50,
                    calories: 620,
                    ingredients: ["200g tonno", "bowl crucifere (broccoli+cauli ≥250g)", "150g lenticchie nere", "cumino + zenzero + EVOO", "2-4 cucchiai fermentati"]
                },
                {
                    id: "gio-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Yogurt con superseeds",
                    proteins: 24,
                    calories: 290,
                    ingredients: ["yogurt vegetale + proteine", "mirtilli + 1-2 noci brasiliane", "1 kiwi"]
                }
            ]
        },
        5: { // Venerdì
            name: "🏆 VENERDÌ - VICTORY DAY",
            color: "#feca57",
            meals: [
                {
                    id: "ven-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "ven-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Uova strapazzate con prebiotici",
                    proteins: 30,
                    calories: 480,
                    ingredients: ["3 uova + 2 albumi", "spinaci + curcuma/pepe", "EVOO", "1/2 tazza quinoa", "semi lino + mirtilli", "GOS/inulina", "tè verde"]
                },
                {
                    id: "ven-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Manzo magro con fermentati (1x/sett)",
                    proteins: 48,
                    calories: 670,
                    ingredients: ["200g manzo magro", "200g patata dolce", "aceto mele prima", "insalata cavolo + carote", "semi girasole + EVOO", "150g legumi + fermentati"]
                },
                {
                    id: "ven-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Shake proteico al cacao",
                    proteins: 30,
                    calories: 380,
                    ingredients: ["shake proteico + latte riso", "banana + burro arachidi", "cacao 6g"]
                }
            ]
        },
        6: { // Sabato
            name: "🎉 SABATO - OMEGA DAY",
            color: "#a55eea",
            meals: [
                {
                    id: "sab-idratazione",
                    type: "💧 Idratazione & Primer",
                    time: "7:00",
                    food: "Morning Detox Protocol",
                    proteins: 2,
                    calories: 15,
                    ingredients: ["Acqua tiepida + limone + sale", "Stabilium", "Spremuta melograno (opz)"]
                },
                {
                    id: "sab-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Pancake proteici con antiossidanti",
                    proteins: 28,
                    calories: 460,
                    ingredients: ["pancake avena GF + albume + proteine", "≥150g frutti di bosco", "burro di mandorle", "tè verde + EVOO"]
                },
                {
                    id: "sab-pranzo",
                    type: "🍽️ Pranzo",
                    time: "12:30",
                    food: "Pesce azzurro con omega-3",
                    proteins: 45,
                    calories: 650,
                    ingredients: ["200g sgombro/sardine", "3/4 tazza quinoa", "aceto mele prima", "broccoli + spinaci", "semi lino + EVOO", "insalata rucola+pomodorini + fermentati", "150g legumi"]
                },
                {
                    id: "sab-snack",
                    type: "💪 Snack/Post-WO",
                    time: "15:30",
                    food: "Yogurt con omega seeds",
                    proteins: 26,
                    calories: 320,
                    ingredients: ["yogurt vegetale + proteine", "semi di chia + noci", "1 mela"]
                }
            ]
        }
    };

    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

    const toggleMeal = (mealId) => {
        const today = new Date().toDateString();
        const key = `${today}-${mealId}`;
        
        const newCompleted = {
            ...completedMeals,
            [key]: !completedMeals[key]
        };
        
        setCompletedMeals(newCompleted);
        localStorage.setItem('completedMeals', JSON.stringify(newCompleted));
        
        // Calcola streak
        updateStreak(newCompleted);
    };

    const updateStreak = (meals) => {
        const today = new Date().toDateString();
        const todayMeals = weeklyDiet[new Date().getDay()].meals;
        const completedToday = todayMeals.filter(meal => meals[`${today}-${meal.id}`]).length;
        
        if (completedToday === todayMeals.length) {
            const newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            localStorage.setItem('nutritionStreak', newStreak.toString());
        }
    };

    const isMealCompleted = (mealId) => {
        const today = new Date().toDateString();
        return completedMeals[`${today}-${mealId}`] || false;
    };

    const getDayProgress = () => {
        const today = new Date().toDateString();
        const todayMeals = weeklyDiet[selectedDay].meals;
        const completed = todayMeals.filter(meal => completedMeals[`${today}-${meal.id}`]).length;
        return Math.round((completed / todayMeals.length) * 100);
    };

    const getTotalProteins = () => {
        const today = new Date().toDateString();
        const todayMeals = weeklyDiet[selectedDay].meals;
        return todayMeals
            .filter(meal => completedMeals[`${today}-${meal.id}`])
            .reduce((total, meal) => total + meal.proteins, 0);
    };

    const getTotalCalories = () => {
        const today = new Date().toDateString();
        const todayMeals = weeklyDiet[selectedDay].meals;
        return todayMeals
            .filter(meal => completedMeals[`${today}-${meal.id}`])
            .reduce((total, meal) => total + meal.calories, 0);
    };

    // Genera calendario del mese corrente
    const generateCalendar = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        const calendar = [];
        
        // Giorni vuoti all'inizio
        for (let i = 0; i < startingDay; i++) {
            calendar.push(null);
        }
        
        // Giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            calendar.push(day);
        }
        
        return calendar;
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate();
    };

    const isDayCompleted = (day) => {
        if (!day) return false;
        const date = new Date();
        date.setDate(day);
        const dayString = date.toDateString();
        const dayOfWeek = date.getDay();
        const dayMeals = weeklyDiet[dayOfWeek].meals;
        
        const completedMealsForDay = dayMeals.filter(meal => 
            completedMeals[`${dayString}-${meal.id}`]
        ).length;
        
        return completedMealsForDay === dayMeals.length;
    };

    const calendar = generateCalendar();
    const today = new Date();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            color: 'white',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* HEADER PROFESSIONALE */}
            <div style={{
                background: 'linear-gradient(135deg, #ff9500 0%, #ff6b35 100%)',
                padding: '30px 20px',
                boxShadow: '0 4px 20px rgba(255, 149, 0, 0.3)'
            }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    ← Dashboard
                </button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ 
                            fontSize: '2.5rem', 
                            margin: '0 0 10px 0',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            🍽️ NUTRITION TRACKER PRO
                        </h1>
                        <p style={{ 
                            fontSize: '1.2rem', 
                            opacity: 0.9, 
                            margin: 0 
                        }}>
                            Piano alimentare settimanale personalizzato
                        </p>
                    </div>
                    
                    {/* STREAK COUNTER PROMINENTE */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        padding: '20px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔥</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '5px' }}>
                            {currentStreak}
                        </div>
                        <div style={{ fontSize: '1rem', opacity: 0.8 }}>GIORNI STREAK</div>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
                {/* CALENDARIO DEL MESE */}
                <div style={{
                    background: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
                    borderRadius: '20px',
                    padding: '30px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}>
                    <h2 style={{ 
                        textAlign: 'center', 
                        marginBottom: '25px',
                        fontSize: '1.8rem',
                        color: '#ff9500'
                    }}>
                        📅 {today.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }).toUpperCase()}
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        {['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'].map(day => (
                            <div key={day} style={{
                                padding: '10px',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                color: '#ff9500',
                                fontSize: '0.9rem'
                            }}>
                                {day}
                            </div>
                        ))}
                        
                        {calendar.map((day, index) => (
                            <div key={index} style={{
                                padding: '12px',
                                textAlign: 'center',
                                borderRadius: '10px',
                                cursor: day ? 'pointer' : 'default',
                                background: day ? (
                                    isToday(day) ? '#ff9500' :
                                    isDayCompleted(day) ? '#22c55e' : 
                                    'rgba(255, 255, 255, 0.05)'
                                ) : 'transparent',
                                color: day ? (
                                    isToday(day) || isDayCompleted(day) ? 'white' : '#ccc'
                                ) : 'transparent',
                                fontWeight: isToday(day) ? 'bold' : 'normal',
                                border: isToday(day) ? '2px solid white' : '1px solid transparent',
                                transform: isToday(day) ? 'scale(1.1)' : 'scale(1)',
                                transition: 'all 0.3s ease'
                            }}>
                                {day}
                                {isDayCompleted(day) && !isToday(day) && (
                                    <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>✅</div>
                                )}
                                {isToday(day) && (
                                    <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>OGGI</div>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
                        🟠 Oggi • 🟢 Giorno completato • ⚪ Da completare
                    </div>
                </div>

                {/* SELECTOR GIORNI DELLA SETTIMANA */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    overflowX: 'auto',
                    padding: '10px 0'
                }}>
                    {dayNames.map((day, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDay(index)}
                            style={{
                                padding: '15px 25px',
                                borderRadius: '25px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                minWidth: '140px',
                                whiteSpace: 'nowrap',
                                background: selectedDay === index ? weeklyDiet[index].color : 'rgba(255, 255, 255, 0.1)',
                                color: selectedDay === index ? 'white' : '#ccc',
                                transform: selectedDay === index ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.3s ease',
                                boxShadow: selectedDay === index ? `0 5px 15px ${weeklyDiet[index].color}40` : 'none'
                            }}
                        >
                            {day}
                            {index === new Date().getDay() && (
                                <div style={{ fontSize: '0.7rem', marginTop: '3px', opacity: 0.8 }}>
                                    OGGI
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* PROGRESS BAR GIORNALIERA */}
                <div style={{
                    background: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
                    borderRadius: '20px',
                    padding: '25px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}>
                    <h3 style={{ 
                        color: weeklyDiet[selectedDay].color,
                        marginBottom: '20px',
                        fontSize: '1.5rem'
                    }}>
                        {weeklyDiet[selectedDay].name}
                    </h3>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: weeklyDiet[selectedDay].color }}>
                                {getDayProgress()}%
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Completato</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
                                {getTotalProteins()}g
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Proteine</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                                {getTotalCalories()}
                            </div>
                            <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Kcal</div>
                        </div>
                    </div>
                    
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '25px',
                        height: '12px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            background: `linear-gradient(90deg, ${weeklyDiet[selectedDay].color} 0%, ${weeklyDiet[selectedDay].color}aa 100%)`,
                            height: '100%',
                            width: `${getDayProgress()}%`,
                            borderRadius: '25px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* PASTI DEL GIORNO */}
                <div style={{
                    display: 'grid',
                    gap: '20px'
                }}>
                    {weeklyDiet[selectedDay].meals.map((meal, index) => (
                        <div key={meal.id} style={{
                            background: isMealCompleted(meal.id) ? 
                                'linear-gradient(135deg, #22c55e20 0%, #22c55e10 100%)' :
                                'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)',
                            borderRadius: '20px',
                            padding: '25px',
                            border: isMealCompleted(meal.id) ? '2px solid #22c55e' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '20px'
                            }}>
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        marginBottom: '10px'
                                    }}>
                                        <h4 style={{
                                            fontSize: '1.3rem',
                                            margin: 0,
                                            color: weeklyDiet[selectedDay].color
                                        }}>
                                            {meal.type}
                                        </h4>
                                        <span style={{
                                            background: 'rgba(255, 149, 0, 0.2)',
                                            color: '#ff9500',
                                            padding: '5px 12px',
                                            borderRadius: '15px',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {meal.time}
                                        </span>
                                    </div>
                                    
                                    <h5 style={{
                                        fontSize: '1.1rem',
                                        margin: '0 0 15px 0',
                                        color: 'white'
                                    }}>
                                        {meal.food}
                                    </h5>
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '20px',
                                        marginBottom: '15px'
                                    }}>
                                        <div style={{
                                            background: 'rgba(34, 197, 94, 0.2)',
                                            color: '#22c55e',
                                            padding: '8px 15px',
                                            borderRadius: '15px',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            💪 {meal.proteins}g proteine
                                        </div>
                                        <div style={{
                                            background: 'rgba(245, 158, 11, 0.2)',
                                            color: '#f59e0b',
                                            padding: '8px 15px',
                                            borderRadius: '15px',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}>
                                            🔥 {meal.calories} kcal
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => toggleMeal(meal.id)}
                                    style={{
                                        background: isMealCompleted(meal.id) ? '#22c55e' : weeklyDiet[selectedDay].color,
                                        border: 'none',
                                        color: 'white',
                                        padding: '15px 25px',
                                        borderRadius: '25px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease',
                                        transform: 'scale(1)',
                                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                >
                                    {isMealCompleted(meal.id) ? '✅ Completato' : '⭕ Completa'}
                                </button>
                            </div>
                            
                            <div>
                                <h6 style={{
                                    color: '#aaa',
                                    fontSize: '0.9rem',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    Ingredienti:
                                </h6>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px'
                                }}>
                                    {meal.ingredients.map((ingredient, idx) => (
                                        <span key={idx} style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            color: '#ccc',
                                            padding: '5px 12px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {ingredient}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* QUICK ACTIONS */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '40px',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/analytics" style={{
                        background: 'linear-gradient(135deg, #00ffff 0%, #0ea5e9 100%)',
                        color: 'black',
                        textDecoration: 'none',
                        padding: '15px 25px',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'transform 0.3s ease',
                        boxShadow: '0 5px 15px rgba(0, 255, 255, 0.3)'
                    }}>
                        📊 Vai agli Analytics
                    </Link>
                    
                    <Link to="/supplements" style={{
                        background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)',
                        color: 'white',
                        textDecoration: 'none',
                        padding: '15px 25px',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        transition: 'transform 0.3s ease',
                        boxShadow: '0 5px 15px rgba(168, 85, 247, 0.3)'
                    }}>
                        💊 Gestione Integratori
                    </Link>
                    
                    <button 
                        onClick={() => {
                            setCompletedMeals({});
                            setCurrentStreak(0);
                            localStorage.removeItem('completedMeals');
                            localStorage.removeItem('nutritionStreak');
                        }}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '15px 25px',
                            borderRadius: '25px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            boxShadow: '0 5px 15px rgba(239, 68, 68, 0.3)'
                        }}
                    >
                        🔄 Reset Progresso
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NutritionBella;