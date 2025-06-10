<template>
  <navComponente />

  <div class="contenido-inicio">
    
    <div class="imagen-inicio">
      <img src="@/assets/Banner-1.png" alt="Imagen de inicio" />
    </div>

    <h1>SalvAmbiente: Aprende. Juega. Cuida</h1>
    <p>Descubre cómo puedes ayudar al planeta desde tu pantalla. </p>
    <p>Participa en actividades interactivas y conviértete en parte del cambio.</p>
    <!-- Cards -->
    <div class="cards">
      <ViewCard title="Hábitos" link="/" icon="habitos.png" />
      <ViewCard title="Eventos" link="/" icon="Eventos.png" />
      <ViewCard title="Calcula tu huella" link="/" icon="Huella.png" />
      <ViewCard title="Noticias" link="/" icon="Noticias.png" />
      <ViewCard title="Artículos" link="/" icon="Articulo.png" />
      <ViewCard title="Entretenimiento" link="/" icon="Entretenimiento.png" />
    </div>
    <footer class="footer">
        SalvAmbiente &copy; {{ new Date().getFullYear() }}
      </footer>
  </div>
</template>

<script>
import navComponente from '@/components/NavComponente.vue';
import ViewCard from '@/components/viewCardComponent.vue';

export default {
  components: {
    navComponente,
    ViewCard
  }
}
</script>

<style scoped>
.contenido-inicio {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imagen-inicio {
  width: 100vw;
  height:85vh;
  top:0;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: -1;


}
.imagen-inicio img {
  width: 100%;
  height: 100%;
  object-fit: cover;
 
}
.cards {
  display: grid;
  grid-template-columns: repeat(3, 300px);
  gap: 32px;
  margin-top: 32px;
  width: 100%;
  justify-content: center;
}
.footer {
  margin-top: 48px;
  padding: 16px 0;
  font-family:  'Poppins', sans-serif;
  border-radius: 0 0 12px 12px;
  color: #222;
  font-weight: 600;
}
p {
  font-family: 'Arial', sans-serif;
  font-size: 18px;
  font-weight: 655;
}
h1 {
  font-family: 'Arial', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: #8BC34A;
  text-align: center;
  margin-bottom: 16px;
}
</style>