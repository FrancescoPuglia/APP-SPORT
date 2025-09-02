import React from 'react';
import { dataManager } from '../utils/dataManager';

const CalendarStreak = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [streakData, setStreakData] = React.useState({});
    const [monthlyStats, setMonthlyStats] = React.useState({});

    const loadStreakData = () => {
        const saved = localStorage.getItem('streakData');
        if (saved) {
            setStreakData(JSON.parse(saved));
        }
    };

    const saveStreakData = (data) => {
        localStorage.setItem('streakData', JSON.stringify(data));
        setStreakData(data);
    };

    const markWorkoutCompleted = (date, workoutType, exercises = []) => {
        const dateKey = date.toISOString().split('T')[0];
        const updated = {
            ...streakData,
            [dateKey]: {
                completed: true,
                workoutType,
                exercises,
                timestamp: new Date().toISOString()
            }
        };
        saveStreakData(updated);
        calculateMonthlyStats(updated);
    };

    const calculateMonthlyStats = (data = streakData) => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        const monthlyWorkouts = Object.keys(data).filter(dateKey => {
            const date = new Date(dateKey);
            return date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear &&
                   data[dateKey].completed;
        }).length;

        const currentStreak = calculateCurrentStreak(data);
        const longestStreak = calculateLongestStreak(data);
        const weeklyAverage = calculateWeeklyAverage(data);

        setMonthlyStats({
            monthlyWorkouts,
            currentStreak,
            longestStreak,
            weeklyAverage,
            lastUpdated: new Date()
        });
    };

    const calculateCurrentStreak = (data) => {
        // 🔥 BUG FIX: Calcola streak dai dati REALI di dataManager
        const realWorkouts = dataManager.getWorkouts() || [];
        const realStreak = dataManager.calculateWorkoutStreak(realWorkouts);
        
        // Usa anche il vecchio sistema per compatibilità
        const today = new Date();
        let streak = 0;
        let checkDate = new Date(today);

        while (checkDate) {
            const dateKey = checkDate.toISOString().split('T')[0];
            if (data[dateKey] && data[dateKey].completed) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (streak === 0 && checkDate.toDateString() === today.toDateString()) {
                // Se oggi non è completato, controlla ieri
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
            
            // Evita loop infiniti
            if (streak > 365) break;
        }
        
        console.log(`🔥 Streak CalendarStreak: ${streak}, DataManager: ${realStreak}`);
        return Math.max(streak, realStreak);
    };

    const calculateLongestStreak = (data) => {
        let maxStreak = 0;
        let currentStreak = 0;
        
        const sortedDates = Object.keys(data)
            .filter(key => data[key].completed)
            .sort();
        
        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                currentStreak = 1;
            } else {
                const prevDate = new Date(sortedDates[i - 1]);
                const currDate = new Date(sortedDates[i]);
                const daysDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);
                
                if (daysDiff === 1) {
                    currentStreak++;
                } else {
                    maxStreak = Math.max(maxStreak, currentStreak);
                    currentStreak = 1;
                }
            }
        }
        
        return Math.max(maxStreak, currentStreak);
    };

    const calculateWeeklyAverage = (data) => {
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        
        const recentWorkouts = Object.keys(data).filter(dateKey => {
            const date = new Date(dateKey);
            return date >= fourWeeksAgo && data[dateKey].completed;
        }).length;
        
        return (recentWorkouts / 4).toFixed(1);
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Aggiungi giorni vuoti per allineare il calendario
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Aggiungi tutti i giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            const dateKey = currentDay.toISOString().split('T')[0];
            days.push({
                date: currentDay,
                day,
                isCompleted: streakData[dateKey] && streakData[dateKey].completed,
                workoutType: streakData[dateKey] ? streakData[dateKey].workoutType : null,
                isToday: currentDay.toDateString() === new Date().toDateString()
            });
        }
        
        return days;
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const getStreakColor = (streak) => {
        if (streak >= 30) return '#ff006e'; // Rosa intenso
        if (streak >= 21) return '#ff9500'; // Arancione 
        if (streak >= 14) return '#00ff88'; // Verde
        if (streak >= 7) return '#00ffff';  // Cyan
        return '#ffffff'; // Bianco
    };

    const getWorkoutTypeEmoji = (type) => {
        const emojiMap = {
            'Petto + Bicipiti': '💪',
            'Dorso + Tricipiti + Collo (A)': '🏋️',
            'Gambe Complete': '🦵',
            'Recupero Attivo': '🧘',
            'Spalle Complete + Collo (B)': '💫',
            'Posteriori + Conditioning': '🔥',
            'Riposo Completo': '😴'
        };
        return emojiMap[type] || '💪';
    };

    React.useEffect(() => {
        loadStreakData();
    }, []);

    React.useEffect(() => {
        calculateMonthlyStats();
    }, [streakData, currentDate]);

    const monthNames = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

    return {
        currentDate,
        streakData,
        monthlyStats,
        markWorkoutCompleted,
        getDaysInMonth,
        navigateMonth,
        getStreakColor,
        getWorkoutTypeEmoji,
        monthNames,
        dayNames,
        calculateCurrentStreak: () => calculateCurrentStreak(streakData)
    };
};

export default CalendarStreak;