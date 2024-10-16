import React, { useEffect, useState } from 'react';


function Profile() {
    const [username, setUsername] = useState('');
    const [exerciseRecommendation, setExerciseRecommendation] = useState('');
    const [userData, setUserData] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        const storedEmail = localStorage.getItem('email');
        const storedAge = localStorage.getItem('age');
        const storedBMI = localStorage.getItem('bmi');
        const storedSex = localStorage.getItem('sex');
        const storedWeight = localStorage.getItem('weight');
        const storedHeight = localStorage.getItem('height');
        const storedLifestyle = localStorage.getItem('lifestyle');
        const storedGoal = localStorage.getItem('goal');
        const storedRecommendation = localStorage.getItem('exerciseRecommendation');

        if (storedUsername) {
            setUsername(storedUsername);
        }

        // Check and parse the recommendation
        if (storedRecommendation) {
            setExerciseRecommendation(JSON.parse(storedRecommendation));
        }

        // Set user data in state
        setUserData({
            email: storedEmail,
            age: storedAge,
            sex: storedSex,
            bmi: storedBMI,
            weight: storedWeight,
            height: storedHeight,
            lifestyle: storedLifestyle,
            goal: storedGoal
        });
    }, []);

    return (
        <div className="welcome-container">
            <h1>Welcome, {username}!</h1>
            <h2>{username}'s Profile</h2>
            <div className="user-data">
                <div className="data-field"><strong>Email:</strong> {userData.email}</div>
                <div className="data-field"><strong>Age:</strong> {userData.age}</div>
                <div className="data-field"><strong>Sex:</strong> {userData.sex}</div>
                <div className="data-field"><strong>BMI:</strong> {userData.bmi}</div>
                <div className="data-field"><strong>Weight:</strong> {userData.weight} kg</div>
                <div className="data-field"><strong>Height:</strong> {userData.height} cm</div>
                <div className="data-field"><strong>Lifestyle:</strong> {userData.lifestyle}</div>
                <div className="data-field"><strong>Goal:</strong> {userData.goal}</div>
            </div>
            <div className="recommendation">
                <h2>Based on your profile, we recommend the following Exercises and Diet:</h2>
                <p>{exerciseRecommendation}</p>
            </div>
        </div>
    );
}

export default Profile;
