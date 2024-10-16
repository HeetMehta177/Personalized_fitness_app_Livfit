import React, { useState, useEffect } from 'react';
import axios from 'axios';
import videoSrc from '../assets/hero.mp4';

const fitness_quote = process.env.REACT_APP_QUOTES_API;

const Home = () => {
  return (
    <div id='home'>
      <div id="center">
        <div id="left">
          <h3>From pose correction to personalized meal plans, our app helps you get fit and stay fit with cutting-edge technology."</h3>
        </div>
        <div id="right">
          <h1>TRACK <br></br>
            TRAIN<br></br>
            TRANSFORM</h1>
        </div>
      </div>

      <div id="hero-shape">
        <div id="hero-1"></div>
        <div id="hero-2"></div>
        <div id="hero-3"></div>
      </div>
      <video autoPlay muted loop>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <h1 className='faq'> FAQs</h1>
      <div className="accordion">
        <AccordionItem
          title="How does the app provide personalized exercise and diet recommendations?"
          content="The app uses machine learning models to analyze your BMI, physical activity, and other user data to generate customized diet and workout plans tailored to your health goals and body type."
        />
        <AccordionItem
          title="Can I track my daily food intake and check its nutritional value?"
          content="Yes! You can search for foods within the app, and it will display detailed nutritional information, including calories, proteins, carbs, and fats."
        />
        <AccordionItem
          title="How is my data stored and is it secure?"
          content="Your data is securely stored in MongoDB, and we use industry-standard security protocols to ensure the privacy and protection of your personal information."
        />
        <AccordionItem
          title="How are exercise plans tailored to my fitness level?"
          content="The app takes into account your input data, such as fitness goals, BMI, and activity levels, to provide exercise plans that align with your current fitness level and desired outcomes."
        />
      </div>
      <div className='fitnessq'>
        <img src={require("../assets/fq2.jpeg")} alt="fitnessquo" />
      </div>
      <div className='quotation'>
        <img src={require("../assets/quotation.png")} alt="quotation" />
      </div>
      <div className='fithead'>
        <h1 className='siq'> STRENGTH IN WORDS</h1>
      </div>
      <FitnessQuote />

    </div>
  );
};

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>{title}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

const FitnessQuote = () => {
  const [quoteData, setQuoteData] = useState({ quote: '', author: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const category = 'fitness';
    axios.get(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
      headers: { 'X-Api-Key': fitness_quote }

    })
      .then(response => {
        const data = response.data;
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuoteData({ quote: data[randomIndex].quote, author: data[randomIndex].author });
        // console.log(data);
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
        setError('Failed to fetch quote. Please try again later.');
      });
  }, []);
  return (
    <div className="fitness-quote">
      {quoteData.quote ? <p className='fq'>{quoteData.quote} <p className='authour'>- {quoteData.author}</p></p> : <p className='loading'>{error || 'Loading...'}</p>}
    </div>
  );
};

export default Home;