import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nutrition = () => {
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

    // DIETA SETTIMANALE COMPLETA - 7 GIORNI
    const weeklyDiet = {
        0: { // Domenica
            name: "🔥 DOMENICA - RECOVERY DAY",
            meals: [
                {
                    id: "dom-colazione",
                    type: "🌅 Colazione",
                    time: "8:00",
                    food: "Pancakes proteici + mirtilli + sciroppo d'acero",
                    proteins: 28,
                    calories: 420,
                    ingredients: ["3 uova", "50g farina avena", "1 scoop whey", "100g mirtilli"]
                },
                {
                    id: "dom-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Salmone grigliato + riso basmati + avocado",
                    proteins: 35,
                    calories: 580,
                    ingredients: ["150g salmone", "80g riso", "1/2 avocado", "verdure miste"]
                },
                {
                    id: "dom-snack",
                    type: "🥤 Snack",
                    time: "16:30",
                    food: "Smoothie proteico + banana + burro arachidi",
                    proteins: 25,
                    calories: 380,
                    ingredients: ["1 scoop whey", "1 banana", "20g burro arachidi", "250ml latte"]
                },
                {
                    id: "dom-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Petto pollo + patate dolci + broccoli",
                    proteins: 40,
                    calories: 520,
                    ingredients: ["180g petto pollo", "200g patate dolci", "150g broccoli"]
                }
            ]
        },
        1: { // Lunedì
            name: "💪 LUNEDÌ - POWER DAY",
            meals: [
                {
                    id: "lun-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Uova strapazzate + pane ezekiel + spinaci",
                    proteins: 32,
                    calories: 450,
                    ingredients: ["4 uova", "2 fette pane ezekiel", "100g spinaci", "10g olio oliva"]
                },
                {
                    id: "lun-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:00",
                    food: "Banana + caffè + BCAA",
                    proteins: 8,
                    calories: 150,
                    ingredients: ["1 banana media", "5g BCAA", "caffè nero"]
                },
                {
                    id: "lun-postworkout",
                    type: "💥 Post-Workout",
                    time: "13:30",
                    food: "Whey shake + avena + miele",
                    proteins: 30,
                    calories: 400,
                    ingredients: ["1.5 scoop whey", "40g avena", "15g miele"]
                },
                {
                    id: "lun-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:00",
                    food: "Manzo magro + quinoa + verdure grigliate",
                    proteins: 45,
                    calories: 620,
                    ingredients: ["200g manzo magro", "80g quinoa", "verdure miste", "olio oliva"]
                },
                {
                    id: "lun-cena",
                    type: "🌙 Cena",
                    time: "20:30",
                    food: "Merluzzo + riso integrale + asparagi",
                    proteins: 38,
                    calories: 480,
                    ingredients: ["180g merluzzo", "70g riso integrale", "200g asparagi"]
                }
            ]
        },
        2: { // Martedì
            name: "🎯 MARTEDÌ - PRECISION DAY",
            meals: [
                {
                    id: "mar-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Yogurt greco + granola + frutti bosco",
                    proteins: 25,
                    calories: 380,
                    ingredients: ["200g yogurt greco 0%", "40g granola", "100g frutti bosco"]
                },
                {
                    id: "mar-spuntino",
                    type: "🍎 Spuntino",
                    time: "10:30",
                    food: "Mela + mandorle + ricotta",
                    proteins: 18,
                    calories: 280,
                    ingredients: ["1 mela", "20g mandorle", "100g ricotta"]
                },
                {
                    id: "mar-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Tacchino + farro + zucchine grigliate",
                    proteins: 42,
                    calories: 540,
                    ingredients: ["180g tacchino", "80g farro", "200g zucchine", "olio EVO"]
                },
                {
                    id: "mar-snack",
                    type: "🥤 Snack",
                    time: "16:00",
                    food: "Caseine + noci + datteri",
                    proteins: 28,
                    calories: 350,
                    ingredients: ["1 scoop caseine", "15g noci", "2 datteri"]
                },
                {
                    id: "mar-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Tonno + pasta integrale + pomodorini",
                    proteins: 35,
                    calories: 500,
                    ingredients: ["150g tonno fresco", "70g pasta integrale", "200g pomodorini"]
                }
            ]
        },
        3: { // Mercoledì
            name: "🔋 MERCOLEDÌ - ENERGY DAY",
            meals: [
                {
                    id: "mer-colazione",
                    type: "🌅 Colazione",
                    time: "7:45",
                    food: "Porridge proteico + banana + cannella",
                    proteins: 30,
                    calories: 420,
                    ingredients: ["50g avena", "1 scoop whey", "1 banana", "cannella"]
                },
                {
                    id: "mer-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:30",
                    food: "Toast integrale + marmellata + caffè",
                    proteins: 8,
                    calories: 180,
                    ingredients: ["2 fette toast", "15g marmellata", "caffè"]
                },
                {
                    id: "mer-postworkout",
                    type: "💥 Post-Workout",
                    time: "14:00",
                    food: "Whey + maltodestrine + creatina",
                    proteins: 25,
                    calories: 320,
                    ingredients: ["1 scoop whey", "30g malto", "5g creatina"]
                },
                {
                    id: "mer-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:30",
                    food: "Pollo curry + riso basmati + verdure",
                    proteins: 40,
                    calories: 580,
                    ingredients: ["170g pollo", "80g riso", "curry", "verdure miste"]
                },
                {
                    id: "mer-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Orata + quinoa + spinaci saltati",
                    proteins: 36,
                    calories: 460,
                    ingredients: ["160g orata", "70g quinoa", "150g spinaci"]
                }
            ]
        },
        4: { // Giovedì
            name: "⚡ GIOVEDÌ - THUNDER DAY",
            meals: [
                {
                    id: "gio-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Frittata + pane integrale + pomodori",
                    proteins: 28,
                    calories: 400,
                    ingredients: ["3 uova", "2 fette pane", "100g pomodori", "basilico"]
                },
                {
                    id: "gio-spuntino",
                    type: "🥜 Spuntino",
                    time: "10:00",
                    food: "Parmigiano + noci + pera",
                    proteins: 20,
                    calories: 320,
                    ingredients: ["30g parmigiano", "20g noci", "1 pera media"]
                },
                {
                    id: "gio-pranzo",
                    type: "🍽️ Pranzo",
                    time: "13:00",
                    food: "Bistecca + patate + rucola",
                    proteins: 48,
                    calories: 650,
                    ingredients: ["200g bistecca", "200g patate", "50g rucola", "olio EVO"]
                },
                {
                    id: "gio-snack",
                    type: "🍓 Snack",
                    time: "16:30",
                    food: "Smoothie verde + proteine",
                    proteins: 26,
                    calories: 280,
                    ingredients: ["spinaci", "banana", "1 scoop whey", "acqua cocco"]
                },
                {
                    id: "gio-cena",
                    type: "🌙 Cena",
                    time: "20:00",
                    food: "Gamberi + pasta + zucchine",
                    proteins: 32,
                    calories: 480,
                    ingredients: ["150g gamberi", "70g pasta", "200g zucchine"]
                }
            ]
        },
        5: { // Venerdì
            name: "🏆 VENERDÌ - VICTORY DAY",
            meals: [
                {
                    id: "ven-colazione",
                    type: "🌅 Colazione",
                    time: "7:30",
                    food: "Muesli proteico + latte + frutti bosco",
                    proteins: 32,
                    calories: 450,
                    ingredients: ["50g muesli", "250ml latte", "1 scoop whey", "frutti bosco"]
                },
                {
                    id: "ven-preworkout",
                    type: "⚡ Pre-Workout",
                    time: "11:00",
                    food: "Energy balls + caffè",
                    proteins: 12,
                    calories: 220,
                    ingredients: ["3 energy balls fatti in casa", "caffè nero"]
                },
                {
                    id: "ven-postworkout",
                    type: "💥 Post-Workout",
                    time: "13:30",
                    food: "Recovery shake completo",
                    proteins: 35,
                    calories: 420,
                    ingredients: ["1.5 scoop whey", "banana", "latte", "miele", "avena"]
                },
                {
                    id: "ven-pranzo",
                    type: "🍽️ Pranzo",
                    time: "15:00",
                    food: "Salmone + quinoa + avocado",
                    proteins: 38,
                    calories: 580,
                    ingredients: ["160g salmone", "80g quinoa", "1/2 avocado", "lime"]
                },
                {
                    id: "ven-aperitivo",
                    type: "🍻 Aperitivo",
                    time: "18:30",
                    food: "Hummus + verdure + crackers",
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
            meals: [
                {
                    id: "sab-colazione",
                    type: "🌅 Colazione",
                    time: "9:00",
                    food: "Pancakes proteici + sciroppo + bacon",
                    proteins: 35,
                    calories: 550,
                    ingredients: ["pancakes proteici", "sciroppo acero", "3 fette bacon"]
                },
                {
                    id: "sab-brunch",
                    type: "🥐 Brunch",
                    time: "11:30",
                    food: "Avocado toast + uova + salmone affumicato",
                    proteins: 30,
                    calories: 480,
                    ingredients: ["pane integrale", "avocado", "2 uova", "salmone affumicato"]
                },
                {
                    id: "sab-pranzo",
                    type: "🍽️ Pranzo",
                    time: "14:00",
                    food: "Burger proteico + patate dolci + insalata",
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
                    food: "Grigliata mista + verdure + pane",
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

    return (
        <div className="nutrition-premium">
            {/* HEADER CON BACK BUTTON */}
            <div className="nutrition-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>
                
                <div className="header-title">
                    <h1>🍽️ NUTRITION TRACKER PRO</h1>
                    <p className="subtitle">Piano alimentare settimanale personalizzato</p>
                </div>

                <div className="streak-counter">
                    <div className="streak-number">{currentStreak}</div>
                    <div className="streak-label">🔥 STREAK</div>
                </div>
            </div>

            {/* SELECTOR GIORNI */}
            <div className="day-selector">
                {dayNames.map((day, index) => (
                    <button
                        key={index}
                        className={`day-button ${selectedDay === index ? 'active' : ''} ${index === new Date().getDay() ? 'today' : ''}`}
                        onClick={() => setSelectedDay(index)}
                    >
                        <span className="day-name">{day.slice(0, 3)}</span>
                        <span className="day-number">{index + 1}</span>
                    </button>
                ))}
            </div>

            {/* PROGRESS BAR */}
            <div className="daily-progress">
                <div className="progress-info">
                    <h3>{weeklyDiet[selectedDay].name}</h3>
                    <div className="progress-stats">
                        <span className="stat">
                            <strong>{getDayProgress()}%</strong> Completato
                        </span>
                        <span className="stat">
                            <strong>{getTotalProteins()}g</strong> Proteine
                        </span>
                        <span className="stat">
                            <strong>{getTotalCalories()}</strong> Kcal
                        </span>
                    </div>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill"
                        style={{ width: `${getDayProgress()}%` }}
                    ></div>
                </div>
            </div>

            {/* MEALS LIST */}
            <div className="meals-container">
                {weeklyDiet[selectedDay].meals.map((meal, index) => (
                    <div 
                        key={meal.id}
                        className={`meal-card ${isMealCompleted(meal.id) ? 'completed' : ''}`}
                    >
                        <div className="meal-header">
                            <div className="meal-info">
                                <h4 className="meal-type">{meal.type}</h4>
                                <span className="meal-time">{meal.time}</span>
                            </div>
                            <button
                                className={`meal-checkbox ${isMealCompleted(meal.id) ? 'checked' : ''}`}
                                onClick={() => toggleMeal(meal.id)}
                            >
                                {isMealCompleted(meal.id) ? '✅' : '⭕'}
                            </button>
                        </div>
                        
                        <div className="meal-content">
                            <h5 className="meal-food">{meal.food}</h5>
                            
                            <div className="meal-macros">
                                <span className="macro protein">
                                    💪 {meal.proteins}g proteine
                                </span>
                                <span className="macro calories">
                                    🔥 {meal.calories} kcal
                                </span>
                            </div>
                            
                            <div className="ingredients">
                                <h6>Ingredienti:</h6>
                                <ul>
                                    {meal.ingredients.map((ingredient, idx) => (
                                        <li key={idx}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
                <Link to="/nutrition-tracker" className="action-button primary">
                    📊 Nutrition Tracker Avanzato
                </Link>
                <Link to="/supplements" className="action-button secondary">
                    💊 Gestione Integratori
                </Link>
                <button 
                    className="action-button tertiary"
                    onClick={() => {
                        setCompletedMeals({});
                        setCurrentStreak(0);
                        localStorage.removeItem('completedMeals');
                        localStorage.removeItem('nutritionStreak');
                    }}
                >
                    🔄 Reset Progresso
                </button>
            </div>

            {/* MOTIVATIONAL FOOTER */}
            <div className="motivational-footer">
                <h3>💡 TIP DEL GIORNO</h3>
                <p>
                    "La nutrizione rappresenta il 70% dei tuoi risultati. Ogni pasto è un'opportunità per alimentare la tua trasformazione straordinaria!"
                </p>
            </div>
        </div>
    );
};

export default Nutrition;