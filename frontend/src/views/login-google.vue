<template>
  <div>
    <p>Iniciando sesión con Google...</p>
  </div>
</template>

<script>
export default {
  mounted() {
    // Obtiene el token de la URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Guarda el token en localStorage
      localStorage.setItem('token', token);
      // Redirige a la página principal
      this.$router.push('/');
    } else {
      // Si no hay token, redirige al login
      this.$router.push('/login');
    }
  }
}
</script>