import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Login from '@/views/LoginView.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import { login } from '@/services/authService'
import { nextTick } from 'vue'

// Mock del servicio de autenticación
vi.mock('@/services/authService', () => ({
  login: vi.fn()
}))

// Mock de Vue Router
const mockPush = vi.fn()
const mockRouter = {
  push: mockPush,
  resolve: vi.fn(),
  replace: vi.fn(),
  currentRoute: { value: {} }
}

// Mock de window.location
delete window.location
window.location = { href: '' }

describe('Login.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Login, {
      global: {
        stubs: {
          'router-link': true // Stub para router-link
        },
        mocks: {
          $router: mockRouter
        }
      }
    })
  })

  it('renderiza correctamente', () => {
    expect(wrapper.find('.auth-title').text()).toBe('Iniciar Sesión')
    expect(wrapper.findComponent(AuthForm).exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('actualiza v-model para email y contraseña', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    // Accedemos a los valores a través del elemento input
    expect(emailInput.element.value).toBe('test@example.com')
    expect(passwordInput.element.value).toBe('password123')
  })

  it('maneja el login exitoso', async () => {
    login.mockResolvedValue('fake-token')

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('correct-password')
    await wrapper.findComponent(AuthForm).vm.$emit('submit')

    await nextTick()

    expect(login).toHaveBeenCalledWith('test@example.com', 'correct-password')
    expect(window.location.href).toBe('/dashboard')
    expect(wrapper.find('.auth-error').exists()).toBe(false)
  })

  it('muestra error cuando el login falla', async () => {
    login.mockRejectedValue(new Error('Credenciales inválidas'))

    await wrapper.findComponent(AuthForm).vm.$emit('submit')
    await nextTick()

    expect(login).toHaveBeenCalled()
    expect(wrapper.find('.auth-error').text()).toBe('Credenciales inválidas')
  })

  it('muestra el enlace de registro', () => {
    const registerLink = wrapper.find('.auth-link router-link-stub')
    expect(registerLink.attributes('to')).toBe('/register')
  })
})