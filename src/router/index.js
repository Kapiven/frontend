import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CalendarView from '@/views/CalendarView.vue'
import PatientPageView from '@/views/PatientPageView.vue'
const routes = [
  {
    path: '/',
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
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
  },
  {
    path: '/patient',
    name: 'patient',
    component: PatientPageView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
