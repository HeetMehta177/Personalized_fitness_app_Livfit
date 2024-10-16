import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const exercise_api = process.env.REACT_APP_EXERCISE_API;

function Workout() {
    const navigate = useNavigate();
    const [exercises, setExercises] = useState([]);
    const [search, setSearch] = useState('');
    const [bodyParts, setBodyParts] = useState(['all', 'chest', 'back', 'cardio', 'upper legs', 'lower legs', 'upper arms', 'lower arms', 'shoulders', 'neck', 'waist']);
    const [bodyPart, setBodyPart] = useState('all');
    const [loading, setLoading] = useState(false); // New loading state
    const [error, setError] = useState(''); // New error state

    const exerciseOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            'X-RapidAPI-Key': exercise_api,
        },
    };

    const fetchData = async (url, options) => {
        try {
            setLoading(true); // Show loading state
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch exercises. Please try again later.');
            return null; // Return null in case of error
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    useEffect(() => {
        const fetchExercisesData = async () => {
            let exercisesData = [];
            if (bodyPart === 'all') {
                exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
            } else {
                exercisesData = await fetchData(`https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`, exerciseOptions);
            }

            if (exercisesData) {
                setExercises(exercisesData);
            }
        };

        // Fetch exercises when the selected body part changes
        fetchExercisesData();
    }, [bodyPart]);

    const handleSearch = async () => {
        if (search) {
            const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);
            const searchedExercises = exercisesData?.filter(item =>
                item.name.toLowerCase().includes(search) ||
                item.target.toLowerCase().includes(search) ||
                item.equipment.toLowerCase().includes(search) ||
                item.bodyPart.toLowerCase().includes(search)
            );
            setExercises(searchedExercises);
            setSearch('');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'User Not Logged In',
                text: 'Please sign in to view workout',
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

    return (
        <div>
            <div className="stack center-text">
                <h1 className="heading">Awesome Exercises You <br /> Should Know</h1>

                <div className="search-container">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search Exercises"
                        value={search}
                        onChange={(e) => setSearch(e.target.value.toLowerCase())}
                    />
                    <button className="search-btn" onClick={handleSearch}>Search</button>
                </div>

                <div className="body-part-buttons">
                    {bodyParts.map((item) => (
                        <button
                            key={item}
                            className={`body-part-btn ${bodyPart === item ? 'active' : ''}`}
                            onClick={() => setBodyPart(item)}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Loading & Error States */}
                {loading && <p>Loading exercises...</p>}
                {error && <p className="error-message">{error}</p>}

                {/* Exercises Display Section */}
                {!loading && exercises.length === 0 && !error && <p>No exercises found for the selected body part.</p>}

                {!loading && exercises.length > 0 && (
                    <div className="exercise-list">
                        {exercises.map((exercise) => (
                            <Link className="exercise-card" to={`/exercise/${exercise.id}`} key={exercise.id}>
                                <img src={exercise.gifUrl} alt={exercise.name} loading="lazy" />
                                <div className="exercise-info">
                                    <button className="info-btn body-part">{exercise.bodyPart}</button>
                                    <button className="info-btn target">{exercise.target}</button>
                                </div>
                                <h3>{exercise.name}</h3>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Workout;
