const express = require('express');
const pool = require('../bd');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/guardar', authenticateToken, async (req, res) => {
  try {
    const { kilometros, transporte, electricidad, energiaRenovable, reciclaje, total_emisiones } = req.body;

    const kilometrosNum = parseFloat(kilometros);
    const electricidadNum = parseFloat(electricidad);
    const totalEmisionesNum = parseFloat(total_emisiones);

    if (isNaN(kilometrosNum) || isNaN(electricidadNum) || isNaN(totalEmisionesNum)) {
      return res.status(400).json({ 
        error: "Datos numéricos inválidos",
        recibido: { kilometros, electricidad, total_emisiones }
      });
    }

    if (!['si', 'no'].includes(energiaRenovable)) {
      return res.status(400).json({ error: "energiaRenovable debe ser 'si' o 'no'" });
    }

    let reciclajeValue = Array.isArray(reciclaje) 
      ? reciclaje.filter(item => item && item !== 'no_reciclo').join(',')
      : (reciclaje === 'no_reciclo' ? '' : reciclaje);
    reciclajeValue = reciclajeValue || 'no_reciclo';

    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
      const [huellaResult] = await conn.query(
        `INSERT INTO huella (
          kilometros, transporte, electricidad, 
          renovable, reciclaje, total_emisiones
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [kilometrosNum, transporte, electricidadNum, energiaRenovable, reciclajeValue, totalEmisionesNum]
      );

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

router.get('/historial', authenticateToken, async (req, res) => {
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

module.exports = router;
