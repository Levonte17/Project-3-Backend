/* MODEL Dependencies */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
      //
//CONTROLLERS//
      //
const repliesRouter = require('./controllers/replies');
const usersRouter = require('./controllers/users');
const postsRouter = require('./controllers/posts');
    //
//FIREBASE//
    //
const admin = require('firebase-admin');

/*  Initalalize Express */
const app = express();

/* dotenv Config */
require('dotenv').config();
const { PORT = 4000, DATABASE_URL } = process.env;
    //
//FIREBASE
    //
const serviceAccount = require('./service-account.json');

/* MongoDB Connection */
mongoose.connect(DATABASE_URL);

mongoose.connection
  .on('connected', () => console.log('Connected to MongoDB'))
  .on('disconnected', () => console.log('Disonnected to MongoDB'))
  .on('error', () => console.log('Problem with MongoDB:' + error.message));

// /* Mount Middleware */
app.use(express.json());
app.use(cors());
app.use(postsRouter);
app.use(usersRouter);
app.use(repliesRouter);

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
      error: 'bad request',
    });
  }
});

// Index Post
app.get('/api/post', async (req, res) => {
  try {
    res.status(200).json(await Post.find({}));
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'bad request',
    });
  }
});

// Create
// User API
app.post('/api/user', async (req, res) => {
  try {
    res.status(201).json(await User.create(req.body));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'bad request' });
  }
});

// Post API
app.post('/api/post', async (req, res) => {
  try {
    res.status(201).json(await Post.create(req.body));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'bad request' });
  }
});


// Delete 
// User
app.delete('/api/user/delete/:id', async (req,res) => {
    try {
        res.status(200).json(await User.findByIdAndDelete(
            req.params.id
        ))
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'}); 
    }
});

// Delete 
// Post
app.delete('/api/post/delete/:id', async (req,res) => {
    try {
        res.status(200).json(await Post.findByIdAndDelete(
            req.params.id
        ))
    } catch (error) {
        console.log(error);
        res.status(400).json({'error': 'bad request'}); 
    }
});


/* Listner */
app.listen(PORT, () => {
  console.log('Express is running on Port:' + PORT);
});
