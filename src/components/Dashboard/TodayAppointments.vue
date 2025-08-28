<template>
    <div class="section">
        <h2>{{ title }}</h2>
        
        <!-- Search bar -->
        <div class="search-container">
            <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar por nombre de paciente..."
                    class="search-input"
                />
                <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        </div>

        <ul>
            <template v-for="(item, idx) in filteredIntervals" :key="idx">
            <li v-if="item.type === 'free'" class="interval-row free-interval">
                <span class="interval-time">
                {{ formatTime(item.start) }} - {{ formatTime(item.end) }}
                </span>
                <span class="interval-label">Libre</span>
            </li>
            <li v-else class="interval-row appointment-item" @click="emit('patientRedirect', item.appt.id)">
                <span class="interval-time">
                {{ formatTime(item.appt.start) }} - {{ formatTime(getApptEnd(item.appt)) }}
                </span>
                <span class="interval-label">{{ item.appt.name }}</span>
            </li>
            </template>
            <li v-if="filteredIntervals.length === 0 && !searchQuery" class="no-appointments">
            No hay citas ni intervalos libres de 20+ minutos hoy
            </li>
            <li v-if="filteredIntervals.length === 0 && searchQuery" class="no-appointments">
            No se encontraron citas para "{{ searchQuery }}"
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'Citas de hoy'
    },
    todayIntervals: {
        type: Array,
        required: true,
        default: () => []
    },
    formatTime: {
        type: Function,
        required: true
    }
})

const emit = defineEmits(['patientRedirect'])

// Reactive state
const searchQuery = ref('')

// Computed
const filteredIntervals = computed(() => {
    if (!searchQuery.value.trim()) {
        return props.todayIntervals
    }
    
    const query = searchQuery.value.toLowerCase()
    return props.todayIntervals.filter(item => {
        if (item.type === 'free') {
            return true // Always show free intervals
        }
        return item.appt?.name?.toLowerCase().includes(query)
    })
})

// Methods
function clearSearch() {
    searchQuery.value = ''
}

function getApptEnd(appt) {
    const start = new Date(appt.start)
    const end = new Date(start.getTime() + Number(appt.duration || 0) / 1_000_000)
    return end
}
</script>

<style scoped>
.search-container {
    margin-bottom: 1rem;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--color-text-secondary);
    z-index: 1;
}

.search-input {
    width: 100%;
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-input-bg);
    color: var(--color-text);
    font-size: 0.9rem;
    transition: border-color 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: var(--color-input-border-focus);
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.clear-search {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-search:hover {
    background: var(--color-background-mute);
    color: var(--color-text);
}
</style>