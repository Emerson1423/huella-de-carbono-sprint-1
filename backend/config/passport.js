const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../bd'); // Ajusta el path si tu conexión está en otro archivo

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'TU_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'TU_CLIENT_SECRET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      const correo = profile.emails[0].value;
      const nombre = profile.displayName;
      const [usuarios] = await pool.query(
        'SELECT * FROM usuarios WHERE correo = ?',
        [correo]
      );
      let usuario;
      if (usuarios.length === 0) {
        const [result] = await pool.query(
          'INSERT INTO usuarios (usuario, correo, contraseña) VALUES (?, ?, ?)',
          [nombre, correo, 'google']
        );
        usuario = { id: result.insertId, usuario: nombre, correo };
      } else {
        usuario = usuarios[0];
      }
      done(null, usuario);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, usuarios[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;