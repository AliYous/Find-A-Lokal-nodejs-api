const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const localRoute = require('./routes/locals');
const localPreviewRoute = require('./routes/localPreviews');


dotenv.config();

// DB connect
mongoose.connect(process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true},
() => console.log('connected to db!'))

// CORS
const corsOptions = {
    exposedHeaders: 'auth-token',
  };
app.use(cors(corsOptions));

// Middleware
app.use(express.json());


// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/locals', localRoute);
app.use('/api/locals/previews', localPreviewRoute);



app.listen(3000, () => console.log('Server Up and running'));