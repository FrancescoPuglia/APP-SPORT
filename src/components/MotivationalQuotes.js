import React from 'react';

const MotivationalQuotes = () => {
    const legendaryQuotes = [
        {
            day: 1, // Lunedì
            quote: "Champions aren't made in the gyms. Champions are made from something deep inside them: a desire, a dream, a vision.",
            author: "Muhammad Ali",
            context: "Petto + Bicipiti - Inizia la settimana con la forza del campione"
        },
        {
            day: 2, // Martedì  
            quote: "The cave you fear to enter holds the treasure you seek.",
            author: "Arnold Schwarzenegger",
            context: "Dorso + Tricipiti - Affronta la paura, trova la forza"
        },
        {
            day: 3, // Mercoledì
            quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
            author: "Mahatma Gandhi (adattato da Kobe Bryant)",
            context: "Gambe Complete - La vera forza viene dalla mente"
        },
        {
            day: 4, // Giovedì
            quote: "Recovery is not a sign of weakness, it's a strategy of champions.",
            author: "LeBron James",
            context: "Recupero Attivo - Il riposo è parte della vittoria"
        },
        {
            day: 5, // Venerdì
            quote: "Excellence is not a skill, it's an attitude.",
            author: "Ralph Marston (filosofia Michael Jordan)",
            context: "Spalle + Core - L'eccellenza è una scelta quotidiana"
        },
        {
            day: 6, // Sabato
            quote: "The body achieves what the mind believes.",
            author: "Napoleon Hill (ispirato da Serena Williams)",
            context: "Posteriori + Conditioning - Credi e raggiungerai"
        },
        {
            day: 0, // Domenica
            quote: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit. Then get back to work.",
            author: "Ralph Marston",
            context: "Riposo Completo - Rigenera per dominare"
        }
    ];

    const additionalQuotes = [
        {
            quote: "I don't measure a man's success by how high he climbs but how high he bounces when he hits bottom.",
            author: "George S. Patton",
            context: "Per i giorni difficili"
        },
        {
            quote: "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
            author: "Confucio (filosofia Kobe Bryant)",
            context: "Quando manca la motivazione"
        },
        {
            quote: "Pain is temporary. Quitting lasts forever.",
            author: "Lance Armstrong",
            context: "Durante l'allenamento intenso"
        },
        {
            quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
            author: "Marcus Aurelius (filosofia Tom Brady)",
            context: "Controllo mentale"
        },
        {
            quote: "The brick walls are there for a reason. The brick walls are not there to keep us out. The brick walls are there to give us a chance to show how badly we want something.",
            author: "Randy Pausch (mentalità Cristiano Ronaldo)",
            context: "Superare gli ostacoli"
        }
    ];

    const getTodayQuote = () => {
        const today = new Date().getDay(); // 0 = Domenica, 1 = Lunedì, etc.
        return legendaryQuotes.find(q => q.day === today) || legendaryQuotes[0];
    };

    const getRandomAdditionalQuote = () => {
        return additionalQuotes[Math.floor(Math.random() * additionalQuotes.length)];
    };

    return {
        getTodayQuote,
        getRandomAdditionalQuote,
        legendaryQuotes,
        additionalQuotes
    };
};

export default MotivationalQuotes;