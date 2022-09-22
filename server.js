/* Dependencies */
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post')


/*  Initalalize Express */
const app = express();


/* dotenv Config */
require('dotenv').config();
const {PORT = 4000, DATABASE_URL} = process.env;


/* MongoDB Connection */
mongoose.connect(DATABASE_URL);

mongoose.connection
.on('connected', () => console.log('Connected to MongoDB'))
.on('disconnected', () => console.log('Disonnected to MongoDB'))
.on('error', () => console.log('Problem with MongoDB:' + error.message))


// /* Mount Middleware */
app.use(express.json());


/* Routes */
app.get('/', (req, res) => {
    res.send('Welcome');
});


// Index User
app.get('/api/user', async (req, res) => {
    try {
        res.status(200).json(await User.find({}));
    } catch (error) {
        console.log(error);
        res.status(400).json({
            'error': 'bad request'
        });
    }
});

// Create
// User API
app.post('/api/user',  async (req, res) =>{
    try {
        res.status(201).json(await User.create(req.body));
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'});
    }
});


/* Listner */
app.listen(PORT, () =>{
    console.log("Express is running on Port:" + PORT);
});