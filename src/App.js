import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './styles/App.css';


// components
import Header from './components/Header';
import Home from './components/Home';
import Nutrition from './components/Nutrition'
import Workout from './components/Workout';
import Profile from './components/Profile'
import Signup from './components/Signup'
import Login from './components/Login'
import ContactUs from './components/ContactUs'
import ExerciseDetail from './components/ExerciseDetail';

// styles
import './styles/Header.css'
import './styles/Home.css'
import './styles/Profile.css'
import './styles/Nutrition.css'
import './styles/Workout.css'
import './styles/Signup.css'
import './styles/ExerciseDetail.css'
import './styles/Login.css'
import './styles/ContactUs.css'

function App() {
  const isUserSignedIn = !!localStorage.getItem('token')

  return (
    <>
      <Router>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/exercise/:id" element={<ExerciseDetail />} />
            {isUserSignedIn && <Route path='/profile' element={<Profile />} />}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
