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
        <li class="nav-item dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <a href="#" class="nav-link">Recursos <span class="dropdown-arrow">▼</span></a>
          <ul class="dropdown-menu" :class="{ 'show': showDropdown }">
            <li><router-link to="/articulos" class="dropdown-item" @click="closeMenu">Artículos</router-link></li>
            <li><router-link to="/videos" class="dropdown-item" @click="closeMenu">Videos</router-link></li>
            <li><router-link to="/datos-curiosos" class="dropdown-item" @click="closeMenu">Datos Curiosos</router-link></li>
          </ul>
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
      isMenuOpen: false,
      showDropdown: false
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
      // Cerrar dropdown cuando se abre el menú móvil
      if (this.isMenuOpen) {
        this.showDropdown = false
      }
    },
    closeMenu() {
      this.isMenuOpen = false
      this.showDropdown = false
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
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
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.25rem;
}

/* Dropdown styles */
.dropdown {
  position: relative;
}

.dropdown-arrow {
  font-size: 0.6rem;
  margin-left: 5px;
  transition: transform 0.3s;
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  border-radius: 4px;
  padding: 10px 0;
  list-style: none;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
}

.dropdown-item {
  display: block;
  padding: 8px 20px;
  color: #333;
  text-decoration: none;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
  color: #42b983;
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
    max-height: 500px;
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

  /* Dropdown mobile styles */
  .dropdown {
    width: 100%;
    text-align: center;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    box-shadow: none;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    padding: 0;
  }

  .dropdown-menu.show {
    max-height: 300px;
    opacity: 1;
    padding: 10px 0;
  }

  .dropdown-item {
    padding: 8px 0;
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