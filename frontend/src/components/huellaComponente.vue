<template>

   <h1 class="calculoT">Calcular tu huella ecológica</h1>
  <div class="carbon-footprint-form">
  
    <!-- Kilómetros recorridos -->
    <div class="form-group">
      <label>¿Cuántos kilómetros recorres aproximada mente al mes?</label>
      <input 
        type="range" 
        min="0" 
        max="1000" 
        step="10" 
        v-model="kilometros" 
        class="slider"
        @change="clearError('kilometros')"
      >
      <span>{{ kilometros }} km</span>
      <span class="error-message">{{ errors.kilometros }}</span>
    </div>

    <!-- Medio de transporte -->
    <div class="form-group">
      <label>¿Principal medio de transporte?</label>
      <select 
        v-model="transporte" 
        :class="{ 'error-border': errors.transporte }"
        @change="clearError('transporte')"
      >
        <option value="">-- Selecciona --</option>
        <option value="coche">Coche</option>
        <option value="moto">Moto</option>
        <option value="autobus">Autobús</option>
        <option value="bicicleta">Bicicleta</option>
        <option value="a pie">A pie</option>
      </select>
      <span class="error-message">{{ errors.transporte }}</span>
    </div>

    <!-- Electricidad -->
    <div class="form-group">
      <label>¿De acuerdo a tu recibo de luz en qué rango te encuentras en tu hogar?</label>
      <select 
        v-model="electricidad" 
        :class="{ 'error-border': errors.electricidad }"
        @change="clearError('electricidad')"
      >
        <option value="">-- Selecciona --</option>
        <option value="30-50">$30-$50</option>
        <option value="55-100">$55-$100</option>
        <option value="100+">+$100</option>
      </select>
      <span class="error-message">{{ errors.electricidad }}</span>
    </div>

    <!-- Energía renovable -->
    <div class="form-group">
      <label>¿Usas energía renovable?</label>
      <div :class="{ 'error-border-group': errors.energiaRenovable }">
        <input 
          type="radio" 
          id="renovablesi" 
          value="si" 
          v-model="energiaRenovable"
          @change="clearError('energiaRenovable')"
        >
        <label for="renovablesi">Sí</label>
        <input 
          type="radio" 
          id="renovableno" 
          value="no" 
          v-model="energiaRenovable"
          @change="clearError('energiaRenovable')"
        >
        <label for="renovableno">No</label>
      </div>
      <span class="error-message">{{ errors.energiaRenovable }}</span>
    </div>

    <div class="form-group">
    <label>¿Qué reciclas? (Selecciona los iconos)</label>
    <div class="opciones-reciclaje">
        <div 
        v-for="item in reciclajeItems"
        :key="item.id"
        @click="toggleRecycleItem(item.id)"
        :class="{ 'item-reciclaje': true, 'active': selectedRecycleItems.includes(item.id) }"
        :title="item.name"
        >
        <img :src="item.icon" :alt="item.name">
        <span>{{ item.name }}</span>
        </div>
    </div>
    </div>

    <div v-if="errors.reciclaje" class="error-message">
      {{ errors.reciclaje }}
    </div>

    
  </div>
  
  <button @click="calcularHuella" class="calcular-btn">Calcular</button>

  
</template>

<script>
export default {
  data() {
    return {
      kilometros: 0,
      transporte: '',
      electricidad: '',
      energiaRenovable: '',
      reciclajeItems: [
        { id: 'no_reciclo', name: 'No reciclo', icon:require('@/assets/icons/bloqueo.png'),},
        { id: 'papel', name: 'Papel', icon: require('@/assets/icons/papel.png') },
        { id: 'plastico', name: 'Plástico', icon: require('@/assets/icons/plastico.png') },
        { id: 'vidrio', name: 'Vidrio', icon: require('@/assets/icons/vidrio.png') },
        { id: 'carton', name: 'Cartón', icon: require('@/assets/icons/carton.png') }
      ],
       selectedRecycleItems: [],
      errors: {
        kilometros: '',
        transporte: '',
        electricidad: '',
        energiaRenovable: '',
         reciclaje: '',
      }
    }
  },
  methods: {
    toggleRecycleItem(itemId) {
      if (itemId === 'no_reciclo') {
        // Si selecciona "No reciclo", limpia otras selecciones
        this.selectedRecycleItems = ['no_reciclo'];
      } else {
        // Si selecciona otro item:
        // 1. Quita "No reciclo" si estaba
        const noRecicloIndex = this.selectedRecycleItems.indexOf('no_reciclo');
        if (noRecicloIndex !== -1) {
          this.selectedRecycleItems.splice(noRecicloIndex, 1);
        }
        
        // 2. Alterna el item seleccionado
        const itemIndex = this.selectedRecycleItems.indexOf(itemId);
        if (itemIndex === -1) {
          this.selectedRecycleItems.push(itemId);
        } else {
          this.selectedRecycleItems.splice(itemIndex, 1);
        }

        if (this.selectedRecycleItems.length > 0) {
              this.errors.reciclaje = '';
        }
        
      }
    },

    clearError(field) {
      this.errors[field] = '';
    },
    
    validarFormulario() {
      let valido = true;
      this.errors = {
        kilometros: '',
        transporte: '',
        electricidad: '',
        energiaRenovable: '',
      };

      if (this.kilometros <= 0) {
        this.errors.kilometros = '⚠️ Los kilómetros deben tener un valor mayor a 0';
        valido = false;
      }
      
      if (!this.transporte) {
        this.errors.transporte = '⚠️ Selecciona un medio de transporte';
        valido = false;
      }
      
      if (!this.electricidad) {
        this.errors.electricidad = '⚠️ Selecciona un rango de consumo';
        valido = false;
      }
      
      if (!this.energiaRenovable) {
        this.errors.energiaRenovable = '⚠️ Indica si usas energía renovable';
        valido = false;
      }


      if (this.selectedRecycleItems.length === 0) {
        this.errors.reciclaje = '⚠️ Selecciona al menos una opción de reciclaje';
        valido = false;
      }
      
      return valido;
    },

    calcularHuella() {
      if (!this.validarFormulario()) {
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const resultado = this.calcularHuellaLocalmente();
      
      this.$router.push({
        path: '/resultados',
        query: {
          resultado: encodeURIComponent(JSON.stringify(resultado)),
          datosOriginales: encodeURIComponent(JSON.stringify(this.getDatosFormulario()))
        }
      });
    },

    calcularHuellaLocalmente() {
      const factoresTransporte = {
        coche: 0.2,
        moto: 0.15,
        autobus: 0.08,
        bicicleta: 0.005,
        'a pie': 0
      };

      const factoresElectricidad = {
        '30-50': 40,
        '55-100': 80,
        '100+': 120
      };

      const emisionesTransporte = this.kilometros * (factoresTransporte[this.transporte] || 0);
      const emisionesElectricidad = factoresElectricidad[this.electricidad] || 0;

      let puntuacionTotal = emisionesTransporte + emisionesElectricidad;
      
      if (this.energiaRenovable === 'si') {
        puntuacionTotal *= 0.5;
      }

      // Solo aplica descuento si hay items seleccionados que no sean "no_reciclo"
      const itemsReciclaje = this.selectedRecycleItems.filter(item => item !== 'no_reciclo');
      const descuentoReciclaje = itemsReciclaje.length * 0.02;
      puntuacionTotal *= (1 - descuentoReciclaje);

      return {
        puntuacionTotal: Math.round(puntuacionTotal),
        categoria: this.getCategoriaHuella(puntuacionTotal),
        emisionesDetalle: {
          transporte: emisionesTransporte,
          electricidad: emisionesElectricidad,
          descuentoRenovable: this.energiaRenovable === 'si' ? 50 : 0,
          descuentoReciclaje: descuentoReciclaje * 100
        },
        fecha: new Date().toISOString()
      };
    },

      getDatosFormulario() {
      return {
        kilometros: this.kilometros,
        transporte: this.transporte,
        electricidad: this.electricidad,
        energiaRenovable: this.energiaRenovable,
        // Asegurando que siempre sea un array
        reciclaje: Array.isArray(this.selectedRecycleItems) ? this.selectedRecycleItems : []
      };

    },

    getCategoriaHuella(puntuacion) {
      if (puntuacion < 50) return "Baja";
      else if (puntuacion < 100) return "Media";
      else return "Alta";
    }
  }
}
</script>

<style scoped>

.error-message {
  color: #ff4444;
  font-size: 0.9em;
  display: block;
  margin-top: 5px;
}

.error-border {
  border: 1px solid #ff4444 !important;
}

.error-border-group {
  border: 1px solid #ff4444;
  padding: 10px;
  border-radius: 4px;
}
.calculoT{
  text-align: center;
  margin-bottom: 30px;
  color: #222;
  font-family: 'Poppins', sans-serif;

}
.carbon-footprint-form {
  background-color: #8bc34a36;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family:'Poppins', sans-serif; 
  border-radius: 4%;
}

.form-group {
  margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
    text-align: center;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.slider {
  width: 100%;
  margin: 10px 0;


}

select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #80D09B;
}

input[type="radio"] {
  margin-right: 5px;
}

.opciones-reciclaje {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 10px;
}

.item-reciclaje {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid #e0e0e0;
}

.item-reciclaje:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-reciclaje.active {
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.item-reciclaje img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-bottom: 5px;
}

.item-reciclaje span {
  font-size: 14px;
  text-align: center;
}

.calcular-btn {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px auto; 
  width: 200px;
  text-align: center;
  transition: background-color 0.3s;
  display: block; 
}

.calcular-btn:hover {
  background-color: #45a049;
}

.results-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.footprint-value {
  font-size: 2em;
  font-weight: bold;
  color: #4CAF50;
  margin: 10px 0;
  text-align: center;
}

.results-section h3 {
  margin-top: 20px;
  color: #333;
}

.results-section ul {
  list-style-type: none;
  padding: 0;
}

.results-section li {
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
}
</style>
