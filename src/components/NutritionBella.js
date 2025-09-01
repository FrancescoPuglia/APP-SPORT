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

    // DIETA SETTIMANALE COMPLETA - 7 GIORNI CON GRAFICA BELLA
    const weeklyDiet = {
        0: { // Domenica
            name: "🔥 DOMENICA - RECOVERY DAY",
            color: "#ff6b6b",
            meals: [
                {
                    id: "dom-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Pancakes proteici con mirtilli",
                    proteins: 28,
                    calories: 420,
                    ingredients: ["3 uova", "50g farina avena", "1 scoop whey", "100g mirtilli"]
                },
                {
                    id: "dom-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Salmone grigliato con riso basmati",
                    proteins: 35,
                    calories: 580,
                    ingredients: ["150g salmone", "80g riso", "1/2 avocado", "verdure miste"]
                },
                {
                    id: "dom-snack",
                    type: "🥤 Snack",
                    time: "16:30",
                    food: "Smoothie proteico alla banana",
                    proteins: 25,
                    calories: 380,
                    ingredients: ["1 scoop whey", "1 banana", "20g burro arachidi", "250ml latte"]
                },
                {
                    id: "dom-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Petto di pollo con patate dolci",
                    proteins: 40,
                    calories: 520,
                    ingredients: ["180g petto pollo", "200g patate dolci", "150g broccoli"]
                }
            ]
        },
        1: { // Lunedì
            name: "💪 LUNEDÌ - POWER DAY",
            color: "#ff9500",
            meals: [
                {
                    id: "lun-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Uova strapazzate con pane ezekiel",
                    proteins: 32,
                    calories: 450,
                    ingredients: ["4 uova", "2 fette pane ezekiel", "100g spinaci", "10g olio oliva"]
                },
                {
                    id: "lun-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:00",
                    food: "Banana con BCAA",
                    proteins: 8,
                    calories: 150,
                    ingredients: ["1 banana media", "5g BCAA", "caffè nero"]
                },
                {
                    id: "lun-postworkout",
                    type: "💥 Post-Workout",
                    time: "13:30",
                    food: "Whey shake con avena",
                    proteins: 30,
                    calories: 400,
                    ingredients: ["1.5 scoop whey", "40g avena", "15g miele"]
                },
                {
                    id: "lun-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:00",
                    food: "Manzo magro con quinoa",
                    proteins: 45,
                    calories: 620,
                    ingredients: ["200g manzo magro", "80g quinoa", "verdure miste", "olio oliva"]
                },
                {
                    id: "lun-cena",
                    type: "🌙 Cena",
                    time: "20:30",
                    food: "Merluzzo con riso integrale",
                    proteins: 38,
                    calories: 480,
                    ingredients: ["180g merluzzo", "70g riso integrale", "200g asparagi"]
                }
            ]
        },
        2: { // Martedì
            name: "🎯 MARTEDÌ - PRECISION DAY",
            color: "#4ecdc4",
            meals: [
                {
                    id: "mar-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Yogurt greco con granola",
                    proteins: 25,
                    calories: 380,
                    ingredients: ["200g yogurt greco 0%", "40g granola", "100g frutti bosco"]
                },
                {
                    id: "mar-spuntino",
                    type: "🍎 Spuntino",
                    time: "10:30",
                    food: "Mela con mandorle e ricotta",
                    proteins: 18,
                    calories: 280,
                    ingredients: ["1 mela", "20g mandorle", "100g ricotta"]
                },
                {
                    id: "mar-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Tacchino con farro",
                    proteins: 42,
                    calories: 540,
                    ingredients: ["180g tacchino", "80g farro", "200g zucchine", "olio EVO"]
                },
                {
                    id: "mar-snack",
                    type: "🥤 Snack",
                    time: "16:00",
                    food: "Caseine con noci",
                    proteins: 28,
                    calories: 350,
                    ingredients: ["1 scoop caseine", "15g noci", "2 datteri"]
                },
                {
                    id: "mar-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Tonno con pasta integrale",
                    proteins: 35,
                    calories: 500,
                    ingredients: ["150g tonno fresco", "70g pasta integrale", "200g pomodorini"]
                }
            ]
        },
        3: { // Mercoledì
            name: "🔋 MERCOLEDÌ - ENERGY DAY",
            color: "#45b7d1",
            meals: [
                {
                    id: "mer-colazione",
                    type: "🌅 Colazione",
                    time: "7:45",
                    food: "Porridge proteico con banana",
                    proteins: 30,
                    calories: 420,
                    ingredients: ["50g avena", "1 scoop whey", "1 banana", "cannella"]
                },
                {
                    id: "mer-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:30",
                    food: "Toast integrale con marmellata",
                    proteins: 8,
                    calories: 180,
                    ingredients: ["2 fette toast", "15g marmellata", "caffè"]
                },
                {
                    id: "mer-postworkout",
                    type: "💥 Post-Workout",
                    time: "14:00",
                    food: "Recovery shake completo",
                    proteins: 25,
                    calories: 320,
                    ingredients: ["1 scoop whey", "30g malto", "5g creatina"]
                },
                {
                    id: "mer-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:30",
                    food: "Pollo curry con riso basmati",
                    proteins: 40,
                    calories: 580,
                    ingredients: ["170g pollo", "80g riso", "curry", "verdure miste"]
                },
                {
                    id: "mer-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Orata con quinoa",
                    proteins: 36,
                    calories: 460,
                    ingredients: ["160g orata", "70g quinoa", "150g spinaci"]
                }
            ]
        },
        4: { // Giovedì
            name: "⚡ GIOVEDÌ - THUNDER DAY",
            color: "#96ceb4",
            meals: [
                {
                    id: "gio-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Frittata con pane integrale",
                    proteins: 28,
                    calories: 400,
                    ingredients: ["3 uova", "2 fette pane", "100g pomodori", "basilico"]
                },
                {
                    id: "gio-spuntino",
                    type: "🥜 Spuntino",
                    time: "10:00",
                    food: "Parmigiano con noci e pera",
                    proteins: 20,
                    calories: 320,
                    ingredients: ["30g parmigiano", "20g noci", "1 pera media"]
                },
                {
                    id: "gio-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Bistecca con patate",
                    proteins: 48,
                    calories: 650,
                    ingredients: ["200g bistecca", "200g patate", "50g rucola", "olio EVO"]
                },
                {
                    id: "gio-snack",
                    type: "🍓 Snack",
                    time: "16:30",
                    food: "Smoothie verde proteico",
                    proteins: 26,
                    calories: 280,
                    ingredients: ["spinaci", "banana", "1 scoop whey", "acqua cocco"]
                },
                {
                    id: "gio-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Gamberi con pasta e zucchine",
                    proteins: 32,
                    calories: 480,
                    ingredients: ["150g gamberi", "70g pasta", "200g zucchine"]
                }
            ]
        },
        5: { // Venerdì
            name: "🏆 VENERDÌ - VICTORY DAY",
            color: "#feca57",
            meals: [
                {
                    id: "ven-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Muesli proteico completo",
                    proteins: 32,
                    calories: 450,
                    ingredients: ["50g muesli", "250ml latte", "1 scoop whey", "frutti bosco"]
                },
                {
                    id: "ven-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:00",
                    food: "Energy balls con caffè",
                    proteins: 12,
                    calories: 220,
                    ingredients: ["3 energy balls fatti in casa", "caffè nero"]
                },
                {
                    id: "ven-postworkout",
                    type: "💥 Post-Workout",
                    time: "13:30",
                    food: "Recovery shake deluxe",
                    proteins: 35,
                    calories: 420,
                    ingredients: ["1.5 scoop whey", "banana", "latte", "miele", "avena"]
                },
                {
                    id: "ven-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:00",
                    food: "Salmone con quinoa e avocado",
                    proteins: 38,
                    calories: 580,
                    ingredients: ["160g salmone", "80g quinoa", "1/2 avocado", "lime"]
                },
                {
                    id: "ven-aperitivo",
                    type: "🍻 Aperitivo",
                    time: "18:30",
                    food: "Hummus con verdure",
                    proteins: 15,
                    calories: 280,
                    ingredients: ["60g hummus", "verdure crude", "crackers integrali"]
                },
                {
                    id: "ven-cena",
                    type: "🌙 Cena",
                    time: "21:00",
                    food: "Pizza proteica fatta in casa",
                    proteins: 35,
                    calories: 520,
                    ingredients: ["base proteica", "pomodoro", "mozzarella", "prosciutto"]
                }
            ]
        },
        6: { // Sabato
            name: "🎉 SABATO - CHEAT DAY",
            color: "#a55eea",
            meals: [
                {
                    id: "sab-colazione",
                    type: "🌅 Colazione",
                    time: "9:00",
                    food: "Pancakes proteici deluxe",
                    proteins: 35,
                    calories: 550,
                    ingredients: ["pancakes proteici", "sciroppo acero", "3 fette bacon"]
                },
                {
                    id: "sab-brunch",
                    type: "🥐 Brunch",
                    time: "11:30",
                    food: "Avocado toast gourmet",
                    proteins: 30,
                    calories: 480,
                    ingredients: ["pane integrale", "avocado", "2 uova", "salmone affumicato"]
                },
                {
                    id: "sab-pranzo",
                    type: "🍽️ Pranzo",
                    time: "14:00",
                    food: "Burger proteico premium",
                    proteins: 45,
                    calories: 680,
                    ingredients: ["180g carne", "panino integrale", "patate dolci", "insalata"]
                },
                {
                    id: "sab-snack",
                    type: "🍨 Snack",
                    time: "17:00",
                    food: "Gelato proteico fatto in casa",
                    proteins: 20,
                    calories: 250,
                    ingredients: ["whey", "latte", "frutta", "dolcificante"]
                },
                {
                    id: "sab-cena",
                    type: "🌙 Cena",
                    time: "20:30",
                    food: "Grigliata mista premium",
                    proteins: 50,
                    calories: 720,
                    ingredients: ["carne mista", "verdure grigliate", "pane integrale"]
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