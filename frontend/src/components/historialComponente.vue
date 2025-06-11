<template>

<header>
  <div>
    <button @click="showLogoutModal = true" class="logout-btn">
      <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
    </button>
    <div v-if="showLogoutModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirmar Cierre de Sesión</h3>
        <p>¿Estás seguro de que deseas salir de tu cuenta?</p>
        <div class="modal-actions">
          <button @click="logout" class="btn-confirm">Sí, Cerrar Sesión</button>
          <button @click="showLogoutModal = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

</header>  

  <div class="historial-page">
    <div class="header">
      <h1>📚 Tu Historial Completo</h1>
      <button @click="irACalculadora" class="btn-action">➕ Nueva Calculación</button>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <select v-model="filtroAnio" @change="filtrarRegistros">
        <option value="todos">Todos los años</option>
        <option v-for="anio in aniosDisponibles" :key="anio" :value="anio">{{ anio }}</option>
      </select>
    </div>

    <!-- Lista de registros -->
    <div v-if="cargando" class="cargando">Cargando tu historial...</div>
    
    <div v-else-if="registrosFiltrados.length === 0" class="sin-registros">
      <p>No tienens registros guardados aún.</p>
    </div>

    <div v-else class="lista-registros">
      <div v-for="(registro, index) in registrosFiltrados" :key="index" class="registro-item">
        <div class="registro-header">
          <span class="fecha">{{ formatearFecha(registro.fecha) }}</span>
          <span class="emisiones">
            {{ registro.total_emisiones }} kg CO₂
            <span :class="['nivel', getNivelEmisiones(registro.total_emisiones)]"></span>
          </span>
        </div>
        
        <div class="registro-detalles">

          <p><strong>Transporte principal:</strong> {{ formatoTransporte(registro.transporte) }}</p>
          <p><strong>Kilómetros/mes:</strong> {{ registro.kilometros }} km</p>
          <p><strong>Reciclaje:</strong> {{ formatoReciclaje(registro.reciclaje) }}</p>
          <p><strong>pago de energia mensual:</strong> {{ registro.electricidad}} $</p>
          <p><strong>energia Renovable:</strong> {{ registro.energiaRenovable}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      registros: [],
      registrosFiltrados: [],
      cargando: true,
      filtroAnio: 'todos',
      aniosDisponibles: [],
      showLogoutModal: false
    }
  },
  async created() {
    await this.cargarHistorial();
  },
  methods: {

     async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('No hay token almacenado');
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

        // Verificación más robusta de la respuesta
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Error al cerrar sesión');
        }

        // Limpieza exitosa
        this.forceLogout();
        
      } catch (error) {
        console.error('Error en logout:', error.message);
        // Mostrar mensaje al usuario (asegúrate de tener un sistema de notificaciones)
        this.$toast?.error(error.message || 'Error al cerrar sesión');
      } finally {
        this.showLogoutModal = false;
      }
    },

    forceLogout() {
      // Limpieza completa del estado de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a la página de login
      this.$router.push('/').catch(() => {
       
      });
    },

    async cargarHistorial() {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              this.$router.push('/login');
              return;
            }

            const response = await fetch('http://localhost:3000/api/historial', {
              headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.status === 401) {
              // Token inválido o expirado
              this.forceLogout();
              return;
            }

            if (!response.ok) throw new Error('Error al cargar historial');
            
            this.registros = await response.json();
            this.registrosFiltrados = this.registros;
            this.extraerAniosDisponibles();
          } catch (error) {
            console.error(error);
            this.$toast.error('Error al cargar historial');
          } finally {
            this.cargando = false;
          }
        },
    extraerAniosDisponibles() {
      const anios = new Set();
      this.registros.forEach(reg => {
        anios.add(new Date(reg.fecha).getFullYear());
      });
      this.aniosDisponibles = Array.from(anios).sort((a, b) => b - a);
    },

    filtrarRegistros() {
      if (this.filtroAnio === 'todos') {
        this.registrosFiltrados = this.registros;
        return;
      }
      this.registrosFiltrados = this.registros.filter(reg => {
        return new Date(reg.fecha).getFullYear() == this.filtroAnio;
      });
    },

    formatearFecha(fecha) {
      const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(fecha).toLocaleDateString('es-ES', opciones);
    },

    formatoTransporte(transporte) {
      const formatos = {
        coche: '🚗 Coche',
        moto: '🏍️ Moto',
        autobus: '🚌 Autobús',
        bicicleta: '🚲 Bicicleta',
        "a pie": '🚶 A pie'
      };
      return formatos[transporte] || transporte;
    },

    formatoReciclaje(reciclaje) {
      if (!reciclaje || reciclaje === 'no_reciclo') return '❌ No recicla';
      const materiales = reciclaje.split(',');
      return materiales.map(mat => {
        const iconos = { plastico: '🥤', papel: '📄', vidrio: '🍷', carton: '📦' };
        return `${iconos[mat] || ''} ${mat}`;
      }).join(', ');
    },

    getNivelEmisiones(emisiones) {
      if (emisiones < 50) return 'bajo';
      if (emisiones < 100) return 'medio';
      return 'alto';
    },

    irACalculadora() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 15px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #cc0000;
}

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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 350px;
  max-width: 90%;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-confirm {
  background: #ff4444;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.historial-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.btn-action {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.filtros {
  margin-bottom: 20px;
}

.filtros select {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.lista-registros {
  display: grid;
  gap: 15px;
}

.registro-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.registro-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.emisiones {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nivel {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.nivel.bajo { background: #4CAF50; }
.nivel.medio { background: #FFC107; }
.nivel.alto { background: #F44336; }

.registro-detalles {
  display: grid;
  gap: 5px;
  color: #555;
}

.sin-registros {
  text-align: center;
  padding: 40px;
  color: #777;
}   


</style>