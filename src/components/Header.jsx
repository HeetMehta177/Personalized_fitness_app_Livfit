import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const isUserSignedIn = !!localStorage.getItem('token')
    const navigate = useNavigate();

    const handleSignOut = () => {
        localStorage.removeItem('token')
    }
    return (

        <div id='header'>
            <nav>
                <Link to="/"><img id='title-image' src={logo} alt="Coach Me Fit" /></Link>
                <div id="nav-part2">
                    <h4><Link to="/">Home</Link></h4>
                    <h4><Link to="/Workout">Workout</Link></h4>
                    <h4><Link to="/Nutrition">Nutrition</Link></h4>
                    <h4><Link to="/ContactUs">Contact Us</Link></h4>
                    {isUserSignedIn ? (
                        <>
                            <h4><Link to='/Profile'>Profile</Link></h4>
                            <h4><Link to='/Login' onClick={handleSignOut}>Sign Out</Link></h4>
                        </>
                    ) : (
                        <>
                            <h4><Link to="/Signup">Sign Up</Link></h4>
                            <h4><Link to="/Login" >Login</Link></h4>
                        </>
                    )}
                </div>
                <h3>Menu</h3>
            </nav>
        </div>
    );
};

export default Header;
