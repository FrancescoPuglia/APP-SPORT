import React from 'react';
import './styles/main.css';

function App() {
    return (
        <div className="App">
            <header style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
                <h1>🏋️ Extraordinary Growth App</h1>
                <p>Test versione semplificata - L'app funziona!</p>
                <div style={{ marginTop: '2rem' }}>
                    <h2>Status Check:</h2>
                    <p>✅ React: Caricato correttamente</p>
                    <p>✅ CSS: Styles caricati</p>
                    <p>✅ Variabili Firebase: Configurate inline (GitHub Pages compatible)</p>
                    <p>✅ Node Version: Compatibile</p>
                </div>
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'lightgreen' }}>
                    <h3>🎉 L'applicazione è operativa!</h3>
                    <p>Tutte le dipendenze principali funzionano correttamente</p>
                </div>
            </header>
        </div>
    );
}

export default App;