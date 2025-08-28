<template>
<NavComponente/>

<articulosComponente/>
</template>

<script>
import articulosComponente from '@/components/articulosComponente.vue';
import NavComponente from '@/components/NavComponente.vue';

export default{
    components:{
        articulosComponente,
        NavComponente
        
    }
}
</script>