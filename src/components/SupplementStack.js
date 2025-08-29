import React from 'react';

const SupplementStack = () => {
    const [supplementSchedule, setSupplementSchedule] = React.useState({});
    const [takenToday, setTakenToday] = React.useState({});

    const evidenceBasedSupplements = {
        creatine: {
            name: 'Creatina Monoidrato',
            dosage: '3-5g',
            timing: 'Post-workout o qualsiasi momento',
            evidence: 'A+ (Oltre 500 studi)',
            benefits: ['↑ Forza 5-15%', '↑ Potenza esplosiva', '↑ Volume allenamento', '↑ Massa muscolare'],
            mechanism: 'Rigenera ATP per contrazioni muscolari ad alta intensità',
            notes: 'Loading non necessario. Consistenza > timing. Funziona meglio con carboidrati.',
            color: '#00ff88',
            icon: '💪'
        },
        citrulline: {
            name: 'L-Citrullina Malato',
            dosage: '6-8g',
            timing: '30-45min pre-workout',
            evidence: 'A (Multipli RCT)',
            benefits: ['↑ Pump muscolare', '↑ Resistenza', '↓ DOMS', '↑ Ossido nitrico'],
            mechanism: 'Precursore arginina → NO → vasodilatazione',
            notes: 'Più efficace della L-Arginina. Sinergia con caffeina.',
            color: '#ff9500',
            icon: '🔥'
        },
        betaAlanine: {
            name: 'Beta-Alanina',
            dosage: '3-5g',
            timing: 'Divisa in 2-3 dosi giornaliere',
            evidence: 'A (Evidenza consolidata)',
            benefits: ['↑ Resistenza muscolare', '↓ Fatica 1-4 min sforzo', '↑ Volume alto-rep'],
            mechanism: 'Aumenta carnosina muscolare → buffer acido lattico',
            notes: 'Loading 2-4 settimane. Possibile parestesia (innocua).',
            color: '#00ffff',
            icon: '⚡'
        },
        omega3: {
            name: 'Omega-3 EPA/DHA',
            dosage: '2-3g EPA+DHA',
            timing: 'Con pasti contenenti grassi',
            evidence: 'A+ (Migliaia di studi)',
            benefits: ['↓ Infiammazione', '↑ Recupero', '↑ Sintesi proteica', '↑ Salute cardiovascolare'],
            mechanism: 'Modulazione cascata infiammatoria e membrane cellulari',
            notes: 'Ratio EPA:DHA 2:1 ottimale. Qualità > quantità.',
            color: '#0099ff',
            icon: '🐟'
        },
        caffeine: {
            name: 'Caffeina',
            dosage: '200-400mg',
            timing: '30-45min pre-workout',
            evidence: 'A+ (Gold standard)',
            benefits: ['↑ Focus', '↑ Energia', '↑ Performance', '↑ Metabolismo grassi'],
            mechanism: 'Antagonista adenosina → vigilanza + mobilizzazione grassi',
            notes: 'Tolleranza sviluppa rapidamente. Ciclare 1-2 settimane ogni mese.',
            color: '#8B4513',
            icon: '☕'
        },
        vitaminD: {
            name: 'Vitamina D3',
            dosage: '2000-4000 IU',
            timing: 'Con pasto contenente grassi',
            evidence: 'A (Critico se carente)',
            benefits: ['↑ Testosterone', '↑ Forza', '↑ Salute ossea', '↑ Sistema immunitario'],
            mechanism: 'Regolazione ormonale e assorbimento calcio',
            notes: 'Test ematico raccomandato. Target: 30-50 ng/mL.',
            color: '#FFD700',
            icon: '☀️'
        }
    };

    const removedSupplements = {
        hmb: 'Scarsa evidenza per atleti allenati. Solo utile per anziani/principianti.',
        forskolin: 'Studi inconsistenti. Nessun beneficio provato su composizione corporea.',
        rAla: 'Evidenza limitata. Costo-beneficio sfavorevole vs omega-3.',
        bcaa: 'Inutili se assumi proteine complete. Whey protein superiore.',
        glutamine: 'Non ergogenica in soggetti sani. Solo utile in immunodepressione.'
    };

    const getOptimalTiming = (currentTime) => {
        const hour = currentTime.getHours();
        const recommendations = [];

        // Mattino (6-10)
        if (hour >= 6 && hour <= 10) {
            recommendations.push({
                supplement: 'vitaminD',
                reason: 'Assorbimento ottimale con prima colazione'
            });
            recommendations.push({
                supplement: 'omega3',
                reason: 'Con grassi della colazione per biodisponibilità'
            });
        }

        // Pre-workout (dipende dall'orario allenamento)
        const workoutHour = 18; // Assumiamo allenamento serale
        if (hour === workoutHour - 1) {
            recommendations.push({
                supplement: 'caffeine',
                reason: '30-45min prima allenamento per picco energetico'
            });
            recommendations.push({
                supplement: 'citrulline',
                reason: 'Pre-workout per pump e resistenza'
            });
        }

        // Post-workout
        if (hour === workoutHour + 1) {
            recommendations.push({
                supplement: 'creatine',
                reason: 'Post-workout con carboidrati per uptake'
            });
        }

        // Sera
        if (hour >= 20) {
            recommendations.push({
                supplement: 'betaAlanine',
                reason: 'Loading serale per evitare parestesia diurna'
            });
        }

        return recommendations;
    };

    const markSupplementTaken = (supplementKey, dosage, timing) => {
        const today = new Date().toISOString().split('T')[0];
        const entryKey = `${supplementKey}_${today}`;

        const taken = {
            ...takenToday,
            [entryKey]: {
                supplement: supplementKey,
                dosage,
                timing,
                timestamp: new Date().toISOString(),
                taken: true
            }
        };

        setTakenToday(taken);
        localStorage.setItem('supplementsTakenToday', JSON.stringify(taken));

        // Salva nello storico
        const history = JSON.parse(localStorage.getItem('supplementsHistory') || '{}');
        history[entryKey] = taken[entryKey];
        localStorage.setItem('supplementsHistory', JSON.stringify(history));
    };

    const isSupplementTakenToday = (supplementKey) => {
        const today = new Date().toISOString().split('T')[0];
        const entryKey = `${supplementKey}_${today}`;
        return takenToday[entryKey] && takenToday[entryKey].taken;
    };

    const getSupplementProgress = () => {
        const totalSupplements = Object.keys(evidenceBasedSupplements).length;
        const takenCount = Object.keys(evidenceBasedSupplements).filter(key => 
            isSupplementTakenToday(key)
        ).length;
        
        return {
            taken: takenCount,
            total: totalSupplements,
            percentage: Math.round((takenCount / totalSupplements) * 100)
        };
    };

    const getWeeklySupplementStats = () => {
        const history = JSON.parse(localStorage.getItem('supplementsHistory') || '{}');
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyEntries = Object.values(history).filter(entry => 
            new Date(entry.timestamp) >= oneWeekAgo
        );

        const consistency = {};
        Object.keys(evidenceBasedSupplements).forEach(key => {
            const supplementEntries = weeklyEntries.filter(entry => entry.supplement === key);
            consistency[key] = {
                taken: supplementEntries.length,
                percentage: Math.round((supplementEntries.length / 7) * 100)
            };
        });

        return consistency;
    };

    const createSupplementPlan = (workoutSchedule, goals) => {
        const plan = {
            core: ['creatine', 'omega3', 'vitaminD'], // Sempre consigliati
            performance: ['caffeine', 'citrulline'], // Per performance
            endurance: ['betaAlanine'], // Per resistenza
            timing: {
                morning: ['vitaminD', 'omega3'],
                preWorkout: ['caffeine', 'citrulline'],
                postWorkout: ['creatine'],
                evening: ['betaAlanine']
            }
        };

        return plan;
    };

    const loadTodaysSupplements = () => {
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem('supplementsTakenToday');
        if (saved) {
            const data = JSON.parse(saved);
            // Filtra solo quelli di oggi
            const todayData = {};
            Object.keys(data).forEach(key => {
                if (key.includes(today)) {
                    todayData[key] = data[key];
                }
            });
            setTakenToday(todayData);
        }
    };

    React.useEffect(() => {
        loadTodaysSupplements();
    }, []);

    return {
        evidenceBasedSupplements,
        removedSupplements,
        takenToday,
        markSupplementTaken,
        isSupplementTakenToday,
        getSupplementProgress,
        getWeeklySupplementStats,
        getOptimalTiming,
        createSupplementPlan
    };
};

export default SupplementStack;