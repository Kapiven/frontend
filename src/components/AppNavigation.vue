<template>
  <nav class="app-nav">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/dashboard" class="brand-link">
          <img src="@/assets/logo.jpg" alt="Logo" class="nav-logo" />
          <span class="brand-text">Optyma</span>
        </router-link>
      </div>

      <!-- Patient Search Bar -->
      <div class="nav-search" v-if="showSearchBar">
        <SearchBar
          :fetchDaySummary="handleFetchDaySummary"
          :patientRedirect="handlePatientRedirect"
        />
      </div>

      <div class="nav-links">
        <router-link
          to="/dashboard"
          class="nav-link"
          :class="{ active: $route.name === 'dashboard' }"
        >
          Dashboard
        </router-link>

        <router-link
          to="/calendar"
          class="nav-link"
          :class="{ active: $route.name === 'calendar' }"
        >
          Calendario
        </router-link>

        <router-link
          to="/questionnaires"
          class="nav-link"
          :class="{ active: $route.name === 'questionnaires' }"
        >
          Formularios
        </router-link>
      </div>

      <div class="nav-actions">
        <span class="user-info" v-if="authStore.user">
          👤 {{ authStore.user.username || 'Usuario' }}
        </span>
        <button @click="handleLogout" class="logout-btn">Salir</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SearchBar from '@/components/Dashboard/SearchBar.vue'

const props = defineProps({
  fetchDaySummary: {
    type: Function,
    default: () => {},
  },
  patientRedirect: {
    type: Function,
    default: () => {},
  },
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Show search bar on all authenticated routes except login and register
const showSearchBar = computed(() => {
  const hiddenRoutes = ['login', 'register']
  return !hiddenRoutes.includes(route.name)
})

// Universal patient redirect function
function handlePatientRedirect(patientId) {
  console.log('🔍 AppNavigation: Redirecting to patient:', patientId)
  // Always use the default universal redirect to patient page
  router.push({ name: 'patient', params: { patientId: String(patientId) } })
}

// Universal fetchDaySummary function
function handleFetchDaySummary() {
  // If parent component provided a fetchDaySummary function, use it
  if (props.fetchDaySummary && typeof props.fetchDaySummary === 'function') {
    props.fetchDaySummary()
  }
  // Otherwise, do nothing (this is fine for non-dashboard pages)
}

function handleLogout() {
  authStore.clearAuth()
  router.push('/')
}
</script>

<style scoped>
.app-nav {
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-search {
  flex: 1;
  max-width: 400px;
  margin: 0 1rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
}

.nav-logo {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.brand-text {
  font-size: 1.2rem;
  color: var(--color-heading);
}

.nav-links {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

.nav-link.active {
  background: hsla(160, 100%, 37%, 0.1);
  color: hsla(160, 100%, 37%, 1);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

/* Search bar styles within navigation */
.nav-search :deep(.search-bar) {
  position: relative;
  width: 100%;
  margin: 0;
}

.nav-search :deep(.search-bar input) {
  width: 100%;
  max-width: none;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.nav-search :deep(.suggestions-list) {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 0 0 6px 6px;
  z-index: 200;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.user-info {
  color: var(--color-text);
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #b91c1c;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-search {
    order: 1;
    max-width: none;
    margin: 0;
  }

  .nav-links {
    order: 2;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .nav-actions {
    order: 3;
  }

  .user-info {
    display: none;
  }
}
</style>
