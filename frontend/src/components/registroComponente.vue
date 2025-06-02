<template>
  <div>
    
    <form @submit.prevent="handleRegister">
      <label>
        Usuario:
        <input v-model="usuario" placeholder="Usuario" required>
      </label>
      <label>
        Correo:
        <input v-model="correo" type="email" placeholder="Correo" required>
      </label>
      <label>
        Contraseña:
        <input v-model="contraseña" type="password" placeholder="Contraseña" required>
      </label>
      <label>
        Confirmar contraseña:
        <input v-model="confirmarContraseña" type="password" placeholder="Confirmar contraseña" required>
      </label>
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuario: '',
      correo: '',
      contraseña: '',
      confirmarContraseña: '',
      error: ''
    };
  },
  methods: {
    async handleRegister() {
      
      if (this.contraseña !== this.confirmarContraseña) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/api/registro', {
          usuario: this.usuario,
          correo: this.correo,
          contraseña: this.contraseña
        });
        alert(response.data.message);
        this.$router.push({
        path: '/login',});
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al registrarse';
      }
    }
  }
};
</script>
<style scoped>

</style>
