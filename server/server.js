require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport');

const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/users');
const scoreRoutes = require('./routes/scores');
const { protect } = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(passport.initialize());             // ← enable Passport

app.use('/api/auth',  authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/scores', protect, scoreRoutes);

app.get('/api/ping', (_req, res) => res.json({ pong: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT||5000, () => console.log('Server running')))
  .catch(err => console.error(err));
