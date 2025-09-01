import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Supplements = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [takenToday, setTakenToday] = useState(() => {
        const saved = localStorage.getItem('supplementsTaken');
        return saved ? JSON.parse(saved) : {};
    });
    const [currentStack, setCurrentStack] = useState(() => {
        const saved = localStorage.getItem('currentStack');
        return saved ? JSON.parse(saved) : [
            'whey-protein', 'creatine', 'multivitamin', 'omega3', 'vitamin-d'
        ];
    });

    // SUPPLEMENTI COMPLETI CON TIMING E DOSAGGI
    const supplements = {
        'whey-protein': {
            name: 'Whey Protein',
            category: 'protein',
            icon: '💪',
            dosage: '25-30g',
            timing: ['post-workout', 'snack'],
            benefits: ['Crescita muscolare', 'Recovery', 'Sintesi proteica'],
            priority: 'essential',
            cost: '€35/mese',
            description: 'Proteine del siero ad alto valore biologico per massimizzare la crescita muscolare',
            instructions: 'Assumere 1 scoop (25g) in 250ml acqua/latte entro 30min dal workout'
        },
        'creatine': {
            name: 'Creatina Monoidrata',
            category: 'performance',
            icon: '⚡',
            dosage: '3-5g',
            timing: ['pre-workout', 'post-workout'],
            benefits: ['Forza', 'Potenza', 'Volume muscolare'],
            priority: 'essential',
            cost: '€15/mese',
            description: 'Aumenta ATP per performance esplosive e volume cellulare',
            instructions: '5g al giorno, possibile loading di 20g per 5 giorni iniziali'
        },
        'multivitamin': {
            name: 'Multivitaminico Premium',
            category: 'health',
            icon: '🌟',
            dosage: '1 tablet',
            timing: ['breakfast'],
            benefits: ['Salute generale', 'Sistema immunitario', 'Energia'],
            priority: 'important',
            cost: '€25/mese',
            description: 'Formula completa di vitamine e minerali per atleti',
            instructions: '1 compressa al mattino a stomaco pieno'
        },
        'omega3': {
            name: 'Omega-3 EPA/DHA',
            category: 'health',
            icon: '🐟',
            dosage: '1-2g',
            timing: ['meals'],
            benefits: ['Antinfiammatorio', 'Salute cuore', 'Recovery'],
            priority: 'important',
            cost: '€20/mese',
            description: 'Acidi grassi essenziali per ridurre infiammazione e supportare il recovery',
            instructions: '1-2 capsule ai pasti principali'
        },
        'vitamin-d': {
            name: 'Vitamina D3',
            category: 'health',
            icon: '☀️',
            dosage: '2000-4000 IU',
            timing: ['breakfast'],
            benefits: ['Salute ossa', 'Sistema immunitario', 'Testosterone'],
            priority: 'important',
            cost: '€12/mese',
            description: 'Supporta salute ossea, sistema immunitario e produzione ormonale',
            instructions: '2000 IU al mattino con grassi per migliore assorbimento'
        },
        'bcaa': {
            name: 'BCAA 2:1:1',
            category: 'recovery',
            icon: '🔄',
            dosage: '10-15g',
            timing: ['intra-workout', 'between-meals'],
            benefits: ['Riduce catabolismo', 'Energia durante workout', 'Recovery'],
            priority: 'optional',
            cost: '€30/mese',
            description: 'Aminoacidi ramificati per preservare massa muscolare durante workout',
            instructions: '10g durante workout lunghi o tra i pasti'
        },
        'beta-alanine': {
            name: 'Beta-Alanina',
            category: 'performance',
            icon: '🔥',
            dosage: '3-5g',
            timing: ['pre-workout'],
            benefits: ['Resistenza muscolare', 'Riduce fatica', 'Performance'],
            priority: 'optional',
            cost: '€18/mese',
            description: 'Aumenta capacità di buffer muscolare per allenamenti intensi',
            instructions: '3g 30min pre-workout, possibile formicolio normale'
        },
        'magnesium': {
            name: 'Magnesio Glicinato',
            category: 'recovery',
            icon: '😴',
            dosage: '200-400mg',
            timing: ['evening'],
            benefits: ['Rilassamento muscolare', 'Sonno', 'Recovery'],
            priority: 'important',
            cost: '€15/mese',
            description: 'Supporta rilassamento muscolare e qualità del sonno',
            instructions: '200-300mg la sera prima di dormire'
        },
        'caffeine': {
            name: 'Caffeina Anidra',
            category: 'performance',
            icon: '☕',
            dosage: '100-200mg',
            timing: ['pre-workout'],
            benefits: ['Energia', 'Focus', 'Performance'],
            priority: 'optional',
            cost: '€10/mese',
            description: 'Stimolante per energia e focus durante allenamenti intensi',
            instructions: '100-200mg 30-45min pre-workout, non oltre le 16:00'
        },
        'zinc': {
            name: 'Zinco + Rame',
            category: 'health',
            icon: '⚡',
            dosage: '15-30mg',
            timing: ['evening'],
            benefits: ['Testosterone', 'Sistema immunitario', 'Recovery'],
            priority: 'important',
            cost: '€12/mese',
            description: 'Supporta produzione ormonale e sistema immunitario',
            instructions: '15mg la sera a stomaco vuoto con rame 1-2mg'
        }
    };

    const categories = {
        all: { name: 'Tutti', icon: '🔮', color: '#00ffff' },
        protein: { name: 'Proteine', icon: '💪', color: '#ff9500' },
        performance: { name: 'Performance', icon: '⚡', color: '#ff6b6b' },
        health: { name: 'Salute', icon: '🌟', color: '#4ecdc4' },
        recovery: { name: 'Recovery', icon: '😴', color: '#a8e6cf' }
    };

    const timingLabels = {
        'breakfast': '🌅 Colazione',
        'pre-workout': '🏋️ Pre-Workout',
        'intra-workout': '💪 Intra-Workout',
        'post-workout': '🔥 Post-Workout',
        'meals': '🍽️ Ai pasti',
        'snack': '🥤 Snack',
        'evening': '🌙 Sera',
        'between-meals': '⏰ Tra pasti'
    };

    const toggleSupplement = (suppId) => {
        const today = new Date().toDateString();
        const key = `${today}-${suppId}`;
        
        const newTaken = {
            ...takenToday,
            [key]: !takenToday[key]
        };
        
        setTakenToday(newTaken);
        localStorage.setItem('supplementsTaken', JSON.stringify(newTaken));
    };

    const isSupplementTaken = (suppId) => {
        const today = new Date().toDateString();
        return takenToday[`${today}-${suppId}`] || false;
    };

    const addToStack = (suppId) => {
        if (!currentStack.includes(suppId)) {
            const newStack = [...currentStack, suppId];
            setCurrentStack(newStack);
            localStorage.setItem('currentStack', JSON.stringify(newStack));
        }
    };

    const removeFromStack = (suppId) => {
        const newStack = currentStack.filter(id => id !== suppId);
        setCurrentStack(newStack);
        localStorage.setItem('currentStack', JSON.stringify(newStack));
    };

    const getCompletionRate = () => {
        const today = new Date().toDateString();
        const stackSupplements = currentStack.length;
        const takenCount = currentStack.filter(suppId => 
            takenToday[`${today}-${suppId}`]
        ).length;
        return stackSupplements > 0 ? Math.round((takenCount / stackSupplements) * 100) : 0;
    };

    const getFilteredSupplements = () => {
        return Object.entries(supplements).filter(([id, supp]) => 
            selectedCategory === 'all' || supp.category === selectedCategory
        );
    };

    const getTotalMonthlyCost = () => {
        return currentStack.reduce((total, suppId) => {
            const cost = supplements[suppId]?.cost || '€0/mese';
            const amount = parseInt(cost.replace('€', '').replace('/mese', ''));
            return total + amount;
        }, 0);
    };

    return (
        <div className="supplements-premium">
            {/* HEADER CON BACK BUTTON */}
            <div className="supplements-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/')}
                    title="Torna alla Dashboard"
                >
                    <span className="back-icon">←</span>
                    <span className="back-text">Dashboard</span>
                </button>
                
                <div className="header-title">
                    <h1>💊 SUPPLEMENT STACK PRO</h1>
                    <p className="subtitle">Gestione intelligente degli integratori</p>
                </div>

                <div className="completion-badge">
                    <div className="completion-circle">
                        <span className="completion-percentage">{getCompletionRate()}%</span>
                    </div>
                    <div className="completion-label">Oggi</div>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="stack-overview">
                <div className="overview-card">
                    <div className="card-icon">📦</div>
                    <div className="card-data">
                        <span className="card-value">{currentStack.length}</span>
                        <span className="card-label">Nel tuo stack</span>
                    </div>
                </div>
                <div className="overview-card">
                    <div className="card-icon">✅</div>
                    <div className="card-data">
                        <span className="card-value">{currentStack.filter(id => isSupplementTaken(id)).length}</span>
                        <span className="card-label">Assunti oggi</span>
                    </div>
                </div>
                <div className="overview-card">
                    <div className="card-icon">💰</div>
                    <div className="card-data">
                        <span className="card-value">€{getTotalMonthlyCost()}</span>
                        <span className="card-label">Costo mensile</span>
                    </div>
                </div>
            </div>

            {/* CURRENT STACK */}
            <div className="current-stack-section">
                <h2>🔥 IL TUO STACK ATTUALE</h2>
                <div className="stack-grid">
                    {currentStack.map(suppId => {
                        const supplement = supplements[suppId];
                        if (!supplement) return null;
                        
                        return (
                            <div 
                                key={suppId}
                                className={`stack-card ${isSupplementTaken(suppId) ? 'taken' : ''}`}
                            >
                                <div className="stack-card-header">
                                    <div className="stack-info">
                                        <span className="stack-icon">{supplement.icon}</span>
                                        <div className="stack-details">
                                            <h4>{supplement.name}</h4>
                                            <span className="stack-dosage">{supplement.dosage}</span>
                                        </div>
                                    </div>
                                    <button
                                        className={`take-button ${isSupplementTaken(suppId) ? 'taken' : ''}`}
                                        onClick={() => toggleSupplement(suppId)}
                                    >
                                        {isSupplementTaken(suppId) ? '✅' : '⭕'}
                                    </button>
                                </div>
                                
                                <div className="stack-timing">
                                    {supplement.timing.map(time => (
                                        <span key={time} className="timing-tag">
                                            {timingLabels[time]}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="stack-actions">
                                    <span className="stack-cost">{supplement.cost}</span>
                                    <button
                                        className="remove-button"
                                        onClick={() => removeFromStack(suppId)}
                                        title="Rimuovi dallo stack"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CATEGORY FILTER */}
            <div className="category-filter">
                <h2>🔍 ESPLORA SUPPLEMENTI</h2>
                <div className="filter-buttons">
                    {Object.entries(categories).map(([key, category]) => (
                        <button
                            key={key}
                            className={`filter-btn ${selectedCategory === key ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(key)}
                            style={{ '--category-color': category.color }}
                        >
                            <span className="filter-icon">{category.icon}</span>
                            <span className="filter-name">{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* SUPPLEMENTS CATALOG */}
            <div className="supplements-catalog">
                <div className="catalog-grid">
                    {getFilteredSupplements().map(([suppId, supplement]) => {
                        const inStack = currentStack.includes(suppId);
                        
                        return (
                            <div key={suppId} className={`supplement-card ${supplement.priority}`}>
                                <div className="supplement-header">
                                    <div className="supplement-main">
                                        <span className="supplement-icon">{supplement.icon}</span>
                                        <div className="supplement-info">
                                            <h3>{supplement.name}</h3>
                                            <span className="supplement-category">
                                                {categories[supplement.category].name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="supplement-priority">
                                        {supplement.priority === 'essential' && <span className="priority-badge essential">Essential</span>}
                                        {supplement.priority === 'important' && <span className="priority-badge important">Important</span>}
                                        {supplement.priority === 'optional' && <span className="priority-badge optional">Optional</span>}
                                    </div>
                                </div>

                                <div className="supplement-description">
                                    <p>{supplement.description}</p>
                                </div>

                                <div className="supplement-details">
                                    <div className="detail-row">
                                        <span className="detail-label">💊 Dosaggio:</span>
                                        <span className="detail-value">{supplement.dosage}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">💰 Costo:</span>
                                        <span className="detail-value">{supplement.cost}</span>
                                    </div>
                                </div>

                                <div className="supplement-benefits">
                                    <h4>Benefici:</h4>
                                    <div className="benefits-tags">
                                        {supplement.benefits.map((benefit, index) => (
                                            <span key={index} className="benefit-tag">
                                                {benefit}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="supplement-timing">
                                    <h4>Quando assumere:</h4>
                                    <div className="timing-tags">
                                        {supplement.timing.map(time => (
                                            <span key={time} className="timing-tag">
                                                {timingLabels[time]}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="supplement-instructions">
                                    <p><strong>Istruzioni:</strong> {supplement.instructions}</p>
                                </div>

                                <div className="supplement-actions">
                                    {inStack ? (
                                        <button
                                            className="action-button remove"
                                            onClick={() => removeFromStack(suppId)}
                                        >
                                            ❌ Rimuovi dal Stack
                                        </button>
                                    ) : (
                                        <button
                                            className="action-button add"
                                            onClick={() => addToStack(suppId)}
                                        >
                                            ➕ Aggiungi al Stack
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TIMING GUIDE */}
            <div className="timing-guide">
                <h2>⏰ GUIDA AI TIMING</h2>
                <div className="timing-schedule">
                    <div className="time-slot">
                        <h3>🌅 Mattino (7:00-9:00)</h3>
                        <div className="time-supplements">
                            {Object.entries(supplements)
                                .filter(([id, supp]) => currentStack.includes(id) && supp.timing.includes('breakfast'))
                                .map(([id, supp]) => (
                                    <span key={id} className="time-supp">{supp.icon} {supp.name}</span>
                                ))
                            }
                        </div>
                    </div>

                    <div className="time-slot">
                        <h3>🏋️ Pre-Workout (30-45min prima)</h3>
                        <div className="time-supplements">
                            {Object.entries(supplements)
                                .filter(([id, supp]) => currentStack.includes(id) && supp.timing.includes('pre-workout'))
                                .map(([id, supp]) => (
                                    <span key={id} className="time-supp">{supp.icon} {supp.name}</span>
                                ))
                            }
                        </div>
                    </div>

                    <div className="time-slot">
                        <h3>🔥 Post-Workout (0-30min dopo)</h3>
                        <div className="time-supplements">
                            {Object.entries(supplements)
                                .filter(([id, supp]) => currentStack.includes(id) && supp.timing.includes('post-workout'))
                                .map(([id, supp]) => (
                                    <span key={id} className="time-supp">{supp.icon} {supp.name}</span>
                                ))
                            }
                        </div>
                    </div>

                    <div className="time-slot">
                        <h3>🌙 Sera (prima di dormire)</h3>
                        <div className="time-supplements">
                            {Object.entries(supplements)
                                .filter(([id, supp]) => currentStack.includes(id) && supp.timing.includes('evening'))
                                .map(([id, supp]) => (
                                    <span key={id} className="time-supp">{supp.icon} {supp.name}</span>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="supplements-actions">
                <button 
                    className="action-button reset"
                    onClick={() => {
                        setTakenToday({});
                        localStorage.removeItem('supplementsTaken');
                    }}
                >
                    🔄 Reset Giorno
                </button>
                <button 
                    className="action-button clear"
                    onClick={() => {
                        setCurrentStack([]);
                        localStorage.removeItem('currentStack');
                    }}
                >
                    🗑️ Svuota Stack
                </button>
            </div>
        </div>
    );
};

export default Supplements;