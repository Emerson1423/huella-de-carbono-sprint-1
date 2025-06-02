<template>
  <div class="register-page"> 
    <div class="caja">
    <form @submit.prevent="handleRegister" class="register-form">
         <h1>Registrarte</h1>
      
      
       
      
      
        <div class="campo">
        <input v-model="usuario" placeholder="Usuario" required
        class="input">
        </div>
      
    
      
        <div class="campo">
        <input v-model="correo" type="email" placeholder="Correo" required 
        class="input">
        </div>
      
      
        <div class="campo">
        <input v-model="contraseña" type="password" placeholder="Contraseña" required
        class="input">
        </div>
      

        <div class="campo">
        <input v-model="confirmarContraseña" type="password" placeholder="Confirmar contraseña" required
        class="input">
        </div>
      
      <button type="submit">Registrarse</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
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
.register-page{
  position: fixed; /* Cubre toda la pantalla */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("@/assets/registrofondo.png");
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-form{
 max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Poppins, sans-serif;
}
.caja{
    background-color: #ffff;
    padding: 30px;
    border-radius: 10px;
    margin-top: 50px;
    
h1{
  text-align: center;
  color: #333;
}
.campo {
  margin: 15px 0;
  
}

    
}
.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
  border-color:#8BC34A ;
  
}
.input:focus {
  border-color: #8BC34A;
  outline: none;
}

.input::placeholder {
    color:#8BC34A;
}


button {
  width: 100%;
  padding: 10px;
  background: #8BC34A;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

</style>
