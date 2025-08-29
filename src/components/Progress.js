import React from 'react';

const Progress = () => {
    const [progressData, setProgressData] = React.useState([]);
    const [newEntry, setNewEntry] = React.useState({
        weight: '',
        bodyFat: '',
        muscleMass: '',
        chest: '',
        arms: '',
        waist: '',
        thighs: '',
        notes: ''
    });
    const [timeStats, setTimeStats] = React.useState({
        totalWorkoutTime: 0,
        weeklyTime: 0,
        monthlyTime: 0,
        sessionsCompleted: 0
    });
    
    const loadProgressData = () => {
        const saved = localStorage.getItem('progressData');
        if (saved) {
            setProgressData(JSON.parse(saved));
        }
        
        const savedTimeStats = localStorage.getItem('timeStats');
        if (savedTimeStats) {
            setTimeStats(JSON.parse(savedTimeStats));
        }
    };
    
    const saveProgressData = (data) => {
        localStorage.setItem('progressData', JSON.stringify(data));
    };
    
    const addEntry = () => {
        if (!newEntry.weight) return;
        
        const entry = {
            ...newEntry,
            date: new Date().toISOString().split('T')[0],
            id: Date.now()
        };
        
        const updated = [entry, ...progressData];
        setProgressData(updated);
        saveProgressData(updated);
        
        setNewEntry({
            weight: '',
            bodyFat: '',
            muscleMass: '',
            chest: '',
            arms: '',
            waist: '',
            thighs: '',
            notes: ''
        });
    };
    
    const deleteEntry = (id) => {
        const updated = progressData.filter(entry => entry.id !== id);
        setProgressData(updated);
        saveProgressData(updated);
    };
    
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    React.useEffect(() => {
        loadProgressData();
    }, []);

    return (
        <div className="progress-container">
            <h2>🎯 Progress Tracker Avanzato</h2>
            
            <div className="time-stats">
                <h3>📊 Statistiche Tempo Investito</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>Tempo Totale</h4>
                        <p>{formatTime(timeStats.totalWorkoutTime)}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Questa Settimana</h4>
                        <p>{formatTime(timeStats.weeklyTime)}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Questo Mese</h4>
                        <p>{formatTime(timeStats.monthlyTime)}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Sessioni Completate</h4>
                        <p>{timeStats.sessionsCompleted}</p>
                    </div>
                </div>
            </div>
            
            <div className="add-entry-form">
                <h3>➕ Aggiungi Nuove Misurazioni</h3>
                <div className="form-grid">
                    <input
                        type="number"
                        placeholder="Peso (kg)"
                        value={newEntry.weight}
                        onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Massa Grassa (%)"
                        value={newEntry.bodyFat}
                        onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Massa Muscolare (kg)"
                        value={newEntry.muscleMass}
                        onChange={(e) => setNewEntry({...newEntry, muscleMass: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Petto (cm)"
                        value={newEntry.chest}
                        onChange={(e) => setNewEntry({...newEntry, chest: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Braccia (cm)"
                        value={newEntry.arms}
                        onChange={(e) => setNewEntry({...newEntry, arms: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Vita (cm)"
                        value={newEntry.waist}
                        onChange={(e) => setNewEntry({...newEntry, waist: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Cosce (cm)"
                        value={newEntry.thighs}
                        onChange={(e) => setNewEntry({...newEntry, thighs: e.target.value})}
                    />
                    <textarea
                        placeholder="Note (sensazioni, obiettivi, etc.)"
                        value={newEntry.notes}
                        onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                    />
                </div>
                <button className="button" onClick={addEntry}>Aggiungi Misurazione</button>
            </div>
            
            <div className="progress-table">
                <h3>📈 Storico Progressi</h3>
                {progressData.length === 0 ? (
                    <p>Nessuna misurazione ancora. Inizia ad aggiungere i tuoi progressi!</p>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Peso</th>
                                    <th>Grasso</th>
                                    <th>Muscolo</th>
                                    <th>Petto</th>
                                    <th>Braccia</th>
                                    <th>Vita</th>
                                    <th>Cosce</th>
                                    <th>Note</th>
                                    <th>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {progressData.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.date}</td>
                                        <td>{entry.weight} kg</td>
                                        <td>{entry.bodyFat}%</td>
                                        <td>{entry.muscleMass} kg</td>
                                        <td>{entry.chest} cm</td>
                                        <td>{entry.arms} cm</td>
                                        <td>{entry.waist} cm</td>
                                        <td>{entry.thighs} cm</td>
                                        <td className="notes-cell">{entry.notes}</td>
                                        <td>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => deleteEntry(entry.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Progress;