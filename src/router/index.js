import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import CalendarView from '@/views/CalendarView.vue'
import PatientPageView from '@/views/PatientPageView.vue'
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
    meta: { requiresAuth: true },
  },
  {
    path: '/patient/:patientId',
    name: 'patient',
    component: PatientPageView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/patients/:patientId/edit',
    name: 'edit-patient',
    component: () => import('@/views/EditPatientView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAuth: true },
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()

    // Re-initialize auth state on each navigation to ensure consistency
    authStore.initializeAuth()

    console.log(`🚀 Navigating to: ${to.path}`, {
      requiresAuth: to.meta.requiresAuth,
      isAuthenticated: authStore.isAuthenticated,
      hasToken: !!authStore.token,
      hasUser: !!authStore.user
    })

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.log('🔒 Route requires auth but user is not authenticated, redirecting to login')
      next('/')
    } else {
      next()
    }
  } catch (error) {
    console.error('❌ Error in router beforeEach:', error)
    // In case of error, redirect to login for safety
    next('/')
  }
})

export default router
