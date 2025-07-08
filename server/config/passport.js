// server/config/passport.js
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt            = require('jsonwebtoken');
const User           = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL:  'http://localhost:5000/api/auth/google/callback'
    },
    async (accessToken, _refreshToken, profile, done) => {
      try {
        // 1) Find or create user
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
        user = await User.create({
            name:       profile.displayName,
            email:      profile.emails[0].value,
            password:   'GOOGLE_OAUTH',
            role:       'student',       // <— always student by default
            isVerified: true,
            googleId:   profile.id
        });
        }
        // 2) Sign JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // 3) Pass the token & user back to the callback
        done(null, { token, id: user._id, role: user.role });
      } catch (err) {
        done(err);
      }
    }
  )
);
