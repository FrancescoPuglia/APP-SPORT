import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataManager } from '../utils/dataManager';

const Measurements = () => {
    const navigate = useNavigate();
    const [measurements, setMeasurements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        weight: '',
        height: '',
        bodyFat: '',
        muscleMass: '',
        waist: '',
        chest: '',
        arms: '',
        thighs: '',
        notes: ''
    });

    useEffect(() => {
        loadMeasurements();
    }, []);

    const loadMeasurements = () => {
        const savedMeasurements = dataManager.getMeasurements();
        setMeasurements(savedMeasurements);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.weight) {
            alert('Inserisci almeno il peso!');
            return;
        }

        const measurementData = {
            weight: parseFloat(formData.weight),
            height: formData.height ? parseFloat(formData.height) : null,
            bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : null,
            muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : null,
            waist: formData.waist ? parseFloat(formData.waist) : null,
            chest: formData.chest ? parseFloat(formData.chest) : null,
            arms: formData.arms ? parseFloat(formData.arms) : null,
            thighs: formData.thighs ? parseFloat(formData.thighs) : null,
            notes: formData.notes
        };

        dataManager.saveMeasurement(measurementData);
        
        // Reset form
        setFormData({
            weight: '',
            height: '',
            bodyFat: '',
            muscleMass: '',
            waist: '',
            chest: '',
            arms: '',
            thighs: '',
            notes: ''
        });
        
        setShowForm(false);
        loadMeasurements();
        
        alert('Misurazione salvata con successo!');
    };

    const getProgressChange = (current, previous, unit = 'kg') => {
        if (!previous) return { change: 0, trend: 'stable' };
        const change = current - previous;
        const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
        return { change: Math.abs(change).toFixed(1) + unit, trend };
    };

    const getLatestMeasurement = () => measurements[0] || null;
    const getPreviousMeasurement = () => measurements[1] || null;

    const latest = getLatestMeasurement();
    const previous = getPreviousMeasurement();

    return (
        <div className="measurements-container">
            {/* HEADER CON BACK BUTTON */}
            <div className="measurements-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>
                
                <div className="header-content">
                    <h1>📏 MISURAZIONI CORPOREE</h1>
                    <p className="subtitle">Traccia i tuoi progressi fisici nel tempo</p>
                </div>

                <button 
                    className="add-measurement-btn"
                    onClick={() => setShowForm(true)}
                    style={{
                        background: '#ff9500',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    ➕ Nuova Misurazione
                </button>
            </div>

            {/* FORM NUOVA MISURAZIONE */}
            {showForm && (
                <div className="measurement-form-overlay">
                    <div className="measurement-form">
                        <div className="form-header">
                            <h3>📊 Nuova Misurazione</h3>
                            <button onClick={() => setShowForm(false)}>✕</button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>🏋️ Peso (kg) *</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={formData.weight}
                                        onChange={(e) => setFormData(prev => ({...prev, weight: e.target.value}))}
                                        placeholder="es. 75.5"
                                        required
                                        style={{ background: '#ff9500', color: 'white' }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>📏 Altezza (cm)</label>
                                    <input 
                                        type="number"
                                        value={formData.height}
                                        onChange={(e) => setFormData(prev => ({...prev, height: e.target.value}))}
                                        placeholder="es. 175"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>📊 Grasso Corporeo (%)</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={formData.bodyFat}
                                        onChange={(e) => setFormData(prev => ({...prev, bodyFat: e.target.value}))}
                                        placeholder="es. 12.5"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>💪 Massa Muscolare (kg)</label>
                                    <input 
                                        type="number"
                                        step="0.1"
                                        value={formData.muscleMass}
                                        onChange={(e) => setFormData(prev => ({...prev, muscleMass: e.target.value}))}
                                        placeholder="es. 35.2"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>⚖️ Girovita (cm)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={formData.waist}
                                        onChange={(e) => setFormData(prev => ({...prev, waist: e.target.value}))}
                                        placeholder="es. 82"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>🫁 Petto (cm)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={formData.chest}
                                        onChange={(e) => setFormData(prev => ({...prev, chest: e.target.value}))}
                                        placeholder="es. 105"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>💪 Braccia (cm)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={formData.arms}
                                        onChange={(e) => setFormData(prev => ({...prev, arms: e.target.value}))}
                                        placeholder="es. 38"
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label>🦵 Cosce (cm)</label>
                                    <input 
                                        type="number"
                                        step="0.5"
                                        value={formData.thighs}
                                        onChange={(e) => setFormData(prev => ({...prev, thighs: e.target.value}))}
                                        placeholder="es. 58"
                                    />
                                </div>
                                
                                <div className="form-group full-width">
                                    <label>📝 Note</label>
                                    <textarea 
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
                                        placeholder="Condizioni, sensazioni, obiettivi..."
                                        rows="3"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)}>
                                    Annulla
                                </button>
                                <button type="submit" style={{ background: '#22c55e', color: 'white' }}>
                                    ✅ Salva Misurazione
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* STATISTICHE CURRENT */}
            {latest && (
                <div className="current-stats">
                    <h3>📊 Stato Attuale</h3>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🏋️</div>
                            <div className="stat-info">
                                <span className="stat-value">{latest.weight}kg</span>
                                <span className="stat-label">Peso</span>
                                {previous && (
                                    <span className={`stat-change ${getProgressChange(latest.weight, previous.weight).trend}`}>
                                        {getProgressChange(latest.weight, previous.weight).trend === 'up' ? '↗' : 
                                         getProgressChange(latest.weight, previous.weight).trend === 'down' ? '↘' : '→'} 
                                        {getProgressChange(latest.weight, previous.weight).change}
                                    </span>
                                )}
                            </div>
                        </div>

                        {latest.bodyFat && (
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-info">
                                    <span className="stat-value">{latest.bodyFat}%</span>
                                    <span className="stat-label">Grasso</span>
                                    {previous?.bodyFat && (
                                        <span className={`stat-change ${getProgressChange(latest.bodyFat, previous.bodyFat, '%').trend}`}>
                                            {getProgressChange(latest.bodyFat, previous.bodyFat, '%').trend === 'down' ? '↘' : '↗'} 
                                            {getProgressChange(latest.bodyFat, previous.bodyFat, '%').change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {latest.muscleMass && (
                            <div className="stat-card">
                                <div className="stat-icon">💪</div>
                                <div className="stat-info">
                                    <span className="stat-value">{latest.muscleMass}kg</span>
                                    <span className="stat-label">Muscoli</span>
                                    {previous?.muscleMass && (
                                        <span className={`stat-change ${getProgressChange(latest.muscleMass, previous.muscleMass).trend}`}>
                                            {getProgressChange(latest.muscleMass, previous.muscleMass).trend === 'up' ? '↗' : '↘'} 
                                            {getProgressChange(latest.muscleMass, previous.muscleMass).change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {latest.waist && (
                            <div className="stat-card">
                                <div className="stat-icon">⚖️</div>
                                <div className="stat-info">
                                    <span className="stat-value">{latest.waist}cm</span>
                                    <span className="stat-label">Girovita</span>
                                    {previous?.waist && (
                                        <span className={`stat-change ${getProgressChange(latest.waist, previous.waist, 'cm').trend}`}>
                                            {getProgressChange(latest.waist, previous.waist, 'cm').trend === 'down' ? '↘' : '↗'} 
                                            {getProgressChange(latest.waist, previous.waist, 'cm').change}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STORICO MISURAZIONI */}
            <div className="measurements-history">
                <h3>📈 Storico Misurazioni</h3>
                {measurements.length > 0 ? (
                    <div className="measurements-list">
                        {measurements.map((measurement, index) => (
                            <div key={measurement.id} className="measurement-item">
                                <div className="measurement-date">
                                    {new Date(measurement.date).toLocaleDateString('it-IT', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </div>
                                
                                <div className="measurement-data">
                                    <div className="data-group">
                                        <span className="data-label">Peso:</span>
                                        <span className="data-value">{measurement.weight}kg</span>
                                    </div>
                                    
                                    {measurement.bodyFat && (
                                        <div className="data-group">
                                            <span className="data-label">Grasso:</span>
                                            <span className="data-value">{measurement.bodyFat}%</span>
                                        </div>
                                    )}
                                    
                                    {measurement.muscleMass && (
                                        <div className="data-group">
                                            <span className="data-label">Muscoli:</span>
                                            <span className="data-value">{measurement.muscleMass}kg</span>
                                        </div>
                                    )}
                                    
                                    {measurement.waist && (
                                        <div className="data-group">
                                            <span className="data-label">Girovita:</span>
                                            <span className="data-value">{measurement.waist}cm</span>
                                        </div>
                                    )}

                                    {measurement.notes && (
                                        <div className="measurement-notes">
                                            <strong>Note:</strong> {measurement.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-measurements">
                        <h4>📏 Nessuna Misurazione</h4>
                        <p>Inizia a tracciare i tuoi progressi fisici!</p>
                        <button 
                            onClick={() => setShowForm(true)}
                            className="start-measuring-btn"
                        >
                            📊 Inizia a Misurare
                        </button>
                    </div>
                )}
            </div>

            {/* COLLEGAMENTO AD ANALYTICS */}
            <div className="analytics-link" style={{
                padding: '20px',
                background: 'rgba(0, 255, 255, 0.1)',
                borderRadius: '10px',
                textAlign: 'center',
                marginTop: '20px'
            }}>
                <h3 style={{ color: '#00ffff' }}>📊 Visualizza i Progressi</h3>
                <p>Le tue misurazioni alimentano gli analytics in tempo reale!</p>
                <button 
                    onClick={() => navigate('/analytics')}
                    style={{
                        background: '#00ffff',
                        color: 'black',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold'
                    }}
                >
                    🚀 Vai agli Analytics
                </button>
            </div>
        </div>
    );
};

export default Measurements;