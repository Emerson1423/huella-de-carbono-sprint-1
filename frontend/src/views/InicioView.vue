<template>
  <navComponente />

  <div class="contenido-inicio">


  <div class="slideshow-container"> 
       <div class="slide fade">
      <img src="@/assets/img/f3.png" alt="Imagen 3">
    </div>
      <div class="slide fade">
      <img src="@/assets/img/f2.png" alt="Imagen 0">
    </div>  
    <div class="slide fade">
      <img src="@/assets/img/imgSlide2.jpg" alt="Imagen 4">
    </div>
    <div class="slide fade">
      <img src="@/assets/img/imgSlide3.jpeg" alt="Imagen 5">
    </div>
        <div class="slide fade">
      <img src="https://img.itch.zone/aW1hZ2UvMjMyNTE5NC8xMzc3Mjg5NS5wbmc=/original/thWm3L.png" alt="Imagen 6">
    </div>
  </div>
  <br>
  <div class="content">
     <h1> ¿Qué encontrarás?</h1>
  </div>
  



  
    <!-- Cards -->
    <div class="cards">
      <ViewCard title="Noticias" link="/" icon="Noticias.png" />      
      <ViewCard title="Calcula tu huella" link="/" icon="Huella.png" />      
      <ViewCard title="Recursos Ambientales" link="/" icon="Articulo.png" />
      <ViewCard title="Hábitos" link="/habitos" icon="habitos.png" />
      <ViewCard title="Eventos" link="/" icon="Eventos.png" />
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
  position: relative;
}
.slideshow-container {
  position: relative;
  width: 100vw;
  left: 0;
  right: 0;
  margin-left: -50vw;
  margin-right: -50vw;
  height: 620px; /* Altura ajustable */


}

/* Estilos para cada slide */
.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

/* Animación del slideshow */
.slide:nth-child(1) { animation: fade 24s infinite; }
.slide:nth-child(2) { animation: fade 24s infinite 6s; }
.slide:nth-child(3) { animation: fade 24s infinite 12s; }
.slide:nth-child(4) { animation: fade 24s infinite 18s; }
/* Keyframes para el efecto fade */
@keyframes fade {
  0% { opacity: 0; }
  10% { opacity: 1; }    /* Fade in más rápido */
  25% { opacity: 1; }
  35% { opacity: 0; }    /* Fade out más rápido */
  100% { opacity: 0; }
}
.content {
  display: block;

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
  margin-top: auto; /* Empuja el footer hacia abajo */
  text-align: center;
  padding: 20px 0;
  background: #ffffff;
  color: #131313;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

h1{
    font-family: 'Poppins', sans-serif;
    font-size: 64px;
    color: #6fa54e

}

</style>