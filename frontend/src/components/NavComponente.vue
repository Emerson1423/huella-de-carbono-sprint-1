<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <img src="@/assets/img/logo.png" alt="Logo" class="logo-img" />
      </div>
    
    <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
    
    <nav class="navigation" :class="{ 'active': isMenuOpen }">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/" class="nav-link" @click="closeMenu">Inicio</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/registro" class="nav-link" @click="closeMenu">Registro</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" @click="closeMenu">Iniciar Sesión</router-link>
        </li>
        
      </ul>
    </nav>
  </div>
  </header>

</template>
<script>
export default {
  name: 'NavComponente',
  data() {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    closeMenu() {
      this.isMenuOpen = false
    }
  }
}
</script>

<style scoped>

body {
  margin: 0;
  padding: 0;
  font-family: 'Poppins', sans-serif;
  background-color: rgb(255, 255, 255);

}

.header {

    width: 100%;
    background-color: #ffffff;
    font-family: 'Poppins', sans-serif;
    padding: 15px 0;
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 1000;

}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
}

.logo-img {
  height: 85px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: scale(1.05);
}
.navigation {
  display: flex;
  justify-content: center;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 4rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.3s ease;
  font-weight: bold;
  padding: 0.5rem 0;
}

.nav-link:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.25rem;
}

/* Menú hamburguesa (oculto en desktop) */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
}

.bar {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 5px 0;
  transition: all 0.3s ease;
}


@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    padding: 1rem;
  }

  .menu-toggle {
    display: block;
    order: 2;
  }

  .navigation {
    width: 100%;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    order: 3;
  }

  .navigation.active {
    max-height: 300px;
    padding-top: 1rem;
  }

  .nav-list {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  .nav-link {
    font-size: 1.2rem;
  }
}

/* Efecto activo para el botón hamburguesa */
.menu-toggle.active .bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.active .bar:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active .bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
</style>

