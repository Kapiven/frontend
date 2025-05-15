import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import HomeView from '@/views/HomeView.vue'
import CalendarView from '@/views/CalendarView.vue'
import PacienteView from '@/views/PacienteView.vue'
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
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
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path : '/home',
    name : 'home',
    component : HomeView,
  },
  {
    path : '/calendar',
    name : 'calendar',
    component : CalendarView,
  },
  {
    path : '/calendar',
    name : 'calendar',
    component : CalendarView,
  },
  {
    path : '/paciente',
    name : 'paciente',
    component : PacienteView,
  },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
