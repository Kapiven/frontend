import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CalendarView from '@/views/CalendarView.vue'
import PatientPageView from '@/views/PatientPageView.vue'
import RegisterPageView from '@/views/RegisterPageView.vue'
import { useAuthStore } from '@/stores/auth'
import AdminView from '@/views/AdminView.vue'


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
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
  },
  {
    path: '/patient/:patientId',
    name: 'patient',
    component: PatientPageView,
    props: true,
  },

  {
    path: '/register-page',
    name: 'register-page',
    component: RegisterPageView,
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,

  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
