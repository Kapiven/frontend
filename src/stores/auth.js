// stores/auth.js (if using Pinia) or similar
import { defineStore } from 'pinia'

// Helper function to safely parse JSON from localStorage
function safeParseJSON(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    if (item === null || item === undefined || item === 'undefined' || item === 'null') {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.warn(`Error parsing JSON from localStorage key "${key}":`, error)
    // Clear corrupted data
    localStorage.removeItem(key)
    return defaultValue
  }
}

// Helper function to safely get item from localStorage
function safeGetItem(key) {
  try {
    const item = localStorage.getItem(key)
    if (item === 'undefined' || item === undefined || item === 'null') {
      return null
    }
    return item
  } catch (error) {
    console.warn(`Error getting item from localStorage key "${key}":`, error)
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: safeGetItem('token') || safeGetItem('authToken'), // Check both keys for compatibility
    user: safeParseJSON('user'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth(token, user) {
      this.token = token
      this.user = user
      // Store in both keys for compatibility
      localStorage.setItem('token', token)
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearAuth() {
      this.token = null
      this.user = null
      // Remove both token keys
      localStorage.removeItem('token')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    },

    // Initialize auth state and clean up any corrupted data
    initializeAuth() {
      console.log('🔄 Initializing auth state...')
      
      try {
        // Check for corrupted data first
        this.cleanupCorruptedData()
        
        const token = safeGetItem('token') || safeGetItem('authToken')
        const user = safeParseJSON('user')
        
        console.log('🔍 Retrieved from localStorage:', { token: !!token, user: !!user })
        
        if (token && user) {
          this.token = token
          this.user = user
          // Ensure both keys are set for compatibility
          localStorage.setItem('token', token)
          localStorage.setItem('authToken', token)
          console.log('✅ Auth state initialized successfully')
        } else if (token && !user) {
          // Token exists but no user data - clear everything for safety
          console.warn('⚠️ Token found but no user data, clearing auth state')
          this.clearAuth()
        } else {
          console.log('ℹ️ No auth data found, user needs to login')
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
        this.clearAuth()
      }
    },

    // Clean up any corrupted localStorage data
    cleanupCorruptedData() {
      const items = ['token', 'authToken', 'user']
      let cleaned = false
      
      items.forEach(key => {
        const value = localStorage.getItem(key)
        if (value === 'undefined' || (value === 'null' && key === 'user')) {
          console.warn(`🧹 Removing corrupted localStorage key: ${key} (value: ${value})`)
          localStorage.removeItem(key)
          cleaned = true
        }
      })
      
      if (cleaned) {
        console.log('✨ Corrupted localStorage cleaned up')
      }
    },
  },
})
