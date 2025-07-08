const router   = require('express').Router();
const passport = require('passport');
const { register, login, verify } = require('../controllers/authController');

// Local
router.post('/register', register);
router.post('/login',    login);
router.get('/verify/:token', verify);

// Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope:['email','profile'], session:false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect:'/' , session:false }),
  (req, res) => {
    // after OAuth, redirect into React with the JWT
    res.redirect(`${process.env.CLIENT_URL}/oauth?token=${req.user.token}`);
  }
);

module.exports = router;
