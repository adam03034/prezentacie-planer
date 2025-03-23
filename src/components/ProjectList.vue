<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Project } from '../types'
import { shouldPlayProject } from '../types'

const props = defineProps<{ 
  projects: Project[],
  currentTime: Date  // Pridaný nový prop
}>()

const emits = defineEmits(['removeProject'])

// Formátovanie dní v týždni
const formatDays = (days?: number[]) => {
  if (!days || days.length === 0) return 'Žiadne vybrané dni';
  const dayNames = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
  return days.map(day => dayNames[day]).join(', ');
}

// Zistenie, či je projekt aktívny v aktuálnom čase
const isProjectActive = (project: Project) => {
  return shouldPlayProject(project, props.currentTime);
}
</script>

<template>
  <div v-if="projects.length === 0" class="empty-list">
    <p>Zatiaľ nie sú pridané žiadne projekty.</p>
  </div>
  
  <ul v-else class="project-list">
    <li v-for="project in projects" 
        :key="project.id" 
        class="project-item"
        :class="{ 'active-project': isProjectActive(project) }">
      
      <div class="project-header">
        <h3>{{ project.name }}</h3>
        <button 
          @click="emits('removeProject', project.id)" 
          class="remove-button"
          title="Odstrániť projekt"
        >
          ×
        </button>
      </div>
      
      <div class="project-details">
        <div class="mode-info">
          <strong>Režim:</strong>
          <span v-if="project.schedule.mode === 'continuous'">
            Bez plánovania (nepretržité prehrávanie)
          </span>
          <span v-else-if="project.schedule.mode === 'daily'">
            Každodenné prehrávanie
          </span>
          <span v-else>
            Prehrávanie v určené dni
          </span>
        </div>
        
        <div v-if="project.schedule.mode !== 'continuous'" class="time-info">
          <strong>Čas prehrávania:</strong>
          {{ project.schedule.startTime }} - {{ project.schedule.endTime }}
        </div>
        
        <div v-if="project.schedule.mode === 'specificDays'" class="days-info">
          <strong>Dni prehrávania:</strong>
          {{ formatDays(project.schedule.days) }}
        </div>
        
        <div class="status-info" :class="{ 'status-active': isProjectActive(project) }">
          {{ isProjectActive(project) ? 'Aktívny' : 'Neaktívny' }}
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.project-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.project-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.active-project {
  border-left: 4px solid #4CAF50;
  background-color: #f8fff8;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.project-header h3 {
  margin: 0;
  color: #333;
}

.remove-button {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-button:hover {
  background-color: #d32f2f;
}

.project-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-info, .time-info, .days-info {
  font-size: 14px;
}

.status-info {
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #f5f5f5;
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
}

.status-active {
  background-color: #4CAF50;
  color: white;
}

.empty-list {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  color: #666;
}
</style>