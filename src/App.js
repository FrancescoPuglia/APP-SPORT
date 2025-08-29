import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/workout" component={Workout} />
                    <Route path="/nutrition" component={Nutrition} />
                    <Route path="/supplements" component={Supplements} />
                    <Route path="/recovery" component={Recovery} />
                    <Route path="/progress" component={Progress} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;