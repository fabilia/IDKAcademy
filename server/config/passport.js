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
        // 1) Try to find by googleId
        let user = await User.findOne({ googleId: profile.id });

        // 2) If not found, try to find by email
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // attach googleId to existing account
            user.googleId   = profile.id;
            user.isVerified = true;
            await user.save();
          }
        }

        // 3) If still no user, create a brand-new one
        if (!user) {
          user = await User.create({
            name:       profile.displayName,
            email:      profile.emails[0].value,
            password:   'GOOGLE_OAUTH',
            role:       'student',        // or 'student' if you prefer
            isVerified: true,
            googleId:   profile.id
          });
        }

        // 4) Sign and return a JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '7d'
        });

        done(null, { token, id: user._id, role: user.role });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
