import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import runningimg from '../assets/running.png'
import walkingimg from '../assets/walking.png'
import weightlifterimg from '../assets/weightlifter.png'
import yogaimg from '../assets/yoga.png'

const NutritionInfo = () => {
    const [query, setQuery] = useState('');
    const [nutritionData, setNutritionData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: "User Not Logged In",
                text: "Please sign in to view nutrition",
                showCancelButton: true,
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sign In',
                cancelButtonText: 'Close',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                } else {
                    navigate('/');
                }
            });
        }
    }, [navigate]);

    const handleSearch = () => {
        const nutrition_info = process.env.REACT_APP_NUTRITION_INFO_API;

        axios.get(`https://api.calorieninjas.com/v1/nutrition?query=${query}`, {
            headers: {
                'X-Api-Key': nutrition_info,
            },
        })
            .then((response) => {
                if (response.data.items && response.data.items.length > 0) {
                    setNutritionData(response.data.items[0]);
                    setError(null);
                } else {
                    setNutritionData(null);
                    setError('No food found');
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
                setError('Error fetching data');
            });
    };

    const calculateMinutes = (calories, burnRate) => {
        return (calories / burnRate * 60).toFixed(0);
    };

    return (
        <div className="nutrition-info-container">
            <h1 className="nutrition-heading">Discover Nutrition Facts for Your Favorite Foods</h1>
            <h2 className="nutrition-subheading">Track calories and find out how to burn them with ease!</h2>

            <div className="nutrition-input">
                <input
                    type="text"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter food item"
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {error && <div className="error">Error: {error}</div>}
            {nutritionData && (
                <div className="nutrition-details">
                    <h3 className="nutrition-title">{nutritionData.name} - Nutrition Information:</h3>
                    <div className="nutrition-facts">
                        <div className="serving-size">
                            Serving Size: {nutritionData.serving_size_g}g
                        </div>
                        <ul>
                            <li><strong>Calories:</strong> <span>{nutritionData.calories}</span></li>
                            <li><strong>Carbohydrates:</strong> <span>{nutritionData.carbohydrates_total_g}g</span></li>
                            <li><strong>Cholesterol:</strong> <span>{nutritionData.cholesterol_mg}mg</span></li>
                            <li><strong>Saturated Fat:</strong> <span>{nutritionData.fat_saturated_g}g</span></li>
                            <li><strong>Total Fat:</strong> <span>{nutritionData.fat_total_g}g</span></li>
                            <li><strong>Fiber:</strong> <span>{nutritionData.fiber_g}g</span></li>
                            <li><strong>Potassium:</strong> <span>{nutritionData.potassium_mg}mg</span></li>
                            <li><strong>Protein:</strong> <span>{nutritionData.protein_g}g</span></li>
                            <li><strong>Sodium:</strong> <span>{nutritionData.sodium_mg}mg</span></li>
                            <li><strong>Sugar:</strong> <span>{nutritionData.sugar_g}g</span></li>
                        </ul>
                    </div>

                    <h2>To burn {nutritionData.calories} calories, you will need to:</h2>
                    <div className="burn-info">
                        <div className="activity">
                            <div className="icon-container">
                                <img src={runningimg} alt="Jog icon" className="icon" />
                            </div>
                            <div className="activity-info">
                                <h5>Jog</h5>
                                <p>You will have to jog for <strong>{calculateMinutes(nutritionData.calories, 378)}</strong> Minutes</p>
                            </div>
                        </div>

                        <div className="activity">
                            <div className="icon-container">
                                <img src={yogaimg} alt="Yoga icon" className="icon" />
                            </div>
                            <div className="activity-info">
                                <h5>Do Power Yoga</h5>
                                <p>You will have to do Power Yoga for <strong>{calculateMinutes(nutritionData.calories, 223)}</strong> Minutes</p>
                            </div>
                        </div>

                        <div className="activity">
                            <div className="icon-container">
                                <img src={weightlifterimg} alt="Weightlifting icon" className="icon" />
                            </div>
                            <div className="activity-info">
                                <h5>Get a Gym Workout</h5>
                                <p>You will have to lift weight for <strong>{calculateMinutes(nutritionData.calories, 483)}</strong> Minutes</p>
                            </div>
                        </div>

                        <div className="activity">
                            <div className="icon-container">
                                <img src={walkingimg} alt="Walking icon" className="icon" />
                            </div>
                            <div className="activity-info">
                                <h5>Go for a Brisk Walk</h5>
                                <p>You will have to brisk walk for <strong>{calculateMinutes(nutritionData.calories, 294)}</strong> Minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionInfo;
