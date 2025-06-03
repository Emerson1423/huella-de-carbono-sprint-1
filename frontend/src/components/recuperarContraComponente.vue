<template>
  <div class="recuperar-bg">
    <div class="recuperar-box">
      <h1>Recuperar contraseña</h1>
      <form @submit.prevent="handleSubmit">
        <input v-model="correo" type="email" placeholder="Correo" required />
        <button type="submit">Enviar enlace</button>
        <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <div class="volver">
        <a href="/login">Volver al login</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'RecuperarContraComponente',
  data() {
    return {
      correo: '',
      mensaje: '',
      error: ''
    };
  },
  methods: {
    async handleSubmit() {
      this.mensaje = '';
      this.error = '';
      try {
        const res = await axios.post('http://localhost:3000/api/solicitar-restablecimiento', { correo: this.correo });
        this.mensaje = res.data.message;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al solicitar restablecimiento';
      }
    }
  }
};
</script>

<style scoped>

.recuperar-bg {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.recuperar-box {
  background: #fff;
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
h1 {
  text-align: center;
  color: #333;
  margin-bottom: 18px;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #8BC34A;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  margin-bottom: 18px;
}
button {
  width: 100%;
  padding: 10px;
  background: #8BC34A;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
button:disabled {
  background: #b6d7a8;
  cursor: not-allowed;
}
.mensaje {
  color: #388e3c;
  text-align: center;
  margin-top: 8px;
}
.error {
  color: #e53935;
  text-align: center;
  margin-top: 8px;
}
.volver {
  text-align: center;
  margin-top: 10px;
}
.volver a {
  color: #8BC34A;
  text-decoration: none;
}
.volver a:hover {
  text-decoration: underline;
}

</style> 