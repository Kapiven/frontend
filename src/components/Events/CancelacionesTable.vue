<template>
  <div class="tabla-container">
    <h2 class="titulo rojo">Cancelaciones</h2>
    <table class="tabla">
      <thead>
        <tr>
          <th>ID Paciente</th>
          <th>Nombre</th>
          <th>Fecha Cancelada</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cancelaciones" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.nombre }}</td>
          <td class="negrita">{{ item.fecha }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  cancelaciones: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.tabla-container {
  background: rgb(70, 65, 65);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  padding: 1rem;
}

.titulo {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.rojo {
  color: white;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th {
  background-color: #b91c1c;
  color: white;
  padding: 10px;
  text-align: left;
}

.tabla td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.tabla tr:hover {
  background-color: #5d5d5d;
}

.negrita {
  font-weight: bold;
}
</style>
