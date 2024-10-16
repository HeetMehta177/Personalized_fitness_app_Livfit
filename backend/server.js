const expressAsyncHandler = require("express-async-handler");
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = express()
require('dotenv').config();

const SECRET_KEY = 'super-secret-key'
const db_url = process.env.DB_URL;
const admin_email = process.env.EMAIL;
const admin_password = process.env.EMAIL_PASS;

// middleware
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        description: 'Username of the user'
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        description: 'Email address of the user'
    },
    password: {
        type: String,
        required: true,
        description: 'Password of the user'
    },
    sex: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
        description: 'Sex of the user'
    },
    weight: {
        type: Number,
        required: true,
        min: 1,
        description: 'Weight of the user in kilograms'
    },
    height: {
        type: Number,
        required: true,
        min: 1,
        description: 'Height of the user in centimeters'
    },
    birthday: {
        type: String,
        required: true,
        description: 'Birthday of the user in the format YYYY-MM-DD'
    },
    lifestyle: {
        type: String,
        required: true,
        enum: ['Active', 'Moderate', 'Sedentary'],
        description: 'Lifestyle of the user'
    },
    goal: {
        type: String,
        required: true,
        enum: ['Weight Loss', 'Weight Gain', 'Weight Maintain', 'Bulking'],
        description: 'Goal of the user'
    },

    bmi: {
        type: Number,
        required: true,
        min: 1,
        description: 'BMI (Body Mass Index) of the user'
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        description: 'Age of the user'
    }
});
const User = mongoose.model('User', UserSchema);

//Routes

//POST REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, username, password, weight, height, sex, lifestyle, age, birthday, bmi, goal } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password: hashedPassword, weight, height, sex, lifestyle, age, birthday, bmi, goal })
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        console.error('Error during registration:', error); // <-- Add this line
        res.status(500).json({ error: 'Error signing up' })
    }
})



//GET Registered Users
app.get('/register', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)

    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
})

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
        res.json({ token, username: user.username, weight: user.weight, height: user.height, bmi: user.bmi, sex: user.sex, age: user.age }); // Return the username along with the token
    } catch (error) {
        console.error('Error logging in:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error logging in' });
    }
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: admin_email,
        pass: admin_password,
    },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
    const { email, subject, message } = req.body;
    console.log(email, subject, message);

    transporter.sendMail({
        from: admin_email,
        to: email,
        subject: subject,
        text: message,
    }, (err, info) => {
        if (err) {
            console.log('Error occurred:', err.message);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
})

app.post("/sendEmail", sendEmail)
app.listen(5000, () => {
    console.log(`Server is running on port 5000`);
});

