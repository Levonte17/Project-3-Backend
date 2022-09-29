/* MODEL Dependencies */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
//CONTROLLERS//
const repliesRouter = require('./controllers/replies');
const usersRouter = require('./controllers/users');
const postsRouter = require('./controllers/posts');
//FIREBASE//
const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

/*  Initalalize Express */
const app = express();

/* dotenv Config */
require('dotenv').config();
const { PORT = 4000, DATABASE_URL } = process.env;

//CONFIG FIREBASE


admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "redundant-447d0",
    "private_key_id": "2067630de9b88ba586fa7629c2b2597cee0051e6",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDSexB6F2RryDUa\njLO8O+xzZ7UnonwzyIqHcIlBsD7Ly6BfAlpwsBgrqiz3/7OYyarN9Vwc+UlnmfyW\nF9A2y7VqC7L38mBogsJzxs++FsdtebJAUUilbu7kj2Inq1oXsDmIst/q1WtGYBHF\ncwPxaDaF9EpjbWhWuV1QZbRLbdFmZTwN2rVH4FIIJPsHuZt7N/5YU9cDdCCZsz+J\nhj47yBe+UdzUSSKZA8RxzeVtWTD8Mkac9s6vtsu5n4KJA4YknJDTk3r/PJsjgxpc\nuc9vQKHn118RxK4Flmd+rn4oGQOD6HkzjGxpBnFXHbjO50mBF3tqj/fGmgGK+gl4\nB88k+AqNAgMBAAECggEALe2NnF6TWpN+xvLR226l+06zcFkbyf7l/4TWZn+LTFP8\nBA9S5cj/FTQWiO0CZwIGY9e4yFe7JUCsJaI/nF1aEjBIVqNMVzHFNZc5yIxW6vQF\nqdQyymqI9VW2QNq6l3WsMEB77NWyCVK4PgIJZ7lqQFOckdKTVG0xR/RRYa4uZa2m\nwmR7QJxlulaD/Mhs+THqjGTLQ4oKf7J2MmkYPmAHIcLdAglLvgU41T5QWrek9UFr\nSPhXXyfXmliQMfsB/el/XetYSeVSgPvKK0yDNVndV4Qo9uJ64dul4RvypgrM03Re\nRzq0BL6bK3KitZmZxLFuqAJ3bkdR6nw6sWYeuoSVQQKBgQD8cBKO8kbdFzzCiQQE\n+VcMz5GOQcRWK/Xs45WfPhHeYz1m+8uQlaSv23bGDCtpf3xOJ/7wBwmJpl72BUns\nGpZcQaE1cO1nzleoIAD4wqiJvN6aV/BIeH4MiIMFsVOpc8SYHnzJ+0N5DWhVgDsZ\nWIqcNmZeGULfeJ4bVHXa42sK4QKBgQDVc2wyPLkAiFKF0u/zefonQosQdZ4szUxd\nz+MFql3cvMJndGXfbm6KfKq/X5qALa2S8tcWBzg2sgkEjVWfW3njfKPMACbcgUzv\n6bNg5NbYNUGQrTOAnv7+Xt6iASZzpg10FmCNvE+fju2WNwKgsx86Ys12Zdr0v6kg\njBUP7eRBLQKBgA1L6e5VnJ3wp2anyOpqJ8eo90XC+RCA6Ec+BZeJsW9BUu6lvKc0\n+qO4r5zm7zJzYJzNRoRmGn6BoObciHRDQkBBxLgH5rldCQj2BpcTycTXifIfR6zJ\ni/olBqG6IWn/iw9oK7KH5ZnuttwqEPLY0xQ/WU0Dj54twEY4QKzy5aSBAoGBANK/\nYq17XOIUtv3glf/ciEupHOsEZkcv8F2Tuz/FxWUDjiJdP5RKUaQ0kNXhDAfQkddM\nI2dhe3Qtdk/jSA3OYNtmHcd2wufmVlNueCiL6UCR3Il/KSGuWnBGtSRZZGC9K/1Z\ndr2alzcgBJ7S86o9EPExylFDIduTPOagyM7wf/SFAoGADItVVkZEJ2o3ay2O33Wl\nKq87+cXtPI/eFoCOc12HNCr6WeQFbQ/+z0RQwT1Y6TKW05ZpTXuXlozNuuV0h2vt\nhhL4HritoXWRz6oByEltXmUf7kNaUEdmaA/oQwwdDQ1tIxZJjniSVd8QuZUPm5Sz\nWxfuAPIqEIeJWNv/EwS198E=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-nv0xs@redundant-447d0.iam.gserviceaccount.com",
    "client_id": "111709835900757846298",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-nv0xs%40redundant-447d0.iam.gserviceaccount.com"
  })
});

/* MongoDB Connection */
mongoose.connect(DATABASE_URL);

mongoose.connection
  .on('connected', () => console.log('Connected to MongoDB'))
  .on('disconnected', () => console.log('Disonnected to MongoDB'))
  .on('error', () => console.log('Problem with MongoDB:' + error.message));

// Mount Middleware
app.use(express.json());
app.use(logger('dev')); //Interception
app.use(cors());
app.use(postsRouter);
app.use(usersRouter);
app.use(repliesRouter);
// app.use(commentsRouter);

//CUSTOM AUTHENTIC MIDDLEWARE
app.use(async function(req, res, next) {
  //Capture token from request
  const token = req.get('Authorization');
  //Check to see if we have token
  try {
      if(token) {
          const user = await getAuth().verifyIdToken(token.replace('Bearer ', ''));        //check for token 
          req.user = user;
      } else {
          req.user = null;
      }
          } catch (error) {
          return res.status(400).json({error: 'bad request'})
      }
  next();
});
//CUSTOM AUTH MIDDLEWARE
function isAuthenticated(req, res, next) {
  if(!req.user) {
       return res.status(401).json({error: 'You Must Login First'})
} else {
  next();
  }
}
// ROUTES
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

// Update
// User
app.put('/api/post/:id', async (req, res) => {
  try {
    res.status(200).json(
      await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'bad request',
    });
  }
});

app.put('/api/post/:id/comment', async (req, res) => {
  try {
    res.status(200).json(
      await Post.findByIdAndUpdate(
        req.params.id,
        { $push: { replies: req.body } },
        {
          new: true,
        }
      )
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: 'bad request',
    });
  }
});

// Delete
// Post
app.delete('/api/post/delete/:id', async (req, res) => {
  try {
    res.status(200).json(await Post.findByIdAndDelete(req.params.id));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'bad request' });
  }
});

/* Listner */
app.listen(PORT, () => {
  console.log('Express is running on Port:' + PORT);
});
