import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import Menu from '@/components/Menu.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/dashboard',
    mame: 'dashboard',
    component: DashboardView,
  },
{
  path: '/menu',
    name: 'menu',
    component: Menu,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
