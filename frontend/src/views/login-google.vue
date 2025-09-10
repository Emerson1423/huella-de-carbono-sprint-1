<template>
  <div class="loading">
    <p>inicia sesion con Google...</p>
  </div>
</template>

<script>
export default {
  name: "LoginGoogle",
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        // Decodificar el token para extraer datos del usuario
        const payload = JSON.parse(atob(token.split(".")[1]));

        // Guardar en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({
          id: payload.id,
          usuario: payload.usuario,
          correo: payload.correo
        }));

        // Emitir evento para que tu NavBar se actualice
        window.dispatchEvent(new Event("userLoggedIn"));

        // Redirigir al inicio
        this.$router.push("/");
      } catch (error) {
        console.error("Error procesando token:", error);
        this.$router.push("/login");
      }
    } else {
      this.$router.push("/login");
    }
  }
};
</script>
