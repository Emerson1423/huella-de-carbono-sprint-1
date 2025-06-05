<template>
  <div class="register-page"> 
    <div class="caja">
      <form @submit.prevent="handleRegister" class="register-form">
        <h1>Registrarte</h1>
        
        <div class="campo">
          <input v-model="usuario" placeholder="Usuario" required class="input">
        </div>
        
        <div class="campo">
          <input v-model="correo" type="email" placeholder="Correo" required class="input">
        </div>
        
        <div class="campo">
          <input v-model="contraseña" @input="validarContraseña" type="password" placeholder="Contraseña" required class="input">
          <div class="password-strength" v-if="contraseña.length > 0">
            <div class="strength-bar" :class="strengthClass"></div>
            <ul class="requirements">
              <li :class="{ 'valid': hasMinLength }">Mínimo 8 caracteres</li>
              <li :class="{ 'valid': hasUpperCase }">1 letra mayúscula</li>
              <li :class="{ 'valid': hasLowerCase }">1 letra minúscula</li>
              <li :class="{ 'valid': hasNumber }">1 número</li>
              <li :class="{ 'valid': hasSpecialChar }">1 carácter especial</li>
            </ul>
          </div>
        </div>
        
        <div class="campo">
          <input v-model="confirmarContraseña" type="password" placeholder="Confirmar contraseña" required class="input">
          <p v-if="confirmarContraseña && !passwordsMatch" class="error-text">Las contraseñas no coinciden</p>
        </div>
        
        <button type="submit" >Registrarse</button>
        <p v-if="error" class="error">{{ error }}</p>
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
      correo: '',
      contraseña: '',
      confirmarContraseña: '',
      error: '',
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false
    };
  },
  computed: {
    passwordsMatch() {
      return this.contraseña === this.confirmarContraseña;
    },
    strengthClass() {
      const strength = [this.hasMinLength, this.hasUpperCase, this.hasLowerCase, this.hasNumber, this.hasSpecialChar]
        .filter(Boolean).length;
      
      return {
        'weak': strength <= 2,
        'medium': strength === 3 || strength === 4,
        'strong': strength === 5
      };
    },
    formIsValid() {
      return (
        this.usuario &&
        this.correo &&
        this.contraseña &&
        this.confirmarContraseña &&
        this.passwordsMatch &&
        this.hasMinLength &&
        this.hasUpperCase &&
        this.hasLowerCase &&
        this.hasNumber &&
        this.hasSpecialChar
      );
    }
  },
  methods: {
    validarContraseña() {
      this.hasMinLength = this.contraseña.length >= 8;
      this.hasUpperCase = /[A-Z]/.test(this.contraseña);
      this.hasLowerCase = /[a-z]/.test(this.contraseña);
      this.hasNumber = /\d/.test(this.contraseña);
      this.hasSpecialChar = /[\W_]/.test(this.contraseña);
    },
    async handleRegister() {
      if (!this.formIsValid) return;
      
      try {
        const response = await axios.post('http://localhost:3000/api/registro', {
          usuario: this.usuario,
          correo: this.correo,
          contraseña: this.contraseña
        });
        alert(response.data.message);
        this.$router.push({ path: '/login' });
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al registrarse';
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  position: fixed;
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

.register-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Poppins, sans-serif;
}

.caja {
  background-color: #ffff;
  padding: 30px;
  border-radius: 10px;
  margin-top: 50px;
}

h1 {
  text-align: center;
  color: #333;
}

.campo {
  margin: 15px 0;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 10px;
  border-color: #8BC34A;
}

.input:focus {
  border-color: #8BC34A;
  outline: none;
}

.input::placeholder {
  color: #8BC34A;
}

button {
  width: 100%;
  padding: 10px;
  background: #8BC34A;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.error {
  color: #ff4444;
  margin-top: 10px;
  text-align: center;
}

.error-text {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 5px;
}

.password-strength {
  margin-top: 10px;
}

.strength-bar {
  height: 5px;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: width 0.3s, background 0.3s;
}

.strength-bar.weak {
  width: 30%;
  background: #ff4444;
}

.strength-bar.medium {
  width: 60%;
  background: #ffbb33;
}

.strength-bar.strong {
  width: 100%;
  background: #00C851;
}

.requirements {
  list-style: none;
  padding: 0;
  margin: 5px 0 0 0;
  font-size: 0.8rem;
}

.requirements li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 3px;
  color: #777;
}

.requirements li:before {
  content: "✗";
  position: absolute;
  left: 0;
  color: #ff4444;
}

.requirements li.valid:before {
  content: "✓";
  color: #00C851;
}
</style>