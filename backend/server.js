const express = require('express');
const cors = require('cors');
const pool = require('./bd.js'); // Importamos la conexión
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '8116e6a30e1856625e50ead825375db00b7182bad1cfbc52c9770758d972a1e2'

const resetTokens ={}; // Almacenamos tokens de restablecimiento en memoria (puedes usar una base de datos en producción)
const app = express();
app.use(cors());
app.use(express.json()); // Para parsear JSON


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

app.post('/api/guardar', authenticateToken, async (req, res) => {
  try {
    const { kilometros, transporte, electricidad, energiaRenovable, reciclaje, total_emisiones } = req.body;

    // Validación y conversión de datos
    const kilometrosNum = parseFloat(kilometros);
    const electricidadNum = parseFloat(electricidad);
    const totalEmisionesNum = parseFloat(total_emisiones);

    if (isNaN(kilometrosNum) || isNaN(electricidadNum) || isNaN(totalEmisionesNum)) {
      return res.status(400).json({ 
        error: "Datos numéricos inválidos",
        recibido: { kilometros, electricidad, total_emisiones }
      });
    }

    // Validar ENUM
    if (!['si', 'no'].includes(energiaRenovable)) {
      return res.status(400).json({ error: "energiaRenovable debe ser 'si' o 'no'" });
    }

    // Procesar reciclaje
    let reciclajeValue = Array.isArray(reciclaje) 
      ? reciclaje.filter(item => item && item !== 'no_reciclo').join(',')
      : (reciclaje === 'no_reciclo' ? '' : reciclaje);
    reciclajeValue = reciclajeValue || 'no_reciclo';

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      // 1. Insertar en huella
      const [huellaResult] = await conn.query(
        `INSERT INTO huella (
          kilometros, transporte, electricidad, 
          renovable, reciclaje, total_emisiones
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [kilometrosNum, transporte, electricidadNum, energiaRenovable, reciclajeValue, totalEmisionesNum]
      );

      // 2. Insertar en perfiles
      await conn.query(
        `INSERT INTO perfiles (id_usuario, id_huella) VALUES (?, ?)`,
        [req.user.id, huellaResult.insertId]
      );

      await conn.commit();
      
      res.status(201).json({ 
        success: true,
        id_huella: huellaResult.insertId
      });

    } catch (error) {
      await conn.rollback();
      console.error('Error en transacción:', error);
      res.status(500).json({ 
        error: "Error al guardar datos",
        detalle: error.message,
        sqlError: error.sqlMessage
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error al guardar:', error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: error.message
    });
  }
});

app.get('/api/historial', authenticateToken, async (req, res) => {
  try {
    const [registros] = await pool.query(`
      SELECT 
        h.id,
        h.kilometros,
        h.transporte,
        h.electricidad,
        h.renovable AS energiaRenovable,
        h.reciclaje,
        h.total_emisiones,
        h.fecha
      FROM perfiles p
      JOIN huella h ON p.id_huella = h.id
      WHERE p.id_usuario = ?
      ORDER BY h.fecha DESC
      LIMIT 100
    `, [req.user.id]);

    res.json(registros);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      error: 'Error al obtener historial',
      detalle: error.message
    });
  }
});

// Endpoint para verificar token
app.get('/api/verificar-token', authenticateToken, (req, res) => {
  res.json({ valido: true });
});



// Registro de usuario
app.post('/api/registro', async (req, res) => {
  const { usuario, correo, contraseña } = req.body;

  try {
    // Verificar si el usuario o correo existen
    const [existingUser] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ? OR correo = ?',
      [usuario, correo]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'El usuario o correo ya existe' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    await pool.query(
      'INSERT INTO usuarios (usuario, correo, contraseña) VALUES (?, ?, ?)',
      [usuario, correo, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    // Buscar usuario
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0]; // Obtenemos el primer usuario

    // Validar contraseña
    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT con los datos correctos
    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario,
        correo: user.correo 
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        usuario: user.usuario,
        correo: user.correo
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error en el servidor',
      detalle: error.message 
    });
  }
});

app.post('/api/logout', authenticateToken, (req, res) => {
  res.json({ 
    success: true,
    message: 'Sesión cerrada exitosamente',
    timestamp: new Date().toISOString()
  });
});
// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de huella de carbono corriendo en http://localhost:${PORT}`);
});


//configuracion de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: 'gmail', //servicio de correo
  auth: {
    user: 'equiposalvambiente@gmail.com', // correo de envio de enlace de restablecimiento
    pass: 'zxwh tzkw scka wenc' //contraseña de aplicacion 
  }
});



// Solicitar restablecimiento
app.post('/api/solicitar-restablecimiento', async (req, res) => { // Endpoint para solicitar restablecimiento de contraseña
  const { correo } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Correo no encontrado' });
    }
    
    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    resetTokens[codigo] = {correo, expires: Date.now() + 1000 * 60 * 15, // 15 minutos
      verified: false // Marca si el código ha sido verificado
    };

    await transporter.sendMail({
      from: '"Salvambiente" <equiposalvambiente@gmail.com>', //correo de envio de enlace de restablecimiento de contraseña
      to: correo,
      subject: 'Código de recuperación de contraseña',
      html: `<p>Tu código de recuperación es: <b>${codigo}</b></p>
             <p>Este código es válido por 15 minutos.</p>`
    });

    res.json({ message: 'Se ha enviado un código de recuperación a tu correo.' });
  } catch (error) {
    console.error('Error en /api/solicitar-restablecimiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
//
////////
// Verifica el código para comprobar que el token es valido, aca se verifican los token q estan disponibles
//si el usuario hace la peticion para otro codigo y ese codigo aun es valido lo mueestra en la consola
//aca se resetea el token si a expirado para q no interfiera y el usuario no pueda seguir usandolo
app.post('/api/verificar-codigo', (req, res) => {
  const { token } = req.body;
  console.log('Verificando token:', token);
  console.log('Tokens disponibles:', Object.keys(resetTokens));
  const data = resetTokens[token];
  if (!data) {
    console.log('Token no encontrado');
    return res.status(400).json({ error: 'Código inválido' });
  }
  if (data.expires < Date.now()) {
    console.log('Token expirado');
    delete resetTokens[token]; // Limpiar token expirado
    return res.status(400).json({ error: 'Código expirado' });
  }//
  // Marcar como verificado pero NO eliminar
  data.verified = true;
  console.log('Token verificado exitosamente');
  res.json({ valido: true });
});
// Restablecer contraseña
app.post('/api/restablecer-contra', async (req, res) => { //
  const { token, nuevaContraseña } = req.body;
  console.log('Restableciendo con token:', token);//par ver si funciona
  console.log('Tokens en memoria:', resetTokens);//
  const data = resetTokens[token];
  if (!data) {
    console.log('Token no encontrado para restablecimiento');
    return res.status(400).json({ error: 'Código inválido' });
  }
  if (data.expires < Date.now()) {
    console.log('Token expirado en restablecimiento');
    delete resetTokens[token];
    return res.status(400).json({ error: 'Código inválido o expirado' });
  }
  // Verificar que el token haya sido previamente verificado
  if (!data.verified) {
    return res.status(400).json({ error: 'Código no verificado' });
  }
  if (!nuevaContraseña || nuevaContraseña.length < 8) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
  }
  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
    await pool.query('UPDATE usuarios SET contraseña = ? WHERE correo = ?', [hashedPassword, data.correo]); // Actualiza la contraseña del usuario en la base de datos
    delete resetTokens[token];//aca se cambia x el token// elimina el token despues de restablecer la contraseña
    res.json({ message: 'Contraseña restablecida correctamente' }); // texto que muestra que la contraseña se ha restablecido correctamente
  } catch (error) {
    console.error('Error en restablecimiento:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
/////
//Recordar q el correo debe de ser real, sino no funcionara el restablecimiento.