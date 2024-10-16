import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BodyPartImage from '../assets/body-part.png';
import TargetImage from '../assets/target.png';
import EquipmentImage from '../assets/equipment.png';

const exercise_api = process.env.REACT_APP_EXERCISE_API;
const youtube_api = process.env.REACT_APP_YOUTUBE_API;

const ExerciseDetail = () => {
    const [exerciseDetail, setExerciseDetail] = useState({});
    const [exerciseVideos, setExerciseVideos] = useState([]);
    const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
    const [equipmentExercises, setEquipmentExercises] = useState([]);
    const { id } = useParams();

    const exerciseOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            'X-RapidAPI-Key': exercise_api,
        },
    };

    const youtubeOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
            'X-RapidAPI-Key': youtube_api,
        },
    };

    const fetchData = async (url, options) => {
        const res = await fetch(url, options);
        const data = await res.json();
        return data;
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const fetchExercisesData = async () => {
            const exerciseDbUrl = 'https://exercisedb.p.rapidapi.com';
            const youtubeSearchUrl = 'https://youtube-search-and-download.p.rapidapi.com';
            const exerciseDetailData = await fetchData(`${exerciseDbUrl}/exercises/exercise/${id}`, exerciseOptions);
            setExerciseDetail(exerciseDetailData);
            const exerciseVideosData = await fetchData(`${youtubeSearchUrl}/search?query=${exerciseDetailData.name} exercise`, youtubeOptions);
            setExerciseVideos(exerciseVideosData.contents);
            const targetMuscleExercisesData = await fetchData(`${exerciseDbUrl}/exercises/target/${exerciseDetailData.target}`, exerciseOptions);
            setTargetMuscleExercises(targetMuscleExercisesData);
            const equimentExercisesData = await fetchData(`${exerciseDbUrl}/exercises/equipment/${exerciseDetailData.equipment}`, exerciseOptions);
            setEquipmentExercises(equimentExercisesData);
        };
        fetchExercisesData();
    }, [id]);

    if (!exerciseDetail) return <div>No Data</div>;

    const { bodyPart, gifUrl, name, target, equipment } = exerciseDetail;

    const extraDetail = [
        { icon: BodyPartImage, name: bodyPart },
        { icon: TargetImage, name: target },
        { icon: EquipmentImage, name: equipment },
    ];

    return (
        <div className="exercise-detail">
            <div className="detail">
                <img src={gifUrl} alt={name} loading="lazy" className="detail-image" />
                <div className="detail-content">
                    <h2>{name}</h2>
                    <p>
                        Exercises keep you strong. <span>{name}</span> bup is one
                        of the best exercises to target your {target}. It will help you improve your
                        mood and gain energy.
                    </p>
                    {extraDetail?.map((item) => (
                        <div key={item.name} className="extra-detail">
                            <button className="icon-button">
                                <img src={item.icon} alt={bodyPart} />
                            </button>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="exercise-videos">
                <h2>Watch <span>{name}</span> exercise videos</h2>
                <div className="videos-container">
                    {exerciseVideos?.slice(0, 3)?.map((item, index) => (
                        <a
                            key={index}
                            className="exercise-video"
                            href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={item.video.thumbnails[0].url} alt={item.video.title} />
                            <div>
                                <h3>{item.video.title}</h3>
                                <p>{item.video.channelName}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <div className="similar-exercises">
                <h2>Similar <span>Target Muscle</span> exercises</h2>
                <div className="exercises-container">
                    {targetMuscleExercises.length !== 0 ? (
                        <div className="exercise-list">
                            {targetMuscleExercises.slice(0, 4).map((item, index) => (
                                <div key={index} className="exercise-item">
                                    <img src={item.gifUrl} alt={item.name} loading="lazy" />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No similar exercises found</div>
                    )}
                </div>
                <h2>Similar <span>Equipment</span> exercises</h2>
                <div className="exercises-container">
                    {equipmentExercises.length !== 0 ? (
                        <div className="exercise-list">
                            {equipmentExercises.slice(0, 4).map((item, index) => (
                                <div key={index} className="exercise-item">
                                    <img src={item.gifUrl} alt={item.name} loading="lazy" />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>No similar exercises found</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseDetail;