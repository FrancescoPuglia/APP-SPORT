// Export Data Utility - Multi-format Export System
// Sistema completo per esportare dati fitness in vari formati

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { progressRepo, workoutRepo, exerciseRepo, userRepo } from '../firebase/firestore';
import { logger } from '../firebase/config';

class DataExporter {
    constructor() {
        this.supportedFormats = ['json', 'csv', 'pdf', 'xlsx'];
    }

    // Export completo di tutti i dati utente
    async exportAllData(format = 'json', options = {}) {
        try {
            logger.info(`Avvio export dati in formato ${format}...`);

            const exportData = await this.collectAllUserData(options);
            
            if (!exportData) {
                throw new Error('Impossibile raccogliere i dati per l\'export');
            }

            let result;
            switch (format.toLowerCase()) {
                case 'json':
                    result = this.exportToJSON(exportData, options);
                    break;
                case 'csv':
                    result = this.exportToCSV(exportData, options);
                    break;
                case 'pdf':
                    result = await this.exportToPDF(exportData, options);
                    break;
                case 'xlsx':
                    result = this.exportToExcel(exportData, options);
                    break;
                default:
                    throw new Error(`Formato ${format} non supportato`);
            }

            logger.success(`Export ${format} completato`, { size: result.size });
            return { success: true, data: result, format };

        } catch (error) {
            logger.error(`Errore export ${format}`, error);
            return { success: false, error: error.message };
        }
    }

    // Raccolta dati completi utente
    async collectAllUserData(options = {}) {
        try {
            const { dateRange } = options;
            
            // Determina range date
            let startDate, endDate;
            if (dateRange) {
                startDate = dateRange.start;
                endDate = dateRange.end;
            }

            // Carica tutti i dati in parallelo
            const [progressResult, workoutResult, exerciseResult, userResult] = await Promise.all([
                progressRepo.getUserProgress(
                    startDate ? startDate.toISOString().split('T')[0] : null,
                    endDate ? endDate.toISOString().split('T')[0] : null
                ),
                workoutRepo.getUserSessions(1000), // Limite alto per export completo
                exerciseRepo.getWithQuery([]),
                userRepo.getCurrentUserProfile()
            ]);

            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    exportFormat: 'complete',
                    dateRange: dateRange ? {
                        start: startDate.toISOString(),
                        end: endDate.toISOString()
                    } : 'all_time',
                    user: {
                        uid: userResult.data?.uid,
                        email: userResult.data?.email,
                        displayName: userResult.data?.displayName
                    }
                },
                progress: progressResult.success ? progressResult.data : [],
                workouts: workoutResult.success ? workoutResult.data : [],
                exercises: exerciseResult.success ? exerciseResult.data : [],
                profile: userResult.success ? userResult.data : null,
                statistics: this.calculateStatistics({
                    progress: progressResult.data || [],
                    workouts: workoutResult.data || [],
                    exercises: exerciseResult.data || []
                })
            };

            return exportData;

        } catch (error) {
            logger.error('Errore raccolta dati export', error);
            return null;
        }
    }

    // Export JSON con compressione opzionale
    exportToJSON(data, options = {}) {
        const { pretty = true, includeMetadata = true } = options;

        let exportData = data;
        if (!includeMetadata) {
            const { metadata, ...dataWithoutMeta } = data;
            exportData = dataWithoutMeta;
        }

        const jsonString = pretty 
            ? JSON.stringify(exportData, null, 2)
            : JSON.stringify(exportData);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const filename = this.generateFilename('fitness-data', 'json');
        
        this.downloadBlob(blob, filename);
        
        return {
            blob,
            filename,
            size: this.formatFileSize(blob.size),
            mimeType: 'application/json'
        };
    }

    // Export CSV multipli (un file per tipo dati)
    exportToCSV(data, options = {}) {
        const { separator = ',', includeHeaders = true } = options;
        const zipFiles = [];

        // Progress CSV
        if (data.progress.length > 0) {
            const progressCSV = this.arrayToCSV(data.progress, {
                headers: ['date', 'weight', 'bodyFat', 'muscleMass', 'chest', 'arms', 'waist', 'thighs', 'notes'],
                labels: ['Data', 'Peso (kg)', 'Massa Grassa (%)', 'Massa Muscolare (kg)', 
                        'Petto (cm)', 'Braccia (cm)', 'Vita (cm)', 'Cosce (cm)', 'Note'],
                separator,
                includeHeaders
            });
            zipFiles.push({ name: 'progressi.csv', content: progressCSV });
        }

        // Workouts CSV
        if (data.workouts.length > 0) {
            const workoutCSV = this.arrayToCSV(data.workouts, {
                headers: ['date', 'name', 'status', 'totalDuration', 'notes'],
                labels: ['Data', 'Nome Workout', 'Stato', 'Durata (min)', 'Note'],
                separator,
                includeHeaders,
                transformer: (workout) => ({
                    ...workout,
                    date: workout.date || format(new Date(workout.createdAt?.seconds * 1000 || Date.now()), 'yyyy-MM-dd'),
                    totalDuration: workout.totalDuration || 0
                })
            });
            zipFiles.push({ name: 'allenamenti.csv', content: workoutCSV });
        }

        // Exercises CSV
        if (data.exercises.length > 0) {
            const exerciseCSV = this.arrayToCSV(data.exercises, {
                headers: ['date', 'exerciseName', 'sets', 'reps', 'weight', 'rir', 'notes'],
                labels: ['Data', 'Esercizio', 'Serie', 'Ripetizioni', 'Peso (kg)', 'RIR', 'Note'],
                separator,
                includeHeaders
            });
            zipFiles.push({ name: 'esercizi.csv', content: exerciseCSV });
        }

        // Statistics CSV
        const statisticsCSV = this.objectToCSV(data.statistics, {
            separator,
            includeHeaders
        });
        zipFiles.push({ name: 'statistiche.csv', content: statisticsCSV });

        // Crea un singolo file CSV se solo un tipo di dati
        if (zipFiles.length === 1) {
            const csvData = zipFiles[0].content;
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const filename = this.generateFilename('fitness-data', 'csv');
            
            this.downloadBlob(blob, filename);
            
            return {
                blob,
                filename,
                size: this.formatFileSize(blob.size),
                mimeType: 'text/csv'
            };
        }

        // Altrimenti crea un ZIP con tutti i file CSV
        return this.createZipArchive(zipFiles, 'fitness-data-csv');
    }

    // Export PDF Report
    async exportToPDF(data, options = {}) {
        try {
            // Per un'implementazione completa, useresti una libreria come jsPDF
            // Qui creo un mock HTML che può essere stampato come PDF

            const htmlContent = this.generatePDFHTML(data, options);
            
            // Crea un blob HTML che può essere aperto e stampato
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const filename = this.generateFilename('fitness-report', 'html');
            
            this.downloadBlob(blob, filename);

            return {
                blob,
                filename,
                size: this.formatFileSize(blob.size),
                mimeType: 'text/html',
                note: 'Apri il file HTML e usa Stampa > Salva come PDF'
            };

        } catch (error) {
            logger.error('Errore export PDF', error);
            throw error;
        }
    }

    // Genera HTML per PDF report
    generatePDFHTML(data, options = {}) {
        const { includeCharts = false } = options;
        
        return `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Report Fitness - ${format(new Date(), 'dd/MM/yyyy')}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px;
                    color: #333;
                    line-height: 1.6;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #007bff;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }
                .stat-card {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    text-align: center;
                }
                .stat-value {
                    font-size: 2em;
                    font-weight: bold;
                    color: #007bff;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    padding: 8px 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #007bff;
                    color: white;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                .section {
                    margin: 30px 0;
                    page-break-inside: avoid;
                }
                .section h2 {
                    color: #007bff;
                    border-bottom: 1px solid #007bff;
                    padding-bottom: 10px;
                }
                @media print {
                    body { margin: 0; }
                    .section { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🏋️ Report Fitness Personale</h1>
                <p>Generato il ${format(new Date(), 'dd MMMM yyyy', { locale: it })}</p>
                <p>Utente: ${data.profile?.displayName || data.metadata?.user?.email || 'N/A'}</p>
            </div>

            <div class="section">
                <h2>📊 Statistiche Generali</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${data.statistics.totalWorkouts || 0}</div>
                        <div>Workout Totali</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${Math.round((data.statistics.totalWorkoutTime || 0) / 60)}h</div>
                        <div>Tempo Totale</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.statistics.totalExercises || 0}</div>
                        <div>Esercizi Registrati</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${data.progress.length || 0}</div>
                        <div>Misurazioni</div>
                    </div>
                </div>
            </div>

            ${data.progress.length > 0 ? `
            <div class="section">
                <h2>📈 Progressi Fisici</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Peso (kg)</th>
                            <th>Massa Grassa (%)</th>
                            <th>Massa Muscolare (kg)</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.progress.slice(0, 20).map(p => `
                            <tr>
                                <td>${p.date || 'N/A'}</td>
                                <td>${p.weight || '-'}</td>
                                <td>${p.bodyFat || '-'}</td>
                                <td>${p.muscleMass || '-'}</td>
                                <td>${p.notes || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${data.progress.length > 20 ? '<p><em>Mostrati solo i primi 20 record. Vedi export CSV completo per tutti i dati.</em></p>' : ''}
            </div>
            ` : ''}

            ${data.workouts.length > 0 ? `
            <div class="section">
                <h2>💪 Ultimi Allenamenti</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Nome</th>
                            <th>Durata (min)</th>
                            <th>Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.workouts.slice(0, 15).map(w => `
                            <tr>
                                <td>${w.date || format(new Date(w.createdAt?.seconds * 1000 || Date.now()), 'dd/MM/yyyy')}</td>
                                <td>${w.name || 'N/A'}</td>
                                <td>${w.totalDuration || 0}</td>
                                <td>${w.status || 'N/A'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <div class="section">
                <h2>ℹ️ Informazioni Export</h2>
                <p><strong>Data Export:</strong> ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
                <p><strong>Periodo Dati:</strong> ${data.metadata?.dateRange === 'all_time' ? 'Tutti i dati' : 
                    `${format(new Date(data.metadata.dateRange.start), 'dd/MM/yyyy')} - ${format(new Date(data.metadata.dateRange.end), 'dd/MM/yyyy')}`}</p>
                <p><strong>Totale Record:</strong> ${data.progress.length + data.workouts.length + data.exercises.length}</p>
                <p><em>Report generato automaticamente dall'app Extraordinary Growth.</em></p>
            </div>
        </body>
        </html>
        `;
    }

    // Utility: Array to CSV conversion
    arrayToCSV(array, options = {}) {
        const { 
            headers = null, 
            labels = null, 
            separator = ',', 
            includeHeaders = true,
            transformer = null
        } = options;

        if (!array.length) return '';

        // Applica trasformazione se specificata
        const data = transformer ? array.map(transformer) : array;

        // Determina headers
        const csvHeaders = headers || Object.keys(data[0]);
        const csvLabels = labels || csvHeaders;

        let csv = '';
        
        // Aggiungi intestazioni
        if (includeHeaders) {
            csv += csvLabels.join(separator) + '\n';
        }

        // Aggiungi dati
        data.forEach(row => {
            const values = csvHeaders.map(header => {
                let value = row[header] || '';
                
                // Gestisci valori con virgole o quote
                if (typeof value === 'string' && (value.includes(separator) || value.includes('"') || value.includes('\n'))) {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                
                return value;
            });
            csv += values.join(separator) + '\n';
        });

        return csv;
    }

    // Utility: Object to CSV (per statistiche)
    objectToCSV(obj, options = {}) {
        const { separator = ',', includeHeaders = true } = options;
        
        const flatObj = this.flattenObject(obj);
        const array = Object.entries(flatObj).map(([key, value]) => ({
            metric: key,
            value: value
        }));

        return this.arrayToCSV(array, {
            headers: ['metric', 'value'],
            labels: ['Metrica', 'Valore'],
            separator,
            includeHeaders
        });
    }

    // Utility: Flatten nested object
    flattenObject(obj, prefix = '') {
        const result = {};
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                
                if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    Object.assign(result, this.flattenObject(obj[key], newKey));
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
        
        return result;
    }

    // Calcola statistiche per export
    calculateStatistics(data) {
        const { progress, workouts, exercises } = data;
        
        const completedWorkouts = workouts.filter(w => w.status === 'completed');
        const totalWorkoutTime = completedWorkouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0);
        
        const uniqueExercises = new Set(exercises.map(e => e.exerciseName)).size;
        
        // Calcoli progressi
        const progressStats = {};
        if (progress.length > 0) {
            const sortedProgress = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date));
            const first = sortedProgress[0];
            const last = sortedProgress[sortedProgress.length - 1];
            
            progressStats.weightChange = last.weight && first.weight ? 
                (last.weight - first.weight).toFixed(1) : null;
            progressStats.muscleMassChange = last.muscleMass && first.muscleMass ? 
                (last.muscleMass - first.muscleMass).toFixed(1) : null;
            progressStats.bodyFatChange = last.bodyFat && first.bodyFat ? 
                (last.bodyFat - first.bodyFat).toFixed(1) : null;
        }

        return {
            totalWorkouts: completedWorkouts.length,
            totalWorkoutTime,
            averageWorkoutDuration: completedWorkouts.length > 0 ? 
                Math.round(totalWorkoutTime / completedWorkouts.length) : 0,
            totalExercises: exercises.length,
            uniqueExercises,
            progressEntries: progress.length,
            ...progressStats,
            dataRange: {
                firstEntry: progress.length > 0 ? progress[progress.length - 1].date : null,
                lastEntry: progress.length > 0 ? progress[0].date : null,
                totalDays: progress.length > 0 ? 
                    Math.ceil((new Date(progress[0].date) - new Date(progress[progress.length - 1].date)) / (1000 * 60 * 60 * 24)) : 0
            }
        };
    }

    // Utility functions
    generateFilename(base, extension) {
        const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
        return `${base}-${timestamp}.${extension}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadBlob(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    createZipArchive(files, baseName) {
        // In un'implementazione reale, useresti una libreria come JSZip
        // Per ora creo un singolo file CSV con tutti i dati concatenati
        
        let combinedContent = '';
        files.forEach((file, index) => {
            combinedContent += `# ${file.name}\n`;
            combinedContent += file.content;
            if (index < files.length - 1) {
                combinedContent += '\n\n';
            }
        });

        const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8;' });
        const filename = this.generateFilename(baseName, 'txt');
        
        this.downloadBlob(blob, filename);
        
        return {
            blob,
            filename,
            size: this.formatFileSize(blob.size),
            mimeType: 'text/plain',
            note: 'File combinato con tutti i dati CSV'
        };
    }
}

// Istanza singleton
const dataExporter = new DataExporter();

// Funzioni di convenienza per export rapido
export const exportFitnessDataJSON = (options = {}) => {
    return dataExporter.exportAllData('json', options);
};

export const exportFitnessDataCSV = (options = {}) => {
    return dataExporter.exportAllData('csv', options);
};

export const exportFitnessReport = (options = {}) => {
    return dataExporter.exportAllData('pdf', options);
};

// Export default
export default dataExporter;