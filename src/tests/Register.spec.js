import { mount } from '@vue/test-utils'
import Register from '@/views/RegisterView.vue'
import AuthForm from '@/components/Auth/AuthForm.vue'
import AuthInput from '@/components/Auth/AuthInput.vue'
import { register } from '@/services/authService'
import { nextTick } from 'vue'

// Mock del servicio de autenticación
vi.mock('@/services/authService', () => ({
  register: vi.fn()
}))

describe('Register.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Register, {
      global: {
        stubs: {
          'router-link': true
        }
      }
    })
  })

  // 1. Prueba de renderizado básico
  it('renderiza correctamente el formulario de registro', () => {
    expect(wrapper.find('.auth-title').text()).toBe('Registrarse')
    expect(wrapper.find('.auth-subtitle').text()).toBe('Crea una cuenta')
    expect(wrapper.findComponent(AuthForm).exists()).toBe(true)
    expect(wrapper.findAllComponents(AuthInput).length).toBe(3)
  })

  // 2. Prueba de vinculación de datos
  it('actualiza v-model para email, usuario y contraseña', async () => {
    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#username').setValue('testuser')
    await wrapper.find('#password').setValue('secure123')

    expect(wrapper.find('#email').element.value).toBe('test@example.com')
    expect(wrapper.find('#username').element.value).toBe('testuser')
    expect(wrapper.find('#password').element.value).toBe('secure123')
  })

  // 3. Prueba de registro exitoso
  it('maneja el registro exitoso mostrando mensaje de éxito', async () => {
    register.mockResolvedValue('Registro completado!')

    await wrapper.find('#email').setValue('test@example.com')
    await wrapper.find('#username').setValue('testuser')
    await wrapper.find('#password').setValue('secure123')
    await wrapper.findComponent(AuthForm).vm.$emit('submit')

    await nextTick()

    expect(register).toHaveBeenCalledWith(
      'test@example.com',
      'testuser',
      'secure123'
    )
    expect(wrapper.find('.auth-error').exists()).toBe(false)
    expect(wrapper.find('.auth-success').text()).toBe('Registro completado!')
  })

  // 4. Prueba de error en registro
  it('muestra error cuando el registro falla', async () => {
    register.mockRejectedValue(new Error('El email ya está registrado'))

    await wrapper.findComponent(AuthForm).vm.$emit('submit')
    await nextTick()

    expect(register).toHaveBeenCalled()
    expect(wrapper.find('.auth-error').text()).toBe('El email ya está registrado')
    expect(wrapper.find('.auth-success').exists()).toBe(false)
  })

  // 5. Prueba de enlace a login
  it('muestra el enlace para iniciar sesión', () => {
    const loginLink = wrapper.find('.auth-link router-link-stub')
    expect(loginLink.attributes('to')).toBe('/')
  })
})