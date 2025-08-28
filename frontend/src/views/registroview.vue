<template>
    <header>
        <NavComponente/>
    </header>
        <registroComponente/>
</template>

<script>

import RegistroComponente from '../components/registroComponente.vue';
import NavComponente from '../components/NavComponente.vue';
export default {
    
    components: {
        RegistroComponente, // Registra el componente aquí
        NavComponente
    },
}
</script>