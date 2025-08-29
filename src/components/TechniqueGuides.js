import React from 'react';

const TechniqueGuides = () => {
    const masterTechniques = {
        'Panca Inclinata Bilanciere': {
            category: 'Petto',
            difficulty: 'Avanzato',
            muscles: ['Petto (fascio superiore)', 'Deltoidi anteriori', 'Tricipiti'],
            setup: [
                'Panca inclinata 30-45° (mai oltre 45°)',
                'Presa larghezza 1.5x spalle, pollice sopra barra',
                'Scapole retratte e depresse, arco naturale',
                'Piedi saldi a terra, core contratto'
            ],
            execution: [
                'Discesa: 2-3 sec, barra al petto alto/clavicole',
                'Pausa 1 sec al petto, mantenendo tensione',
                'Spinta esplosiva, gomiti 45° dal busto',
                'Lock-out completo, scapole sempre retratte'
            ],
            breathing: 'Inspira in discesa, espira durante spinta (dopo punto di stallo)',
            commonMistakes: [
                '❌ Angolo eccessivo (>45°) = stress spalle',
                '❌ Gomiti troppo larghi = impingement',
                '❌ Rebound al petto = perdita tensione',
                '❌ Arch eccessivo = compenso lombare'
            ],
            progressionTips: [
                'Master tecnica a corpo libero prima',
                'Aumenta peso solo con form perfetto',
                'Paused bench per controllo',
                'Varianti: manubri, presa stretta'
            ],
            safetyNotes: [
                'Sempre con spotter per carichi massimali',
                'Stop se dolore spalle/polsi',
                'Warm-up specifico: band pull-apart'
            ]
        },
        'Trazioni Presa Ampia': {
            category: 'Dorso',
            difficulty: 'Intermedio-Avanzato',
            muscles: ['Gran dorsale', 'Romboidi', 'Posteriori deltoidi', 'Bicipiti'],
            setup: [
                'Presa prona, 1.5x larghezza spalle',
                'Appeso completo, scapole neutre',
                'Core attivo, gambe leggermente avanti',
                'Sguardo leggermente verso alto'
            ],
            execution: [
                'Inizia movimento da scapole (depressione)',
                'Tira gomiti verso basso e indietro',
                'Petto verso sbarra, focus squeeze dorsali',
                'Discesa controllata, stop prima rilascio completo'
            ],
            breathing: 'Inspira in partenza, espira durante trazione',
            commonMistakes: [
                '❌ Kipping/slancio = perdita target muscolare',
                '❌ Solo braccia = manca attivazione dorsali',
                '❌ Range parziale = crescita sub-ottimale',
                '❌ Velocità eccessiva = momentum'
            ],
            progressionTips: [
                'Principianti: lat pulldown + negative',
                'Intermedi: band assist → bodyweight',
                'Avanzati: weighted, pause, L-sit',
                'Focus: mind-muscle connection dorsali'
            ],
            safetyNotes: [
                'Shoulder health check pre-sessione',
                'Progressione graduale volume',
                'Stretching bicipiti/petto post-workout'
            ]
        },
        'Squat': {
            category: 'Gambe',
            difficulty: 'Fondamentale',
            muscles: ['Quadricipiti', 'Glutei', 'Femorali', 'Core'],
            setup: [
                'Barra alta su trapezi (non collo)',
                'Presa 1.2x larghezza spalle, gomiti bassi',
                'Piedi larghezza anche, punte 15-30°',
                'Respirazione diaframmatica pre-discesa'
            ],
            execution: [
                'Hip hinge + knee flexion simultanei',
                'Discesa fino coscie parallele (minimo)',
                'Ginocchia tracking con punte piedi',
                'Drive dai talloni, petto alto in risalita'
            ],
            breathing: 'Valsalva: inspira in alto, trattieni, espira post-risalita',
            commonMistakes: [
                '❌ Knee valgus (ginocchia dentro) = infortunio',
                '❌ Talloni si alzano = mobilità caviglie',
                '❌ Busto troppo avanti = carico schiena',
                '❌ Range parziale = perdita benefici'
            ],
            progressionTips: [
                'Master bodyweight squat perfetto',
                'Goblet squat per apprendimento pattern',
                'Box squat per profondità e controllo',
                'Front squat per postura e core'
            ],
            safetyNotes: [
                'Sempre con safety bars altezza corretta',
                'Warm-up mobilità anche/caviglie',
                'Progressive overload: forma > peso'
            ]
        },
        'Stacco Rumeno (RDL)': {
            category: 'Posteriori',
            difficulty: 'Intermedio',
            muscles: ['Femorali', 'Glutei', 'Erettori spinale', 'Core'],
            setup: [
                'Partenza in piedi, barra a contatto cosce',
                'Presa prona/mista, larghezza spalle',
                'Spalle sopra barra, petto alto',
                'Leggera flessione ginocchia (15-20°)'
            ],
            execution: [
                'Hip hinge puro: anche indietro',
                'Barra scorre lungo gambe (contatto costante)',
                'Discesa fino stretch femorali (mid-shin)',
                'Reverse: drive anche avanti, squeeze glutei'
            ],
            breathing: 'Inspira in alto, trattieni in discesa, espira in risalita',
            commonMistakes: [
                '❌ Schiena curva = shear stress vertebrale',
                '❌ Troppa flessione ginocchia = squat variation',
                '❌ Barra lontana corpo = momento aumentato',
                '❌ Range eccessivo senza mobilità = compensi'
            ],
            progressionTips: [
                'Prima mobilità femorali e anche',
                'Deadlift con deficit per ROM',
                'Single-leg RDL per stabilità',
                'Varianti: manubri, kettlebell'
            ],
            safetyNotes: [
                'Neutral spine sempre mantenuta',
                'Start con carichi moderati',
                'Stretching post-workout essenziale'
            ]
        },
        'Military Press Manubri': {
            category: 'Spalle',
            difficulty: 'Intermedio',
            muscles: ['Deltoidi (tutti fasci)', 'Tricipiti', 'Core', 'Stabilizzatori'],
            setup: [
                'Seduto con schienale 85-90°',
                'Manubri altezza spalle, palmi avanti',
                'Core contratto, schiena neutra',
                'Piedi saldi, grip saldo ma non eccessivo'
            ],
            execution: [
                'Spinta verticale, traiettoria rettilinea',
                'Rotazione esterna spalle durante movimento',
                'Lock-out senza hyperextension gomiti',
                'Discesa controllata, stop all\'altezza orecchie'
            ],
            breathing: 'Inspira in basso, espira durante spinta',
            commonMistakes: [
                '❌ Arch lombare eccessivo = compenso',
                '❌ Spinta troppo avanti = impingement',
                '❌ Gomiti troppo larghi = stress AC joint',
                '❌ Range parziale = sviluppo incompleto'
            ],
            progressionTips: [
                'Pike push-ups per pattern movimento',
                'Press seduto prima di standing',
                'Unilaterale per core e stabilità',
                'Progressione: 2.5kg incrementi max'
            ],
            safetyNotes: [
                'Warm-up spalle obbligatorio',
                'Range dentro comfort zone',
                'Stop al primo segno dolore'
            ]
        }
    };

    const getTechniqueCue = (exerciseName, phase) => {
        const exercise = masterTechniques[exerciseName];
        if (!exercise) return null;

        const cues = {
            setup: exercise.setup,
            execution: exercise.execution,
            breathing: exercise.breathing
        };

        return cues[phase] || null;
    };

    const getProgressionLevel = (exerciseName, userLevel) => {
        const exercise = masterTechniques[exerciseName];
        if (!exercise) return null;

        const progressions = {
            beginner: {
                focus: 'Pattern Movement + Stabilità',
                approach: 'Carichi leggeri, focus forma',
                volume: 'Basso volume, alta frequenza'
            },
            intermediate: {
                focus: 'Progressione Carico + Volume',
                approach: 'Balance intensità/volume',
                volume: 'Volume moderato-alto'
            },
            advanced: {
                focus: 'Specializzazione + Varianti',
                approach: 'Periodizzazione strutturata',
                volume: 'Volume alto, intensità ciclica'
            }
        };

        return progressions[userLevel];
    };

    const getInjuryPrevention = (exerciseName) => {
        const exercise = masterTechniques[exerciseName];
        if (!exercise) return null;

        const prevention = {
            warmup: [],
            cooldown: [],
            redFlags: [],
            alternatives: []
        };

        // Warm-up specifico per categoria
        switch (exercise.category) {
            case 'Petto':
                prevention.warmup = ['Band pull-apart', 'Scap wall slides', 'Arm circles', 'Push-up progression'];
                break;
            case 'Dorso':
                prevention.warmup = ['Cat-cow', 'Band face-pull', 'Scap pull-ups', 'Dead hang'];
                break;
            case 'Gambe':
                prevention.warmup = ['Leg swings', 'Hip circles', 'Bodyweight squat', 'Ankle circles'];
                break;
            case 'Spalle':
                prevention.warmup = ['Arm circles', 'Band external rotation', 'Wall slides', 'YTW raises'];
                break;
        }

        // Red flags comuni
        prevention.redFlags = [
            'Dolore acuto durante movimento',
            'Dolore che persiste post-workout',
            'Limitazione ROM significativa',
            'Instabilità articolare'
        ];

        return prevention;
    };

    const getMindMuscleCues = (exerciseName) => {
        const exercise = masterTechniques[exerciseName];
        if (!exercise) return [];

        const mentalCues = {
            'Panca Inclinata Bilanciere': [
                'Visualizza petto che si "apre" in discesa',
                'Spinta: "schiaccia il mondo via da te"',
                'Immagina di "avvicinare il petto alla barra"',
                'Focus: fibre muscolari che si contraggono'
            ],
            'Trazioni Presa Ampia': [
                'Inizia tirando scapole verso "tasche posteriori"',
                'Immagina di "tirare sbarra verso petto"',
                'Visualizza dorsali come "ali che si aprono"',
                'Senti l\'ampiezza della schiena'
            ],
            'Squat': [
                'Immagina di "sederti su sedia invisibile"',
                'Spingi terra via con i piedi',
                'Visualizza radici dai piedi al centro terra',
                'Core come "cintura di forza naturale"'
            ],
            'Stacco Rumeno (RDL)': [
                'Anche come "cerniere che si aprono"',
                'Senti stretch intenso nei femorali',
                'Immagina "corda che tira anche indietro"',
                'Glutei come "motori della risalita"'
            ],
            'Military Press Manubri': [
                'Spalle come "fondamenta stabili"',
                'Spinta "verso le stelle"',
                'Immagina di "sostenere il cielo"',
                'Core come "pilastro di marmo"'
            ]
        };

        return mentalCues[exerciseName] || [
            'Connessione mente-muscolo',
            'Controllo ogni millimetro',
            'Qualità sopra quantità',
            'Senti il muscolo lavorare'
        ];
    };

    const getExerciseRating = (exerciseName) => {
        const exercise = masterTechniques[exerciseName];
        if (!exercise) return null;

        // Rating sistema basato su efficacia, sicurezza, trasferibilità
        const ratings = {
            'Panca Inclinata Bilanciere': {
                effectiveness: 9,
                safety: 7,
                transferability: 8,
                overall: 8.5,
                notes: 'Re degli esercizi petto superiore'
            },
            'Trazioni Presa Ampia': {
                effectiveness: 10,
                safety: 8,
                transferability: 9,
                overall: 9.5,
                notes: 'Miglior esercizio dorsali in assoluto'
            },
            'Squat': {
                effectiveness: 10,
                safety: 8,
                transferability: 10,
                overall: 9.5,
                notes: 'Re di tutti gli esercizi'
            },
            'Stacco Rumeno (RDL)': {
                effectiveness: 9,
                safety: 7,
                transferability: 9,
                overall: 8.5,
                notes: 'Insuperabile per posteriori'
            },
            'Military Press Manubri': {
                effectiveness: 8,
                safety: 8,
                transferability: 7,
                overall: 8.0,
                notes: 'Eccellente per spalle 3D'
            }
        };

        return ratings[exerciseName];
    };

    return {
        masterTechniques,
        getTechniqueCue,
        getProgressionLevel,
        getInjuryPrevention,
        getMindMuscleCues,
        getExerciseRating
    };
};

export default TechniqueGuides;