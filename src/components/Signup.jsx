import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function App() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [bmi, setBmi] = useState(null);
  const [age, setAge] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  const onSubmit = async (data) => {
    try {
      // Register user
      const response = await axios.post('http://localhost:5000/register', {
        username: data.Username,
        email: data.Email,
        password: data.Password,
        age: data.Age,
        bmi: data.BMI,
        sex: data.Sex,
        weight: data.Weight,
        height: data.Height,
        lifestyle: data.Lifestyle,
        goal: data.Goal,
        birthday: data.birthday
      });

      // Fetch exercise recommendations
      const exerciseresponse = await fetch('http://localhost:8000/exercise_recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Weight: data.Weight,
          Height: data.Height,
          BMI: data.BMI,
          Gender: data.Sex === 'Male' ? 1 : 0,
          Age: data.Age,
        })
      });

      if (!exerciseresponse.ok) {
        throw new Error(`Error fetching exercise recommendations: ${exerciseresponse.statusText}`);
      }

      const exerciseResult = await exerciseresponse.json();
      console.log('Exercise Recommendation:', exerciseResult.recommendation);

      // Storing data on localStorage
      localStorage.setItem('username', data.Username);
      localStorage.setItem('email', data.Email);
      localStorage.setItem('age', data.Age);
      localStorage.setItem('bmi', data.BMI);
      localStorage.setItem('sex', data.Sex);
      localStorage.setItem('weight', data.Weight);
      localStorage.setItem('height', data.Height);
      localStorage.setItem('lifestyle', data.Lifestyle);
      localStorage.setItem('goal', data.Goal);
      localStorage.setItem('exerciseRecommendation', JSON.stringify(exerciseResult.recommendation));

      alert('Registration Successful');
      navigate('/Login');
    } catch (error) {
      console.error('Unable to register user:', error);
      alert('Registration failed');
    }
  };



  console.log(errors);

  const weight = watch('Weight');
  const height = watch('Height');
  const birthday = watch('birthday');
  const password = watch('Password');

  // Password validation regex
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      return 'Weak';
    }
    let strength = 0;
    if (password.match(/[a-z]+/)) strength += 1;
    if (password.match(/[A-Z]+/)) strength += 1;
    if (password.match(/[0-9]+/)) strength += 1;
    if (password.match(/[@$!%*?&]+/)) strength += 1;

    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    }
  }, [password]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const ageDifference = today - birthDateObj;
    const calculatedAge = Math.floor(ageDifference / (1000 * 60 * 60 * 24 * 365.25));
    return calculatedAge;
  };

  const calculateBmi = (weight, height) => {
    if (!height || !weight) return null;
    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = parseFloat(weight) / (heightInMeters * heightInMeters);
    return parseFloat(bmiValue.toFixed(2));
  };

  useEffect(() => {
    const calculatedAge = calculateAge(birthday);
    setAge(calculatedAge);
    setValue('Age', calculatedAge);
  }, [birthday, setValue]);

  useEffect(() => {
    const calculatedBmi = calculateBmi(weight, height);
    setBmi(calculatedBmi);
    setValue('BMI', calculatedBmi);
  }, [weight, height, setValue]);

  return (
    <div className='form'>
      <form onSubmit={handleSubmit(onSubmit)} className="signup-form" action="https://api.web3forms.com/submit" method="POST">
        <input type='hidden' name='access_key' value='2612d542-2b05-44f3-90af-4d66e5897c65' />
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" placeholder="Username" {...register("Username", { required: true })} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" placeholder="Email" {...register("Email", { required: true })} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Password"
            {...register("Password", {
              required: "Password is required",
              pattern: {
                value: passwordPattern,
                message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
              }
            })}
          />
          {errors.Password && <span className="error-message">{errors.Password.message}</span>}
          {passwordStrength && <span className={`password-strength strength-${passwordStrength.toLowerCase()}`}>Password Strength: {passwordStrength}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <div className="radio-group">
            <label><input {...register("Sex", { required: true })} type="radio" value="Male" />Male</label>
            <label><input {...register("Sex", { required: true })} type="radio" value="Female" />Female</label>
            <label><input {...register("Sex", { required: true })} type="radio" value="Others" />Others</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input type="number" placeholder="Weight (kg)" {...register("Weight", { required: true, min: 1 })} />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height:</label>
          <input type="number" placeholder="Height (cm)" {...register("Height", { required: true, min: 1 })} />
        </div>
        <div className="form-group">
          <label htmlFor="birthday">Birthday:</label>
          <input type="date" placeholder="Date Of Birth" {...register("birthday", { required: true })} />
        </div>
        <div className="form-group">
          <label htmlFor="lifestyle">Lifestyle:</label>
          <select {...register("Lifestyle", { required: true })}>
            <option value="Sedentary">Sedentary</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
          </select>

        </div>
        <div className="form-group">
          <label htmlFor="Goal">Goal:</label>
          <select {...register("Goal", { required: true })}>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Weight Maintain">Weight Maintain</option>
            <option value="Bulking">Bulking</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="BMI">BMI:</label>
          <input type="float" placeholder="BMI" {...register("BMI", { required: true, readOnly: true })} />
        </div>
        <div className="form-group">
          <label htmlFor="Age">Age:</label>
          <input type="text" placeholder="calculated from DOB" {...register("Age", { required: true, min: 18, readOnly: true })} />
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
      </form>
    </div>
  );
}
