import React from 'react';

const RecoveryProtocol = () => {
    const [recoveryLog, setRecoveryLog] = React.useState({});
    const [todayRecovery, setTodayRecovery] = React.useState({});

    const thermoTherapyProtocols = {
        sauna: {
            name: 'Sauna Finlandese',
            temperature: '80-100°C',
            humidity: '10-20%',
            duration: '15-20 min',
            timing: 'Immediatamente post-workout',
            mechanism: 'Heat Shock Proteins → Anabolismo + Cardiovascolare',
            benefits: [
                '↑ Growth Hormone 24x',
                '↑ Heat Shock Proteins (riparazione)',
                '↑ Vasodilatazione (nutrienti muscolari)', 
                '↑ Eliminazione metaboliti'
            ],
            protocol: [
                '5-10 min iniziali per adattamento',
                '2-3 sessioni da 15-20 min',
                'Pause 2-3 min aria fresca tra sessioni',
                'Idratazione: 500ml acqua + elettroliti'
            ],
            precautions: [
                'Mai subito dopo pasti abbondanti',
                'Stop se nausea/vertigini/palpitazioni',
                'Controindicato: ipertensione non controllata'
            ],
            scientificEvidence: 'A+ (Rhonda Patrick, Joyner studies)',
            color: '#ff6b35',
            icon: '🔥'
        },
        steamRoom: {
            name: 'Bagno Turco',
            temperature: '40-50°C',
            humidity: '90-100%',
            duration: '10-15 min',
            timing: 'Giorni rest per mobilità/relax',
            mechanism: 'Umidità → Idratazione tessuti + Mobilità articolare',
            benefits: [
                '↑ Mobilità articolare',
                '↑ Idratazione tessuto connettivo',
                '↓ Rigidità muscolare',
                '↑ Eliminazione tossine via pelle'
            ],
            protocol: [
                '10-15 min sessione unica',
                'Respirazione profonda (vapori benefici)',
                'Stretching dolce durante sessione',
                'Doccia fredda finale (contrasto)'
            ],
            precautions: [
                'Attenzione claustrofobia',
                'Igiene: sempre su asciugamano',
                'Idratazione pre/post obbligatoria'
            ],
            scientificEvidence: 'B+ (Benefici mobilità documentati)',
            color: '#4ecdc4',
            icon: '💨'
        },
        iceBath: {
            name: 'Crioterapia (Ice Bath)',
            temperature: '8-12°C',
            humidity: 'N/A',
            duration: '10-15 min',
            timing: 'SOLO ≥4h post-workout (mai prima)',
            mechanism: 'Vasocostrizione → Recovery neurologico + Anti-infiammatorio',
            benefits: [
                '↓ Infiammazione acuta',
                '↑ Recovery Sistema Nervoso',
                '↑ Resilienza mentale',
                '↓ Percezione fatica'
            ],
            protocol: [
                'Graduale: inizia 15°C → 10°C → 8°C',
                '2-3 min prime volte → 10-15 min target',
                'Respirazione controllata (Wim Hof)',
                'Riscaldamento graduale post-immersione'
            ],
            precautions: [
                'MAI nelle 4h post-workout (blocca adattamenti)',
                'Controindicato: problemi cardiaci',
                'Supervisione iniziale raccomandata'
            ],
            scientificEvidence: 'A- (Timing critico per efficacia)',
            color: '#74b9ff',
            icon: '🧊'
        }
    };

    const contrastTherapy = {
        name: 'Terapia Contrasto (Hot/Cold)',
        protocol: [
            'Sauna 15 min (80-90°C)',
            'Doccia fredda 1 min (15°C)',
            'Ripeti ciclo 3-4 volte',
            'Termina sempre con freddo'
        ],
        benefits: [
            'Pump vascolare (vasodilatazione/costrizione)',
            'Massimo stimolo circolatorio',
            'Recovery accelerata',
            'Resilienza termica'
        ],
        timing: 'Post-workout giorni intensi',
        scientificEvidence: 'A (Scandinavian protocols)',
        color: '#fd79a8',
        icon: '🌡️'
    };

    const optimalTiming = {
        postWorkout: {
            immediate: ['sauna'],
            after2h: ['steamRoom', 'contrastTherapy'],
            after4h: ['iceBath'],
            nextMorning: ['sauna leggera', 'steamRoom']
        },
        restDays: {
            morning: ['steamRoom', 'sauna leggera'],
            evening: ['iceBath', 'contrastTherapy']
        },
        competition: {
            before: 'Evitare ice bath 48h prima',
            after: 'Full protocol per recovery rapido'
        }
    };

    const biohacking = {
        breathwork: {
            name: 'Wim Hof Method',
            protocol: '30 respiri profondi → apnea → ripeti 3 cicli',
            benefits: 'Adattamento stress termico + controllo SNA',
            timing: 'Pre ice bath o standalone'
        },
        supplements: {
            preSauna: 'Magnesio 400mg (vasodilatazione)',
            preIceBath: 'L-Theanina 200mg (calma mentale)',
            postBoth: 'Elettroliti + Vitamina C'
        },
        monitoring: {
            heartRate: 'HRV pre/post per valutare recovery',
            bodyTemp: 'Termometro infrarossi per tracking',
            subjective: 'Scale 1-10 per energia/dolori'
        }
    };

    const markRecoverySession = (therapy, duration, temperature, notes, effectiveness) => {
        const today = new Date().toISOString().split('T')[0];
        const sessionId = `${therapy}_${Date.now()}`;

        const session = {
            id: sessionId,
            date: today,
            therapy,
            duration: parseInt(duration),
            temperature: parseFloat(temperature),
            notes,
            effectiveness: parseInt(effectiveness),
            timestamp: new Date().toISOString()
        };

        const updatedLog = {
            ...recoveryLog,
            [sessionId]: session
        };

        setRecoveryLog(updatedLog);
        localStorage.setItem('recoveryLog', JSON.stringify(updatedLog));

        // Aggiorna sessioni di oggi
        const todaySessions = Object.values(updatedLog).filter(s => s.date === today);
        setTodayRecovery({
            ...todayRecovery,
            sessions: todaySessions,
            totalTime: todaySessions.reduce((sum, s) => sum + s.duration, 0)
        });
    };

    const getRecoveryRecommendation = (lastWorkout, workoutIntensity, stressLevel) => {
        const recommendations = [];

        // Basato su timing ultimo workout
        const hoursSinceWorkout = lastWorkout ? 
            (new Date() - new Date(lastWorkout)) / (1000 * 60 * 60) : 24;

        if (hoursSinceWorkout < 2) {
            recommendations.push({
                therapy: 'sauna',
                priority: 'Alta',
                reason: 'Finestra anabolica ottimale per heat shock proteins'
            });
        } else if (hoursSinceWorkout >= 4) {
            recommendations.push({
                therapy: 'iceBath',
                priority: 'Media',
                reason: 'Recovery Sistema Nervoso senza interferire adattamenti'
            });
        }

        // Basato su intensità workout
        if (workoutIntensity >= 8) {
            recommendations.push({
                therapy: 'contrastTherapy',
                priority: 'Alta',
                reason: 'Recovery accelerata per sessioni ad alta intensità'
            });
        }

        // Basato su stress/recovery
        if (stressLevel >= 7) {
            recommendations.push({
                therapy: 'steamRoom',
                priority: 'Media',
                reason: 'Relax parasimpatico per gestione stress'
            });
        }

        return recommendations;
    };

    const getRecoveryStats = () => {
        const last7Days = Object.values(recoveryLog).filter(session => {
            const sessionDate = new Date(session.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return sessionDate >= weekAgo;
        });

        const stats = {
            totalSessions: last7Days.length,
            totalTime: last7Days.reduce((sum, s) => sum + s.duration, 0),
            averageEffectiveness: last7Days.length > 0 ? 
                Math.round(last7Days.reduce((sum, s) => sum + s.effectiveness, 0) / last7Days.length) : 0,
            therapyBreakdown: {}
        };

        // Breakdown per terapia
        Object.keys(thermoTherapyProtocols).forEach(therapy => {
            const sessions = last7Days.filter(s => s.therapy === therapy);
            stats.therapyBreakdown[therapy] = {
                sessions: sessions.length,
                time: sessions.reduce((sum, s) => sum + s.duration, 0)
            };
        });

        return stats;
    };

    const loadRecoveryData = () => {
        const saved = localStorage.getItem('recoveryLog');
        if (saved) {
            setRecoveryLog(JSON.parse(saved));
        }

        // Carica sessioni di oggi
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = Object.values(JSON.parse(saved || '{}')).filter(s => s.date === today);
        setTodayRecovery({
            sessions: todaySessions,
            totalTime: todaySessions.reduce((sum, s) => sum + s.duration, 0)
        });
    };

    React.useEffect(() => {
        loadRecoveryData();
    }, []);

    return {
        thermoTherapyProtocols,
        contrastTherapy,
        optimalTiming,
        biohacking,
        recoveryLog,
        todayRecovery,
        markRecoverySession,
        getRecoveryRecommendation,
        getRecoveryStats
    };
};

export default RecoveryProtocol;