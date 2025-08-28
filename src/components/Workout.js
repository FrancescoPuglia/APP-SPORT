import React from 'react';

const Workout = () => {
    return (
        <div className="workout-container">
            <h2>Workout Routines for Extraordinary Growth</h2>
            <p>Here you will find tailored workout routines designed to maximize your physical growth.</p>
            <div className="workout-list">
                <h3>Weekly Workout Plan</h3>
                <ul>
                    <li>
                        <strong>Monday:</strong> Upper Body Strength
                        <ul>
                            <li>Bench Press</li>
                            <li>Pull-Ups</li>
                            <li>Shoulder Press</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Tuesday:</strong> Lower Body Strength
                        <ul>
                            <li>Squats</li>
                            <li>Deadlifts</li>
                            <li>Leg Press</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Wednesday:</strong> Active Recovery
                        <ul>
                            <li>Light Cardio</li>
                            <li>Stretching</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Thursday:</strong> Hypertrophy Focus
                        <ul>
                            <li>Dumbbell Flyes</li>
                            <li>Leg Curls</li>
                            <li>Tricep Extensions</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Friday:</strong> Full Body Workout
                        <ul>
                            <li>Deadlifts</li>
                            <li>Push-Ups</li>
                            <li>Plank</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Saturday:</strong> Cardio and Core
                        <ul>
                            <li>Running</li>
                            <li>Core Exercises</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Sunday:</strong> Rest and Recovery
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Workout;