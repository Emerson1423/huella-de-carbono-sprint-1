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
            <router-link to="/noticias" class="nav-link" @click="closeMenu">Noticias</router-link>
          </li>
          
          <li class="nav-item dropdown" @click.stop="toggleDropdown('recursos')">
            <a href="#" class="nav-link" @click.prevent>
              Recursos
            </a>
            <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'recursos' }">
              <li class="dropdown-item">
                <router-link to="/articulos" class="dropdown-link" @click="closeAll">Artículos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/curiosidades" class="dropdown-link" @click="closeAll">Datos Curiosos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/videos" class="dropdown-link" @click="closeAll">Videos</router-link>
              </li>
            </ul>
          </li>
          
          <li class="nav-item dropdown" @click.stop="toggleDropdown('actua')">
            <a href="#" class="nav-link" @click.prevent>
              Actúa
            </a>
            <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'actua' }">
              <li class="dropdown-item">
                <router-link to="/huella" class="dropdown-link" @click="closeAll">Calcular Co2</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/habitos" class="dropdown-link" @click="closeAll">Hábitos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/" class="dropdown-link" @click="closeAll">Eventos</router-link>
              </li>
              <li class="dropdown-item">
                <router-link to="/" class="dropdown-link" @click="closeAll">Entretenimiento</router-link>
              </li>
            </ul>
          </li>

          <!-- Mostrar solo cuando NO está autenticado -->
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <router-link to="/registro" class="nav-link" @click="closeMenu">Registro</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/login" class="nav-link" @click="closeMenu">Iniciar Sesión</router-link>
            </li>
          </template>

          <!-- Mostrar solo cuando SÍ está autenticado -->
          <template v-if="isAuthenticated">
            <li class="nav-item dropdown" @click.stop="toggleDropdown('usuario')">
              <a href="#" class="nav-link user-name" @click.prevent>
                <i class="fas fa-user"></i> {{ userName }}
              </a>
              <ul class="dropdown-menu" :class="{ 'active': activeDropdown === 'usuario' }">
                <li class="dropdown-item">
                  <router-link to="/historial" class="dropdown-link" @click="closeAll">
                    <i class="fas fa-history"></i> Historial
                  </router-link>
                </li>
                <li class="dropdown-item">
                  <a href="#" class="dropdown-link logout-link" @click.prevent="showLogoutModal = true; closeAll()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </nav>
    </div>

    <!-- Modal de confirmación de logout -->
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal-content" @click.stop>
        <h3>Confirmar Cierre de Sesión</h3>
        <p>¿Estás seguro de que deseas salir de tu cuenta?</p>
        <div class="modal-actions">
          <button @click="logout" class="btn-confirm">Sí, Cerrar Sesión</button>
          <button @click="showLogoutModal = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'NavComponente',
  data() {
    return {
      isMenuOpen: false,
      activeDropdown: null,
      showLogoutModal: false,
      isAuthenticated: false,
      userName: ''
    }
  },
  
  mounted() {
    this.checkAuthStatus();
    
    // Escuchar cambios en el localStorage
    window.addEventListener('storage', this.checkAuthStatus);
    // Escuchar evento personalizado para cuando se haga login
    window.addEventListener('userLoggedIn', this.checkAuthStatus);
  },
  
  beforeUnmount() {
    window.removeEventListener('storage', this.checkAuthStatus);
    window.removeEventListener('userLoggedIn', this.checkAuthStatus);
  },
  
  methods: {
    checkAuthStatus() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          this.isAuthenticated = true;
          this.userName = userData.usuario || userData.correo || 'Usuario';
        } catch (error) {
          console.error('Error parsing user data:', error);
          this.forceLogout();
        }
      } else {
        this.isAuthenticated = false;
        this.userName = '';
      }
    },
    
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    
    toggleDropdown(dropdownName) {
      this.activeDropdown = this.activeDropdown === dropdownName ? null : dropdownName;
    },
    
    closeAll() {
      this.isMenuOpen = false;
      this.activeDropdown = null;
    },
    
    closeMenu() {
      this.isMenuOpen = false;
    },

    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.forceLogout();
          return;
        }

        const response = await fetch('http://localhost:3000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al cerrar sesión');
        
        this.forceLogout();
      } catch (error) {
        console.error('Error en logout:', error.message);
        this.$toast?.error(error.message || 'Error al cerrar sesión');
      } finally {
        this.showLogoutModal = false;
      }
    },

    forceLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.checkAuthStatus(); // Actualizar estado
      this.$router.push('/').catch(() => {});
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
  padding: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
}

.logo-img {
  height: 75px;
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
  gap: 8px;
}

.nav-link:hover {
  color: #42b983;
}

.router-link-active {
  color: #42b983;
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.25rem;
}

/* Estilos especiales para el usuario autenticado */
.user-name {
  background-color: rgba(66, 185, 131, 0.1) !important;
  color: #42b983 !important;
  font-weight: bold;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(117, 117, 117, 0.1);
  background-color: white;
  transition: all 0.3s ease;
}

.user-name:hover {
  background-color: rgba(66, 185, 131, 0.15) !important;
  border-color: #42b983;
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

/* Estilos para el dropdown */
.dropdown {
  position: relative;
}

.nav-item.dropdown .nav-link {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(117, 117, 117, 0.1);
  background-color: white;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 180px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  margin-top: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
  border: 1px solid #f0f0f0;
  list-style: none;
}

.dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  padding: 0;
}

.dropdown-link {
  display: block;
  padding: 10px 16px;
  color: #333;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.dropdown-link:hover {
  background-color: #f8f8f8;
  color: #42b983;
}

.logout-link {
  color: #dc3545 !important;
}

.logout-link:hover {
  background-color: rgba(220, 53, 69, 0.1) !important;
  color: #dc3545 !important;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.5rem;
}

.modal-content p {
  margin: 0 0 1.5rem 0;
  color: #666;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm {
  background-color: #dc3545;
  color: white;
}

.btn-confirm:hover {
  background-color: #c82333;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

/* Responsive */
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

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: rgba(0, 0, 0, 0.05);
    margin-left: 1rem;
  }

  .modal-content {
    margin: 1rem;
  }

  .modal-actions {
    flex-direction: column;
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
