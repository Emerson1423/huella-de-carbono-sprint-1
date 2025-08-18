<template>
  <div class="contenedor-tarjetas">
    <h1 class="titulo-principal">Artículos Ambientales</h1>
    
    <article 
      v-for="(tarjeta, index) in tarjetas" 
      :key="index" 
      class="tarjeta">

      <div class="contenido-tarjeta">
        <h2 class="titulo-tarjeta">{{ tarjeta.titulo }}</h2>
        <p class="texto-tarjeta">{{ tarjeta.texto }}</p>
        <a 
          class="enlace-tarjeta" 
          :href="tarjeta.enlace" 
          target="_blank"
          rel="noopener noreferrer">
        
          Ver más...
        </a>
      </div>
      
      <div class="imagen-contenedor">
        <img 
          :src="tarjeta.imagen" 
          :alt="tarjeta.alt || 'Imagen ilustrativa'"
          class="imagen-tarjeta"
          loading="lazy"
        >
      </div>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tarjetas: [
        {
          titulo: "¿Y si un día amanecemos sin árboles?",
          texto: "Los árboles no solo dan sombra. Sin ellos, el planeta colapsa. Esto es lo que ocurriría si de pronto desaparecieran todos.",
          enlace: "https://www.aztecajalisco.com/programas/que-pasa-si-desaparecen-los-arboles-consecuencias-ambientales-y-humanas",
          imagen: "https://media.istockphoto.com/id/1317323736/es/foto/una-vista-hacia-el-cielo-de-direcci%C3%B3n-de-los-%C3%A1rboles.jpg?s=612x612&w=0&k=20&c=t8tQ5ouh0WlI-QixI5l0V_LgGZE9TTZx5K5y8V1-S9c=",
        
        },
        {
          titulo: "En qué consiste la restauración de ecosistemas: experiencias inspiradoras de Latinoamérica",
          texto: "La región destaca por su rica biodiversidad, pero diversos eventos contribuyen a su degradación.",
          enlace: "https://www.nationalgeographicla.com/medio-ambiente/2023/02/en-que-consiste-la-restauracion-de-ecosistemas-experiencias-inspiradoras-de-latinoamerica",
          imagen: "https://www.nature.org/content/dam/tnc/nature/en/photos/c/e/cerradobrasil.jpg",
          
        },
        {
          titulo: "Los 5 consejos sencillos que puedes seguir para vivir de forma más sostenible",
          texto: "Muchas de estas sugerencias son fáciles y la mayoría te ayudarán a poner los pies en la hierba y las manos en la tierra.",
          enlace: "https://www.nationalgeographicla.com/medio-ambiente/2024/02/los-5-consejos-sencillos-que-puedes-seguir-para-vivir-de-forma-mas-sostenible",
          imagen: "https://static.nationalgeographicla.com/files/styles/image_3200/public/h_14.394562153.webp?w=1600&h=900",
          alt: "Vida sostenible"
        }
      ]
    }
  }
}
</script>

<style scoped>
.contenedor-tarjetas {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.titulo-principal {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
}

.tarjeta {
  display: flex;
  background: #EAFAE5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tarjeta:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.contenido-tarjeta {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.imagen-contenedor {
  flex: 1;
  min-height: 40px;
}

.imagen-tarjeta {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.tarjeta:hover .imagen-tarjeta {
  transform: scale(1.03);
}

.titulo-tarjeta {
  color: #009951;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}


.texto-tarjeta {
  color: #34495e;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.enlace-tarjeta {
  display: inline-block;
  background-color:#27ae60 ;
  border-radius: 5px;
  color: #f4f4f4;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
  align-self: flex-start;
  padding: 10px 20px;
}

.enlace-tarjeta:hover {
  background-color: #70d399;

  text-decoration: none;
}


@media (max-width: 768px) {
  .tarjeta {
    flex-direction: column;
  }
  
  .imagen-contenedor {
    order: -1;
    min-height: 200px;
  }
  
  .contenido-tarjeta {
    padding: 1.5rem;
  }
  
  .titulo-tarjeta {
    font-size: 1.3rem;
  }
}
</style>