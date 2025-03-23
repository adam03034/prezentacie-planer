<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import type { Project, PlayMode } from '../types'

const emits = defineEmits(['addProject'])
const name = ref('')
const mode = ref<PlayMode>('continuous')
const startTime = ref('')
const endTime = ref('')
const days = ref<number[]>([])

const addProject = () => {
  // Validácia
  if (name.value.trim() === '') {
    alert('Zadajte názov projektu')
    return
  }
  
  if (mode.value !== 'continuous' && (!startTime.value || !endTime.value)) {
    alert('Zadajte čas začiatku a konca prehrávania')
    return
  }
  
  if (mode.value === 'specificDays' && days.value.length === 0) {
    alert('Vyberte aspoň jeden deň na prehrávanie')
    return
  }
  
  const newProject: Project = {
    id: Date.now(),
    name: name.value,
    schedule: {
      mode: mode.value,
      startTime: mode.value !== 'continuous' ? startTime.value : undefined,
      endTime: mode.value !== 'continuous' ? endTime.value : undefined,
      days: mode.value === 'specificDays' ? days.value : undefined
    }
  }
  
  emits('addProject', newProject)
  
  // Vyčistenie formulára
  name.value = ''
  mode.value = 'continuous'
  startTime.value = ''
  endTime.value = ''
  days.value = []
}
</script>

<template>
  <form @submit.prevent="addProject" class="project-form">
    <div class="form-group">
      <label for="project-name">Názov projektu</label>
      <input 
        id="project-name"
        v-model="name" 
        placeholder="Zadajte názov projektu" 
        required 
      />
    </div>
    
    <div class="form-group">
      <label for="play-mode">Režim prehrávania</label>
      <select id="play-mode" v-model="mode">
        <option value="continuous">Bez plánovania (nepretržité)</option>
        <option value="daily">Každodenné prehrávanie</option>
        <option value="specificDays">Prehrávanie v určené dni</option>
      </select>
    </div>
    
    <div v-if="mode !== 'continuous'" class="form-group time-inputs">
      <div>
        <label for="start-time">Čas začiatku</label>
        <input 
          id="start-time"
          type="time" 
          v-model="startTime" 
          required 
        />
      </div>
      <div>
        <label for="end-time">Čas konca</label>
        <input 
          id="end-time"
          type="time" 
          v-model="endTime" 
          required 
        />
      </div>
    </div>
    
    <div v-if="mode === 'specificDays'" class="form-group days-selection">
      <p>Vyberte dni v týždni:</p>
      <div class="days-checkboxes">
        <label v-for="(dayName, index) in ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']" 
               :key="index" 
               class="day-checkbox">
          <input 
            type="checkbox" 
            :value="index" 
            v-model="days" 
          />
          {{ dayName }}
        </label>
      </div>
    </div>
    
    <button type="submit" class="submit-button">Pridať projekt</button>
  </form>
</template>

<style scoped>
.project-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.time-inputs {
  display: flex;
  gap: 15px;
}

.time-inputs > div {
  flex: 1;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.days-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.day-checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>