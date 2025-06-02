import { createRouter, createWebHistory } from 'vue-router';
import Huella from '../views/Huella.vue';      // Ruta del formulario


const routes = [
  {
    path: '/',
    name: 'Huella',
    component: Huella,
    meta: { requiresAuth: false } // Explícitamente público
  },
  {
    path: '/resultados',
    name: 'resultados',
    component: () => import('@/components/resultadosComponente.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'historial',
    component: () => import('@/components/historialComponente.vue'),
    meta: { requiresAuth: true } // Añadido para proteger historial
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/loginComponente.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('@/components/registroComponente.vue'),
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;