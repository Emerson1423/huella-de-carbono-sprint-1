<template>
    
<NavComponente/>
        
    
<loginComponente/>
</template>

<script>

import LoginComponente from '../components/loginComponente.vue';
import NavComponente from '../components/NavComponente.vue';
export default {
    components: {
        LoginComponente, // Registra el componente aquí
        NavComponente
    },
}
</script>
