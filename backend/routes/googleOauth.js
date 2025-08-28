const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || '8116e6a30e1856625e50ead825375db00b7182bad1cfbc52c9770758d972a1e2';

// Ruta para iniciar autenticación con Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
);

// Callback de Google
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Genera un JWT para el usuario autenticado
    const token = jwt.sign(
      {
        id: req.user.id,
        usuario: req.user.usuario,
        correo: req.user.correo
      },
      JWT_SECRET,
      { expiresIn: '4h' }
    );
    // Redirige al frontend con el token como parámetro en la URL
    res.redirect(`http://localhost:8080/login-google?token=${token}`);
  }
);

module.exports = router;