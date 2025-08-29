import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Workout from './components/Workout';
import Nutrition from './components/Nutrition';
import Supplements from './components/Supplements';
import Recovery from './components/Recovery';
import Progress from './components/Progress';
import './styles/main.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/workout" element={<Workout />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/supplements" element={<Supplements />} />
                    <Route path="/recovery" element={<Recovery />} />
                    <Route path="/progress" element={<Progress />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;