<template>
 
   
   <div class="login-page">  
  <div class="caja">
  <form @submit.prevent="handleSubmit" class="login-form">
    <h1>Bienvenido de nuevo</h1>

    <div class="campo">
    <input 
      v-model="usuario" 
      placeholder="Usuario" 
      required
      class="input"
    >
    </div>
    <div class="campo">
    <input 
      v-model="contraseña" 
      type="password" 
      placeholder="Contraseña" 
      required
      class="input"
    >
    
    </div>
    <button type="submit" :disabled="loading">
      {{ loading ? 'Cargando...' : 'Ingresar' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="sign">
        <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
      </div>
      <div class="olvido">
        <p><a href="/recuperar-contra">¿Olvidaste tu contraseña?</a></p>
      </div>

  </form>
    
  </div> 
</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      usuario: '',
      contraseña: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      this.error = '';

      try {
        const response = await axios.post(
          'http://localhost:3000/api/login',
          {
            usuario: this.usuario,
            contraseña: this.contraseña,
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.data.token) {
          throw new Error('No se recibió token del servidor');
        }

        // Guardar token y datos de usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirigir a la página principal después de login
        this.$router.push('/huella');
        
      } catch (err) {
        console.error('Error en login:', err);
        this.error = err.response?.data?.error || 
                    err.message || 
                    'Error al iniciar sesión';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>


<style scoped>

.login-page {
  position: fixed;
  min-height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("@/assets/img/fondoS.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  background: #fff;
  background: rgba(255, 255, 255, 0.35); /* Blanco translúcido */
  backdrop-filter: blur(8px);             /* Efecto blur */
  padding: 35px 30px 25px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  width: 100%;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family:  'Poppins', sans-serif;
}
h1 {
  text-align: center;
  margin-bottom: 18px;
  color: #333;
}

.campo {
  margin-bottom: 18px;
  
}



.input {
   width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
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

.olvido {
  text-align: center;
  margin-top: 20px;
  
}
.olvido a {
  color: white;
  text-decoration: none;
}

.sign  {
    text-align: center;
  
}
.sign a {
  color: white;
  text-decoration: none;
}
</style>