const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
// Import routes
const authRoute = require('./routes/auth');
const localRoute = require('./routes/locals');
const localPreviewRoute = require('./routes/localPreviews');
const conversationRoute = require('./routes/conversations');


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
app.use( '/uploads' ,express.static('uploads')); // to make the uploads folder available (public)


// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/locals', localRoute);
app.use('/api/locals/previews', localPreviewRoute);
app.use('/api/conversations', conversationRoute);




app.listen(3000, () => console.log('Server Up and running'));