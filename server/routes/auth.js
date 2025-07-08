const router   = require('express').Router();
const { protect } = require('../middleware/auth');
const passport = require('passport');
const { register, login, verify, getMe } = require('../controllers/authController');

// Local
router.post('/register', register);
router.post('/login',    login);
router.get('/verify/:token', verify);

// fetchCurrentUser
router.get('/me', protect, getMe); 

// Kick off OAuth, preserving ?mode=register | login in the state parameter
router.get(
  '/google',
  (req, _res, next) => {
    // passport-google-oauth20 will URL-encode this into the handshake
    passport.authenticate('google', {
      scope: ['email','profile'],
      session: false,
      state: req.query.mode || 'login'
    })(req, _res, next);
  }
);

// Callback: Google returns ?code=…&state=<mode>
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect:'/', session:false }),
  (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/oauth?token=${req.user.token}`);
  }
);


module.exports = router;