const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth');
const huellaRoutes = require('./routes/huella');
const passwordResetRoutes = require('./routes/passwordReset');

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', huellaRoutes);
app.use('/api', passwordResetRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});