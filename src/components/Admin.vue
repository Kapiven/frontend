<template>
  <div class="admin-wrapper">
    <AppNavigation />
    
    <div class="admin-container">
      <div class="admin-content">
        <AdminHeader @create-role="openCreateModal" />
        <AdminFilters
          v-model:search="searchQuery"
          v-model:role="selectedRole"
          :role-options="roleOptions"
        />
        <AdminTable
          :users="filteredUsers"
          @edit-user="editUser"
          @delete-user="deleteUser"
        />
      </div>
    </div>
    
    <AdminModal
      v-if="showModal"
      :is-editing="isEditing"
      :form="form"
      :role-options="roleOptions"
      @close="closeModal"
      @save="saveUser"
      @update-form="updateForm"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppNavigation from './AppNavigation.vue'
import AdminHeader from './Admin/AdminHeader.vue'
import AdminFilters from './Admin/AdminFilters.vue'
import AdminTable from './Admin/AdminTable.vue'
import AdminModal from './Admin/AdminModal.vue'

const users = ref([
  { id: 1, name: 'Ana Martínez', role: 'Administrador' },
  { id: 2, name: 'Luis Torres', role: 'Editor' },
  { id: 3, name: 'Carlos Pérez', role: 'Visualizador' },
  { id: 4, name: 'José Perez', role: 'Administrador' },
  { id: 5, name: 'Sofía Hernandez', role: 'Administrador' },
])

const roleOptions = ['Administrador', 'Editor', 'Visualizador']
const searchQuery = ref('')
const selectedRole = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({ id: null, name: '', role: '' })

const filteredUsers = computed(() =>
  users.value.filter(user =>
    (user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
     user.role.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
    (selectedRole.value === '' || user.role === selectedRole.value)
  )
)

const openCreateModal = () => {
  form.value = { id: null, name: '', role: '' }
  isEditing.value = false
  showModal.value = true
}

const editUser = (user) => {
  form.value = { ...user }
  isEditing.value = true
  showModal.value = true
}

const deleteUser = (id) => {
  users.value = users.value.filter(u => u.id !== id)
}

const saveUser = () => {
  if (isEditing.value) {
    const index = users.value.findIndex(u => u.id === form.value.id)
    if (index !== -1) users.value[index] = { ...form.value }
  } else {
    users.value.push({ ...form.value, id: Date.now() })
  }
  showModal.value = false
}

const closeModal = () => {
  showModal.value = false
}

const updateForm = (newForm) => {
  form.value = newForm
}
</script>

<style>
@import '@/assets/styles/admin.css';
</style>
